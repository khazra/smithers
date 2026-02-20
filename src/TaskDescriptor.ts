import type { AgentLike } from "./AgentLike";

export type TaskDescriptor = {
  nodeId: string;
  ordinal: number;
  iteration: number;
  ralphId?: string;
  worktreeId?: string;
  worktreePath?: string;
  outputTable: any | null;
  outputTableName: string;
  outputSchema?: import("zod").ZodObject<any>;
  parallelGroupId?: string;
  parallelMaxConcurrency?: number;
  needsApproval: boolean;
  skipIf: boolean;
  retries: number;
  timeoutMs: number | null;
  continueOnFail: boolean;
  agent?: AgentLike;
  /** Fallback agent used on retry when the primary agent fails (e.g. rate-limited). */
  fallbackAgent?: AgentLike;
  prompt?: string;
  staticPayload?: unknown;
  computeFn?: () => unknown | Promise<unknown>;
  label?: string;
  meta?: Record<string, unknown>;
};
