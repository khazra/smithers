// Types
export type {
  XmlNode,
  XmlElement,
  XmlText,
  TaskDescriptor,
  AgentLike,
  GraphSnapshot,
  RunStatus,
  RunOptions,
  RunResult,
  OutputKey,
  SmithersWorkflowOptions,
  SchemaRegistryEntry,
  SmithersWorkflow,
  SmithersCtx,
  OutputAccessor,
  InferRow,
  InferOutputEntry,
  SmithersEvent,
  WorkflowProps,
  TaskProps,
  SequenceProps,
  ParallelProps,
  MergeQueueProps,
  BranchProps,
  RalphProps,
  WorktreeProps,
  SmithersError,
} from "./types";

// Components
export {
  Workflow,
  Task,
  Sequence,
  Parallel,
  MergeQueue,
  Branch,
  Ralph,
  Worktree,
} from "./components";

// Agents
export {
  ClaudeCodeAgent,
  CodexAgent,
  GeminiAgent,
  PiAgent,
} from "./agents/cli";
export type {
  PiExtensionUiRequest,
  PiExtensionUiResponse,
  PiAgentOptions,
} from "./agents/cli";

// VCS
export {
  runJj,
  getJjPointer,
  revertToJjPointer,
  isJjRepo,
  workspaceAdd,
  workspaceList,
  workspaceClose,
} from "./vcs/jj";
export type {
  RunJjOptions,
  RunJjResult,
  JjRevertResult,
  WorkspaceAddOptions,
  WorkspaceResult,
  WorkspaceInfo,
} from "./vcs/jj";

// Core API
export { createSmithers } from "./create";
export type { CreateSmithersApi } from "./create";
export { runWorkflow, renderFrame } from "./engine";

// Tools
export { tools, read, write, edit, grep, bash } from "./tools/index";

// Server
export { startServer } from "./server/index";
export type { ServerOptions } from "./server/index";

// DB
export { SmithersDb } from "./db/adapter";
export { ensureSmithersTables } from "./db/ensure";

// Renderer
export { SmithersRenderer } from "./dom/renderer";
export type { HostContainer } from "./dom/renderer";

// Revert
export { revertToAttempt } from "./revert";
export type { RevertOptions, RevertResult } from "./revert";

// Utilities
export { mdxPlugin } from "./mdx-plugin";
export { markdownComponents, renderMdx } from "./mdx-components";
export {
  zodToTable,
  zodToCreateTableSQL,
  camelToSnake,
  unwrapZodType,
} from "./zod-to-table";
export { zodSchemaToJsonExample } from "./zod-to-example";
