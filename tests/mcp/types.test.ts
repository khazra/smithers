import { describe, test, expect } from "bun:test";
import type {
  SmithersMcpServerConfig,
  McpCapabilities,
  McpToolDefinition,
  McpResourceDefinition,
  McpTransport,
  McpServerStartOptions,
} from "../../src/mcp/types";

describe("MCP types", () => {
  test("SmithersMcpServerConfig requires name and version", () => {
    const config: SmithersMcpServerConfig = {
      name: "test-server",
      version: "1.0.0",
    };
    expect(config.name).toBe("test-server");
    expect(config.version).toBe("1.0.0");
    expect(config.tools).toBeUndefined();
    expect(config.agents).toBeUndefined();
    expect(config.workflows).toBeUndefined();
  });

  test("SmithersMcpServerConfig accepts optional fields", () => {
    const config: SmithersMcpServerConfig = {
      name: "test",
      version: "0.1.0",
      tools: { myTool: {} },
      agents: { myAgent: { generate: async () => "hello" } },
      capabilities: { tools: true, resources: false },
    };
    expect(config.tools).toHaveProperty("myTool");
    expect(config.agents).toHaveProperty("myAgent");
    expect(config.capabilities?.tools).toBe(true);
    expect(config.capabilities?.resources).toBe(false);
  });

  test("McpCapabilities defaults are undefined (treated as true)", () => {
    const caps: McpCapabilities = {};
    expect(caps.tools).toBeUndefined();
    expect(caps.resources).toBeUndefined();
    expect(caps.prompts).toBeUndefined();
  });

  test("McpToolDefinition structure", () => {
    const tool: McpToolDefinition = {
      name: "read",
      description: "Read a file",
      inputSchema: {
        type: "object",
        properties: { path: { type: "string" } },
        required: ["path"],
      },
    };
    expect(tool.name).toBe("read");
    expect(tool.inputSchema).toHaveProperty("type", "object");
  });

  test("McpResourceDefinition structure", () => {
    const resource: McpResourceDefinition = {
      uri: "smithers://runs/run-123",
      name: "Run run-123",
      description: "Workflow run",
      mimeType: "application/json",
    };
    expect(resource.uri).toContain("smithers://runs/");
    expect(resource.mimeType).toBe("application/json");
  });

  test("McpTransport is stdio or http", () => {
    const stdio: McpTransport = "stdio";
    const http: McpTransport = "http";
    expect(stdio).toBe("stdio");
    expect(http).toBe("http");
  });

  test("McpServerStartOptions accepts transport and port", () => {
    const opts: McpServerStartOptions = {
      transport: "http",
      port: 3001,
    };
    expect(opts.transport).toBe("http");
    expect(opts.port).toBe(3001);
  });

  test("McpServerStartOptions can be empty", () => {
    const opts: McpServerStartOptions = {};
    expect(opts.transport).toBeUndefined();
    expect(opts.port).toBeUndefined();
  });
});
