import type { SmithersEvent } from "./SmithersEvent";

export type RunOptions = {
  runId?: string;
  input: Record<string, unknown>;
  maxConcurrency?: number;
  onProgress?: (e: SmithersEvent) => void;
  signal?: AbortSignal;
  resume?: boolean;
  workflowPath?: string;
  rootDir?: string;
  logDir?: string | null;
  allowNetwork?: boolean;
  maxOutputBytes?: number;
  toolTimeoutMs?: number;
};
