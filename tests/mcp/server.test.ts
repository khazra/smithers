import { describe, test, expect } from "bun:test";
import { createSmithersMcpServer, SmithersMcpServer } from "../../src/mcp/server";
import type { AgentLike } from "../../src/AgentLike";

describe("createSmithersMcpServer", () => {
  test("creates a server instance", () => {
    const server = createSmithersMcpServer({
      name: "test",
      version: "1.0.0",
    });
    expect(server).toBeInstanceOf(SmithersMcpServer);
  });

  test("server lists tools from config", () => {
    const server = createSmithersMcpServer({
      name: "test",
      version: "1.0.0",
      tools: {
        read: {
          description: "Read a file",
          inputSchema: { type: "object", properties: { path: { type: "string" } } },
          execute: async () => "content",
        },
        write: {
          description: "Write a file",
          inputSchema: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } } },
          execute: async () => "ok",
        },
      },
    });

    const tools = server.listTools();
    expect(tools.length).toBe(2);
    expect(tools.map((t) => t.name)).toContain("read");
    expect(tools.map((t) => t.name)).toContain("write");
  });

  test("server lists agent tools", () => {
    const agent: AgentLike = {
      id: "reviewer",
      generate: async () => "review done",
    };

    const server = createSmithersMcpServer({
      name: "test",
      version: "1.0.0",
      agents: { reviewer: agent },
    });

    const tools = server.listTools();
    expect(tools.length).toBe(1);
    expect(tools[0]!.name).toBe("agent-reviewer");
  });

  test("server combines tools, agents, and workflows", () => {
    const agent: AgentLike = { generate: async () => "hi" };
    const workflow = { db: {}, build: () => null as any, opts: {} };

    const server = createSmithersMcpServer({
      name: "test",
      version: "1.0.0",
      tools: { read: { description: "Read", execute: async () => "ok" } },
      agents: { helper: agent },
      workflows: { deploy: workflow as any },
    });

    const tools = server.listTools();
    expect(tools.length).toBe(3);

    const names = tools.map((t) => t.name);
    expect(names).toContain("read");
    expect(names).toContain("agent-helper");
    expect(names).toContain("workflow-deploy");
  });

  test("server with no tools/agents/workflows lists empty", () => {
    const server = createSmithersMcpServer({
      name: "empty",
      version: "0.0.1",
    });

    const tools = server.listTools();
    expect(tools).toEqual([]);
  });

  test("server with capabilities.tools=false throws because MCP SDK requires capability", () => {
    // The MCP SDK enforces that tools capability must be enabled to register tool handlers.
    // When tools=false, the server constructor throws.
    expect(() =>
      createSmithersMcpServer({
        name: "test",
        version: "1.0.0",
        tools: { read: { description: "Read", execute: async () => "ok" } },
        capabilities: { tools: false },
      }),
    ).toThrow();
  });
});

describe("SmithersMcpServer.close", () => {
  test("close can be called on a server that was never started", async () => {
    const server = createSmithersMcpServer({
      name: "test",
      version: "1.0.0",
    });
    // close() should not throw even if never started
    await server.close();
  });
});
