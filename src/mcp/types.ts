import type { AgentLike } from "../AgentLike";
import type { SmithersWorkflow } from "../SmithersWorkflow";

/**
 * Capabilities the MCP server should advertise.
 */
export type McpCapabilities = {
  /** Expose registered items as MCP tools (default: true) */
  tools?: boolean;
  /** Expose workflow runs as MCP resources (default: true) */
  resources?: boolean;
  /** Expose prompts (default: false, reserved for future use) */
  prompts?: boolean;
};

/**
 * Configuration for creating a Smithers MCP server.
 */
export type SmithersMcpServerConfig = {
  /** Human-readable server name shown to MCP clients */
  name: string;
  /** Semantic version string (e.g. "1.0.0") */
  version: string;
  /** Smithers tools (AI SDK `tool()` format) to expose as MCP tools */
  tools?: Record<string, any>;
  /** Agents to expose as callable MCP tools (tool name = `agent-{key}`) */
  agents?: Record<string, AgentLike>;
  /** Workflows to expose as callable MCP tools (tool name = `workflow-{key}`) */
  workflows?: Record<string, SmithersWorkflow<any>>;
  /** MCP capability flags */
  capabilities?: McpCapabilities;
};

/**
 * An MCP tool definition mapped from a smithers tool, agent, or workflow.
 */
export type McpToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

/**
 * An MCP resource representing a workflow run.
 */
export type McpResourceDefinition = {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
};

/**
 * Transport type for the MCP server.
 */
export type McpTransport = "stdio" | "http";

/**
 * Options for starting the MCP server.
 */
export type McpServerStartOptions = {
  transport?: McpTransport;
  port?: number;
};
