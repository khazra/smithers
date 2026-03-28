import { Effect, Metric } from "effect";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";

import type { SmithersMcpServerConfig, McpServerStartOptions } from "./types";
import {
  buildMcpToolList,
  executeSmithersTool,
  executeSmithersAgent,
} from "./tool-mapper";
import { listRunResources, readRunResource, parseRunUri } from "./resource-mapper";
import { SmithersDb } from "../db/adapter";
import { ensureSmithersTables } from "../db/ensure";
import { runPromise } from "../effect/runtime";
import {
  mcpToolCallsTotal,
  mcpToolCallErrorsTotal,
  mcpToolDuration,
  mcpActiveConnections,
} from "../effect/metrics";
import { nowMs } from "../utils/time";

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

/**
 * A smithers MCP server that exposes tools, agents, and workflows
 * to external MCP clients (Claude Desktop, Cursor, Windsurf, etc.).
 */
export class SmithersMcpServer {
  private server: Server;
  private config: SmithersMcpServerConfig;
  private stdioTransport?: StdioServerTransport;
  private adapter?: SmithersDb;

  constructor(config: SmithersMcpServerConfig) {
    this.config = config;

    const capabilities: ServerCapabilities = {};
    const caps = config.capabilities ?? {};

    if (caps.tools !== false) {
      capabilities.tools = {};
    }

    if (caps.resources !== false) {
      capabilities.resources = {};
    }

    this.server = new Server(
      { name: config.name, version: config.version },
      { capabilities },
    );

    this.registerHandlers();
  }

  // -----------------------------------------------------------------------
  // Handler registration
  // -----------------------------------------------------------------------

