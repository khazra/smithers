import { describe, test, expect } from "bun:test";
import { createSmithersMcpServer } from "../../src/mcp/server";
import {
  buildMcpToolList,
  executeSmithersTool,
  executeSmithersAgent,
} from "../../src/mcp/tool-mapper";
import { parseRunUri } from "../../src/mcp/resource-mapper";
import type { AgentLike } from "../../src/AgentLike";
import type { McpToolDefinition } from "../../src/mcp/types";

// ---------------------------------------------------------------------------
// End-to-end test: create server, list tools, call tools, verify results
// ---------------------------------------------------------------------------

describe("MCP e2e", () => {
  // Build a realistic server config with tools and an agent
  const echoTool = {
    description: "Echo back the input message",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Message to echo" },
      },
      required: ["message"],
    },
    execute: async (args: any) => `echo: ${args.message}`,
  };

  const uppercaseTool = {
    description: "Convert text to uppercase",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
      },
      required: ["text"],
    },
    execute: async (args: any) => (args.text as string).toUpperCase(),
  };

  const testAgent: AgentLike = {
    id: "test-agent",
    generate: async ({ prompt }: any) => ({
      text: `Agent response to: ${prompt}`,
    }),
  };

  test("full lifecycle: create server, list tools, call tools", async () => {
    // 1. Create server
    const server = createSmithersMcpServer({
      name: "e2e-test",
      version: "0.1.0",
      tools: { echo: echoTool, uppercase: uppercaseTool },
      agents: { assistant: testAgent },
    });

    // 2. List tools
    const tools = server.listTools();
    expect(tools.length).toBe(3); // echo + uppercase + agent-assistant

    const toolNames = tools.map((t: McpToolDefinition) => t.name);
    expect(toolNames).toContain("echo");
    expect(toolNames).toContain("uppercase");
    expect(toolNames).toContain("agent-assistant");

    // 3. Verify tool definitions have proper schemas
    const echoMcp = tools.find((t: McpToolDefinition) => t.name === "echo")!;
    expect(echoMcp.description).toBe("Echo back the input message");
    expect(echoMcp.inputSchema).toHaveProperty("type", "object");
    expect((echoMcp.inputSchema as any).properties).toHaveProperty("message");

    const agentMcp = tools.find((t: McpToolDefinition) => t.name === "agent-assistant")!;
    expect(agentMcp.inputSchema).toHaveProperty("type", "object");
    expect((agentMcp.inputSchema as any).properties).toHaveProperty("prompt");
  });

  test("execute tools directly and verify results", async () => {
    // Call echo tool
    const echoResult = await executeSmithersTool(echoTool, { message: "hello world" });
    expect(echoResult).toBe("echo: hello world");

    // Call uppercase tool
    const upperResult = await executeSmithersTool(uppercaseTool, { text: "hello" });
    expect(upperResult).toBe("HELLO");
  });

  test("execute agent and verify result", async () => {
    const result = await executeSmithersAgent(testAgent, "what is 2+2?");
    expect(result).toBe("Agent response to: what is 2+2?");
  });

  test("tool list from buildMcpToolList matches server.listTools", () => {
    const config = {
      tools: { echo: echoTool, uppercase: uppercaseTool },
      agents: { assistant: testAgent },
    };

    const fromBuilder = buildMcpToolList(config);
    const server = createSmithersMcpServer({
      name: "test",
      version: "1.0.0",
      ...config,
    });
    const fromServer = server.listTools();

    expect(fromBuilder.length).toBe(fromServer.length);
    expect(fromBuilder.map((t) => t.name).sort()).toEqual(
      fromServer.map((t) => t.name).sort(),
    );
  });

  test("resource URI parsing round-trips", () => {
    const runId = "run-e2e-test-123";
    const uri = `smithers://runs/${runId}`;
    expect(parseRunUri(uri)).toBe(runId);
  });

  test("server handles multiple tool types without conflicts", () => {
    // Create a server with overlapping names (should be fine since prefixes differ)
    const workflow = { db: {}, build: () => null as any, opts: {} };
    const agent: AgentLike = { generate: async () => "hi" };

    const server = createSmithersMcpServer({
      name: "mixed",
      version: "1.0.0",
      tools: { echo: echoTool },
      agents: { echo: agent }, // Same key as tool, but different MCP name
      workflows: { echo: workflow as any }, // Same key again
    });

    const tools = server.listTools();
    const names = tools.map((t: McpToolDefinition) => t.name);

    // Each should have a unique MCP name
    expect(names).toContain("echo");
    expect(names).toContain("agent-echo");
    expect(names).toContain("workflow-echo");
    expect(new Set(names).size).toBe(3); // All unique
  });
});
