import React from "react";
import { z } from "zod";
import { getTaskRuntime } from "../effect/task-runtime";
import { SmithersDb } from "../db/adapter";

export const approvalDecisionSchema = z.object({
  approved: z.boolean(),
  note: z.string().nullable(),
  decidedBy: z.string().nullable(),
  decidedAt: z.string().datetime().nullable(),
});

export type ApprovalDecision = z.infer<typeof approvalDecisionSchema>;

export type ApprovalRequest = {
  title: string;
  summary?: string;
  metadata?: Record<string, unknown>;
};

export type ApprovalProps<Row = ApprovalDecision> = {
  id: string;
  output: any;
  outputSchema?: import("zod").ZodObject<any>;
  request: ApprovalRequest;
  onDeny?: "fail" | "continue" | "skip";
  skipIf?: boolean;
  timeoutMs?: number;
  retries?: number;
  retryPolicy?: import("../RetryPolicy").RetryPolicy;
  continueOnFail?: boolean;
  cache?: import("../CachePolicy").CachePolicy;
  label?: string;
  meta?: Record<string, unknown>;
  key?: string;
  children?: React.ReactNode;
};

export function Approval<Row = ApprovalDecision>(props: ApprovalProps<Row>) {
  if (props.skipIf) return null;

  const requestMeta = {
    ...(props.request.summary ? { requestSummary: props.request.summary } : {}),
    ...(props.request.metadata ?? {}),
    ...(props.meta ?? {}),
  };

  const computeDecision = async (): Promise<ApprovalDecision> => {
    const runtime = getTaskRuntime();
    if (!runtime) {
      throw new Error(
        "Approval decisions can only be resolved while a Smithers task is executing.",
      );
    }
    const adapter = new SmithersDb(runtime.db);
    const approval = await adapter.getApproval(
      runtime.runId,
      props.id,
      runtime.iteration,
    );
    return {
      approved: approval?.status === "approved",
      note: approval?.note ?? null,
      decidedBy: approval?.decidedBy ?? null,
      decidedAt:
        typeof approval?.decidedAtMs === "number"
          ? new Date(approval.decidedAtMs).toISOString()
          : null,
    };
  };

  return React.createElement("smithers:task", {
    id: props.id,
    key: props.key,
    output: props.output,
    outputSchema: props.outputSchema ?? approvalDecisionSchema,
    needsApproval: true,
    approvalMode: "decision",
    approvalOnDeny: props.onDeny,
    timeoutMs: props.timeoutMs,
    retries: props.retries,
    retryPolicy: props.retryPolicy,
    continueOnFail: props.continueOnFail,
    cache: props.cache,
    label: props.label ?? props.request.title,
    meta: Object.keys(requestMeta).length > 0 ? requestMeta : undefined,
    __smithersKind: "compute",
    __smithersComputeFn: computeDecision,
  });
}