  private registerHandlers(): void {
    const tools = buildMcpToolList(this.config);
    const toolMap = new Map(tools.map((t) => [t.name, t]));

    // -- List tools --------------------------------------------------------
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: tools.map((t) => ({
          name: t.name,
          description: t.description,
          inputSchema: t.inputSchema as any,
        })),
      };
    });

    // -- Call tool ----------------------------------------------------------
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const toolName = request.params.name;
      const args = (request.params.arguments ?? {}) as Record<string, unknown>;
      const startMs = nowMs();

      try {
        let resultText: string;

        if (this.config.tools && toolName in this.config.tools) {
          // Direct smithers tool
          resultText = await executeSmithersTool(
            this.config.tools[toolName],
            args,
          );
        } else if (toolName.startsWith("agent-")) {
          // Agent tool
          const agentKey = toolName.slice("agent-".length);
          const agent = this.config.agents?.[agentKey];
          if (!agent) {
            throw new Error(`Agent not found: ${agentKey}`);
          }
          resultText = await executeSmithersAgent(
            agent,
            (args.prompt as string) ?? "",
          );
        } else if (toolName.startsWith("workflow-")) {
          // Workflow tool
          const workflowKey = toolName.slice("workflow-".length);
          const workflow = this.config.workflows?.[workflowKey];
          if (!workflow) {
            throw new Error(`Workflow not found: ${workflowKey}`);
          }
          resultText = await this.executeWorkflow(workflow, args);
        } else {
          throw new Error(`Unknown tool: ${toolName}`);
        }

        // Track success metrics
        const durationMs = nowMs() - startMs;
        void runPromise(
          Effect.all([
            Metric.increment(mcpToolCallsTotal),
            Metric.update(mcpToolDuration, durationMs),
          ], { discard: true }),
        ).catch(() => {});

        return {
          content: [{ type: "text" as const, text: resultText }],
        };
      } catch (error: any) {
        // Track error metrics
        const durationMs = nowMs() - startMs;
        void runPromise(
          Effect.all([
            Metric.increment(mcpToolCallsTotal),
            Metric.increment(mcpToolCallErrorsTotal),
            Metric.update(mcpToolDuration, durationMs),
          ], { discard: true }),
        ).catch(() => {});

        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error?.message ?? String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });

    // -- List resources -----------------------------------------------------
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      if (!this.adapter) {
        return { resources: [] };
      }

      try {
        const resources = await listRunResources(this.adapter);
        return {
          resources: resources.map((r) => ({
            uri: r.uri,
            name: r.name,
            description: r.description,
            mimeType: r.mimeType,
          })),
        };
      } catch {
        return { resources: [] };
      }
    });

    // -- Read resource ------------------------------------------------------
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const runId = parseRunUri(uri);

      if (!runId || !this.adapter) {
        throw new Error(`Resource not found: ${uri}`);
      }

      const resource = await readRunResource(this.adapter, runId);
      if (!resource) {
        throw new Error(`Run not found: ${runId}`);
      }

      return {
        contents: [
          {
            uri: resource.uri,
            mimeType: "application/json",
            text: resource.text,
          },
        ],
      };
    });
  }

  // -----------------------------------------------------------------------
  // Workflow execution
  // -----------------------------------------------------------------------

  private async executeWorkflow(
    workflow: any,
    input: Record<string, unknown>,
  ): Promise<string> {
    const { runWorkflow } = await import("../engine");
    const result = await runWorkflow(workflow, { input });
    return JSON.stringify(result);
  }

  // -----------------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------------

  /**
   * Set a database adapter for resource listing (optional).
   * If a workflow is registered, the adapter is resolved from its db.
   */
  setAdapter(adapter: SmithersDb): void {
    this.adapter = adapter;
  }

  /**
   * Start the MCP server.
   */
  async start(options: McpServerStartOptions = {}): Promise<void> {
    const transport = options.transport ?? "stdio";

    // Try to resolve an adapter from the first registered workflow
    if (!this.adapter && this.config.workflows) {
      const firstWorkflow = Object.values(this.config.workflows)[0];
      if (firstWorkflow?.db) {
        try {
          ensureSmithersTables(firstWorkflow.db as any);
          this.adapter = new SmithersDb(firstWorkflow.db as any);
        } catch {
          // DB not available — resources will return empty
        }
      }
    }

    if (transport === "stdio") {
      await this.startStdio();
    } else {
      await this.startHttp(options.port ?? 3001);
    }

    // Track server start
    void runPromise(
      Metric.update(mcpActiveConnections, 1),
    ).catch(() => {});
  }

  private async startStdio(): Promise<void> {
    this.stdioTransport = new StdioServerTransport();
    await this.server.connect(this.stdioTransport);
  }

  private async startHttp(port: number): Promise<void> {
    // Use Streamable HTTP transport for HTTP mode
    const { StreamableHTTPServerTransport } = await import(
      "@modelcontextprotocol/sdk/server/streamableHttp.js"
    );

    const httpTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
    });

    await this.server.connect(httpTransport);

    // Use Bun.serve for the HTTP server
    const handler = httpTransport;
    (Bun as any).serve({
      port,
      hostname: "127.0.0.1",
      fetch: async (req: Request) => {
        const url = new URL(req.url);
        if (url.pathname === "/mcp") {
          // @ts-expect-error - handleRequest exists on StreamableHTTPServerTransport
          return handler.handleRequest(req);
        }
        return new Response("Smithers MCP Server", { status: 200 });
      },
    });

    process.stderr.write(
      `[smithers] MCP server listening on http://127.0.0.1:${port}/mcp\n`,
    );
  }

  /**
   * Close the MCP server and release resources.
   */
  async close(): Promise<void> {
    void runPromise(
      Metric.update(mcpActiveConnections, -1),
    ).catch(() => {});

    await this.server.close();
  }

  /**
   * Get the list of tools that would be exposed by this server.
   */
  listTools() {
    return buildMcpToolList(this.config);
  }
}

// ---------------------------------------------------------------------------
// Factory function
// ---------------------------------------------------------------------------

/**
 * Create a new Smithers MCP server.
 *
 * @example
 * ```ts
 * import { createSmithersMcpServer } from "smithers-orchestrator/mcp";
 * import { tools } from "smithers-orchestrator/tools";
 *
 * const server = createSmithersMcpServer({
 *   name: "my-project",
 *   version: "1.0.0",
 *   tools,
 * });
 *
 * await server.start({ transport: "stdio" });
 * ```
 */
export function createSmithersMcpServer(
  config: SmithersMcpServerConfig,
): SmithersMcpServer {
  return new SmithersMcpServer(config);
}
