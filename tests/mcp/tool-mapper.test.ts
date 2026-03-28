import { describe, test, expect } from "bun:test";
import { z } from "zod";
import { tool, zodSchema } from "ai";
import {
  smithersToolToMcp,
  smithersAgentToMcp,
  smithersWorkflowToMcp,
  buildMcpToolList,
  executeSmithersTool,
  executeSmithersAgent,
} from "../../src/mcp/tool-mapper";
import type { AgentLike } from "../../src/AgentLike";

// ---------------------------------------------------------------------------
// smithersToolToMcp
// ---------------------------------------------------------------------------

describe("smithersToolToMcp", () => {
  test("converts a basic AI SDK tool to MCP format", () => {
    const readTool = tool({
      description: "Read a file",
      inputSchema: zodSchema(z.object({ path: z.string() })),
      execute: async ({ path }: { path: string }) => `contents of ${path}`,
    });

    const mcp = smithersToolToMcp("read", readTool);
    expect(mcp.name).toBe("read");
    expect(mcp.description).toBe("Read a file");
    expect(mcp.inputSchema).toBeDefined();
    // Input schema should be a JSON Schema object
    expect(typeof mcp.inputSchema).toBe("object");
  });

  test("falls back to default description when tool has none", () => {
    const myTool = { execute: async () => "result" };
    const mcp = smithersToolToMcp("custom", myTool);
    expect(mcp.description).toBe("Smithers tool: custom");
  });

  test("handles tool with plain JSON schema input", () => {
    const myTool = {
      description: "My tool",
      inputSchema: {
        type: "object",
        properties: { x: { type: "number" } },
        required: ["x"],
      },
      execute: async () => "done",
    };
    const mcp = smithersToolToMcp("calc", myTool);
    expect(mcp.inputSchema).toHaveProperty("type", "object");
    expect((mcp.inputSchema as any).properties).toHaveProperty("x");
  });

  test("handles tool with no inputSchema", () => {
    const myTool = {
      description: "No input",
      execute: async () => "ok",
    };
    const mcp = smithersToolToMcp("noop", myTool);
    expect(mcp.inputSchema).toHaveProperty("type", "object");
  });
});

// ---------------------------------------------------------------------------
// smithersAgentToMcp
// ---------------------------------------------------------------------------

describe("smithersAgentToMcp", () => {
  test("creates an agent MCP tool with prompt input", () => {
    const agent: AgentLike = {
      generate: async () => "hello",
    };
    const mcp = smithersAgentToMcp("reviewer", agent);
    expect(mcp.name).toBe("agent-reviewer");
    expect(mcp.description).toContain("reviewer");
    expect(mcp.inputSchema).toHaveProperty("type", "object");
    expect((mcp.inputSchema as any).properties).toHaveProperty("prompt");
    expect((mcp.inputSchema as any).required).toContain("prompt");
  });

  test("different agent keys produce different tool names", () => {
    const agent: AgentLike = { generate: async () => "hi" };
    const a = smithersAgentToMcp("coder", agent);
    const b = smithersAgentToMcp("planner", agent);
    expect(a.name).toBe("agent-coder");
    expect(b.name).toBe("agent-planner");
    expect(a.name).not.toBe(b.name);
  });
});

// ---------------------------------------------------------------------------
// smithersWorkflowToMcp
// ---------------------------------------------------------------------------

describe("smithersWorkflowToMcp", () => {
  test("creates a workflow MCP tool", () => {
    const workflow = {
      db: {},
      build: () => null as any,
      opts: {},
    };
    const mcp = smithersWorkflowToMcp("review", workflow as any);
    expect(mcp.name).toBe("workflow-review");
    expect(mcp.description).toContain("review");
    expect(mcp.inputSchema).toHaveProperty("type", "object");
  });

  test("extracts input schema from workflow schemaRegistry", () => {
    const inputSchema = z.object({
      repo: z.string(),
      branch: z.string(),
    });
    const registry = new Map();
    registry.set("input", { schema: inputSchema });

    const workflow = {
      db: {},
      build: () => null as any,
      opts: {},
      schemaRegistry: registry,
    };
    const mcp = smithersWorkflowToMcp("deploy", workflow as any);
    expect(mcp.name).toBe("workflow-deploy");
    // The schema should have been converted to JSON Schema
    expect(mcp.inputSchema).toHaveProperty("type", "object");
  });
});

// ---------------------------------------------------------------------------
// buildMcpToolList
// ---------------------------------------------------------------------------

describe("buildMcpToolList", () => {
  test("combines tools, agents, and workflows", () => {
    const readTool = {
      description: "Read",
      inputSchema: { type: "object", properties: {} },
      execute: async () => "content",
    };
    const agent: AgentLike = { generate: async () => "response" };
    const workflow = {
      db: {},
      build: () => null as any,
      opts: {},
    };

    const list = buildMcpToolList({
      tools: { read: readTool },
      agents: { helper: agent },
      workflows: { deploy: workflow as any },
    });

    expect(list.length).toBe(3);
    const names = list.map((t) => t.name);
    expect(names).toContain("read");
    expect(names).toContain("agent-helper");
    expect(names).toContain("workflow-deploy");
  });

  test("returns empty list when nothing is provided", () => {
    const list = buildMcpToolList({});
    expect(list).toEqual([]);
  });

  test("works with tools only", () => {
    const list = buildMcpToolList({
      tools: { a: { description: "A", execute: async () => "ok" } },
    });
    expect(list.length).toBe(1);
    expect(list[0]!.name).toBe("a");
  });
});

// ---------------------------------------------------------------------------
// executeSmithersTool
// ---------------------------------------------------------------------------

describe("executeSmithersTool", () => {
  test("calls execute and returns string result", async () => {
    const myTool = {
      execute: async (args: any) => `read ${args.path}`,
    };
    const result = await executeSmithersTool(myTool, { path: "test.ts" });
    expect(result).toBe("read test.ts");
  });

  test("stringifies non-string results", async () => {
    const myTool = {
      execute: async () => ({ count: 42 }),
    };
    const result = await executeSmithersTool(myTool, {});
    expect(result).toBe('{"count":42}');
  });

  test("throws if tool has no execute method", async () => {
    expect(executeSmithersTool({}, {})).rejects.toThrow("execute");
  });
});

// ---------------------------------------------------------------------------
// executeSmithersAgent
// ---------------------------------------------------------------------------

describe("executeSmithersAgent", () => {
  test("calls generate and returns text", async () => {
    const agent: AgentLike = {
      generate: async ({ prompt }: any) => `echo: ${prompt}`,
    };
    const result = await executeSmithersAgent(agent, "hello");
    expect(result).toBe("echo: hello");
  });

  test("extracts .text from result object", async () => {
    const agent: AgentLike = {
      generate: async () => ({ text: "response text" }),
    };
    const result = await executeSmithersAgent(agent, "test");
    expect(result).toBe("response text");
  });

  test("extracts .output from result object", async () => {
    const agent: AgentLike = {
      generate: async () => ({ output: "output text" }),
    };
    const result = await executeSmithersAgent(agent, "test");
    expect(result).toBe("output text");
  });

  test("stringifies complex results", async () => {
    const agent: AgentLike = {
      generate: async () => ({ data: [1, 2, 3] }),
    };
    const result = await executeSmithersAgent(agent, "test");
    expect(JSON.parse(result)).toEqual({ data: [1, 2, 3] });
  });
});
