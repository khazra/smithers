import React from "react";

export type RalphProps = {
  id?: string;
  until: boolean;
  maxIterations?: number;
  onMaxReached?: "fail" | "return-last";
  skipIf?: boolean;
  children?: React.ReactNode;
};

export function Ralph(props: RalphProps) {
  if (props.skipIf) return null;
  return React.createElement("smithers:ralph", props, props.children);
}
