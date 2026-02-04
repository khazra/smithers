import React from "react";
import type {
  WorkflowProps,
  TaskProps,
  SequenceProps,
  ParallelProps,
  BranchProps,
  RalphProps,
} from "./types";
import { getCurrentIteration } from "./runtime/iteration";

let parallelCounter = 0;

export function Workflow(props: WorkflowProps) {
  return React.createElement("smithers:workflow", props, props.children);
}

export function Task<Row>(props: TaskProps<Row>) {
  return React.createElement("smithers:task", props, props.children as any);
}

export function Sequence(props: SequenceProps) {
  if (props.skipIf) return null;
  return React.createElement("smithers:sequence", props, props.children);
}

export function Parallel(props: ParallelProps) {
  if (props.skipIf) return null;
  const id = `parallel-${parallelCounter++}`;
  const nextProps = { ...props, __parallelId: id } as any;
  return React.createElement("smithers:parallel", nextProps, props.children);
}

export function Branch(props: BranchProps) {
  if (props.skipIf) return null;
  const chosen = props.if ? props.then : props.else ?? null;
  return React.createElement("smithers:branch", props, chosen);
}

export function Ralph(props: RalphProps) {
  if (props.skipIf) return null;
  const iteration = getCurrentIteration();
  const nextProps = { ...props, __iteration: iteration } as any;
  return React.createElement("smithers:ralph", nextProps, props.children);
}
