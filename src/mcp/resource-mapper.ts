import type { SmithersDb } from "../db/adapter";
import type { McpResourceDefinition } from "./types";

/**
 * List recent workflow runs as MCP resources.
 * Each run gets a URI of `smithers://runs/{runId}`.
 */
export async function listRunResources(
  adapter: SmithersDb,
  limit = 50,
): Promise<McpResourceDefinition[]> {
  const runs = await adapter.listRuns(limit);
  return (runs as any[]).map((run: any) => ({
    uri: `smithers://runs/${run.runId}`,
    name: `Run ${run.runId}`,
    description: `Workflow run ${run.runId} (status: ${run.status ?? "unknown"})`,
    mimeType: "application/json",
  }));
}

/**
 * Read a specific workflow run as an MCP resource.
 * Returns JSON with the run's status, outputs, and event timeline.
 */
export async function readRunResource(
  adapter: SmithersDb,
  runId: string,
): Promise<{ uri: string; text: string } | null> {
  const run = await adapter.getRun(runId);
  if (!run) return null;

  // Gather additional data
  let nodes: any[] = [];
  let events: any[] = [];

  try {
    nodes = await adapter.listNodes(runId) as any[];
  } catch {
    // Nodes may not be available
  }

  try {
    events = await adapter.listEvents(runId, -1, 100) as any[];
  } catch {
    // Events may not be available
  }

  const data = {
    runId: (run as any).runId,
    status: (run as any).status,
    startedAtMs: (run as any).startedAtMs ?? (run as any).createdAtMs,
    finishedAtMs: (run as any).finishedAtMs,
    nodes: nodes.map((n: any) => ({
      nodeId: n.nodeId,
      status: n.status,
      iteration: n.iteration,
    })),
    recentEvents: events.slice(-20).map((e: any) => ({
      type: e.type ?? e.eventType,
      nodeId: e.nodeId,
      timestampMs: e.timestampMs,
    })),
  };

  return {
    uri: `smithers://runs/${runId}`,
    text: JSON.stringify(data, null, 2),
  };
}

/**
 * Parse a run ID from a `smithers://runs/{runId}` URI.
 * Returns null if the URI doesn't match the expected format.
 */
export function parseRunUri(uri: string): string | null {
  const match = uri.match(/^smithers:\/\/runs\/(.+)$/);
  return match ? match[1]! : null;
}
