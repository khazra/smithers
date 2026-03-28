import { z } from "zod";
import { toJSONSchema } from "zod/v4/core";
import type { McpToolDefinition } from "./types";
import type { AgentLike } from "../AgentLike";
import type { SmithersWorkflow } from "../SmithersWorkflow";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Attempt to extract a JSON Schema from a smithers tool's inputSchema.
 *
 * Smithers tools use `zodSchema(z.object({...}))` from the AI SDK which wraps
 * a Zod schema. We try multiple strategies:
 * 1. If it has a `jsonSchema` property (AI SDK standard schema), use that
 * 2. If it has a `_def` (raw Zod schema), convert with Zod v4's toJSONSchema
 * 3. Fall back to an empty object schema
 */
function extractJsonSchema(inputSchema: unknown): Record<string, unknown> {
  if (!inputSchema) {
    return { type: "object", properties: {} };
  }

  // AI SDK zodSchema wraps the schema - try .jsonSchema first
  const asAny = inputSchema as any;

  // Strategy 1: AI SDK standard schema exposes jsonSchema
  if (asAny.jsonSchema && typeof asAny.jsonSchema === "object") {
    return asAny.jsonSchema as Record<string, unknown>;
  }

  // Strategy 2: It's a raw Zod schema with _zod or _def
  if (asAny._zod || asAny._def) {
    try {
      return toJSONSchema(asAny) as Record<string, unknown>;
    } catch {
      // Fall through
    }
  }

  // Strategy 3: It might be a Zod schema wrapper from AI SDK
  if (asAny.schema && (asAny.schema._zod || asAny.schema._def)) {
    try {
      return toJSONSchema(asAny.schema) as Record<string, unknown>;
    } catch {
      // Fall through
    }
  }

  // Strategy 4: Already plain JSON Schema
  if (asAny.type === "object" && asAny.properties) {
    return asAny as Record<string, unknown>;
  }

  return { type: "object", properties: {} };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Convert a smithers tool (AI SDK `tool()` format) to an MCP tool definition.
 */
export function smithersToolToMcp(name: string, tool: any): McpToolDefinition {
  const description = tool.description ?? `Smithers tool: ${name}`;
  const inputSchema = extractJsonSchema(tool.inputSchema ?? tool.parameters);

  return {
    name,
    description,
    inputSchema,
  };
}

/**
 * Convert a smithers agent to an MCP tool definition.
 * Agents become tools named `agent-{key}` with a simple `{ prompt: string }` input.
 */
export function smithersAgentToMcp(key: string, _agent: AgentLike): McpToolDefinition {
  return {
    name: `agent-${key}`,
    description: `Invoke the "${key}" agent with a prompt. The agent will generate a response using its configured model and tools.`,
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The prompt to send to the agent",
        },
      },
      required: ["prompt"],
    },
  };
}

/**
 * Convert a smithers workflow to an MCP tool definition.
 * Workflows become tools named `workflow-{key}`.
 * The input schema is derived from the workflow's input schema if available.
 */
export function smithersWorkflowToMcp(key: string, workflow: SmithersWorkflow<any>): McpToolDefinition {
  let inputSchema: Record<string, unknown> = {
    type: "object",
    properties: {
      input: {
        type: "object",
        description: "Input data for the workflow",
      },
    },
  };

  // Try to extract input schema from the workflow's schema registry
  if (workflow.schemaRegistry) {
    const registry = workflow.schemaRegistry as Map<string, any>;
    const inputEntry = registry.get("input") ?? registry.get("inputs");
    if (inputEntry?.schema) {
      try {
        const jsonSchema = toJSONSchema(inputEntry.schema);
        inputSchema = jsonSchema as Record<string, unknown>;
      } catch {
        // Keep the default
      }
    }
  }

  return {
    name: `workflow-${key}`,
    description: `Run the "${key}" workflow. Starts a new workflow execution and returns the result.`,
    inputSchema,
  };
}

/**
 * Execute a smithers tool given its name and arguments.
 * Returns a text result or throws.
 */
export async function executeSmithersTool(
  tool: any,
  args: Record<string, unknown>,
): Promise<string> {
  if (typeof tool.execute === "function") {
    const result = await tool.execute(args);
    return typeof result === "string" ? result : JSON.stringify(result);
  }
  throw new Error(`Tool does not have an execute method`);
}

/**
 * Execute an agent with a prompt.
 * Returns the agent's text response.
 */
export async function executeSmithersAgent(
  agent: AgentLike,
  prompt: string,
): Promise<string> {
  const result = await agent.generate({ prompt });
  if (typeof result === "string") return result;
  if (result?.text) return result.text;
  if (result?.output) return typeof result.output === "string" ? result.output : JSON.stringify(result.output);
  return JSON.stringify(result);
}

/**
 * Build the complete list of MCP tool definitions from a server config.
 */
export function buildMcpToolList(config: {
  tools?: Record<string, any>;
  agents?: Record<string, AgentLike>;
  workflows?: Record<string, SmithersWorkflow<any>>;
}): McpToolDefinition[] {
  const result: McpToolDefinition[] = [];

  if (config.tools) {
    for (const [name, tool] of Object.entries(config.tools)) {
      result.push(smithersToolToMcp(name, tool));
    }
  }

  if (config.agents) {
    for (const [key, agent] of Object.entries(config.agents)) {
      result.push(smithersAgentToMcp(key, agent));
    }
  }

  if (config.workflows) {
    for (const [key, workflow] of Object.entries(config.workflows)) {
      result.push(smithersWorkflowToMcp(key, workflow));
    }
  }

  return result;
}
