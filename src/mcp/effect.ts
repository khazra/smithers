import { Context, Effect, Layer } from "effect";
import type { SmithersMcpServer } from "./server";
import type { SmithersMcpServerConfig, McpServerStartOptions } from "./types";
import { createSmithersMcpServer } from "./server";
import { fromPromise } from "../effect/interop";

// ---------------------------------------------------------------------------
// Service tag
// ---------------------------------------------------------------------------

/**
 * Effect service tag for the MCP server.
 * Use this to access the MCP server from Effect programs.
 */
export class McpService extends Context.Tag("McpService")<
  McpService,
  SmithersMcpServer
>() {}

// ---------------------------------------------------------------------------
// Layer constructors
// ---------------------------------------------------------------------------

/**
 * Create an Effect Layer that provides the MCP server.
 */
export function createMcpLayer(
  config: SmithersMcpServerConfig,
): Layer.Layer<McpService> {
  return Layer.sync(McpService, () => createSmithersMcpServer(config));
}

// ---------------------------------------------------------------------------
// Effect-wrapped operations
// ---------------------------------------------------------------------------

/**
 * Start the MCP server within an Effect program.
 */
export function startMcpServer(
  options?: McpServerStartOptions,
): Effect.Effect<void, Error, McpService> {
  return Effect.gen(function* () {
    const server = yield* McpService;
    yield* fromPromise("mcp:start", () => server.start(options));
  }).pipe(
    Effect.withLogSpan("mcp:start-server"),
    Effect.annotateLogs({ transport: options?.transport ?? "stdio" }),
  );
}

/**
 * Stop the MCP server within an Effect program.
 */
export function stopMcpServer(): Effect.Effect<void, Error, McpService> {
  return Effect.gen(function* () {
    const server = yield* McpService;
    yield* fromPromise("mcp:close", () => server.close());
  }).pipe(Effect.withLogSpan("mcp:stop-server"));
}
