import { openai } from "@ai-sdk/openai";
import { ToolLoopAgent, type ToolSet } from "ai";
import { resolveSdkModel, type SdkAgentOptions } from "./sdk-shared";

export type OpenAIAgentOptions<
  CALL_OPTIONS = never,
  TOOLS extends ToolSet = {},
  OUTPUT = any,
> = SdkAgentOptions<CALL_OPTIONS, TOOLS, OUTPUT, ReturnType<typeof openai>>;

export class OpenAIAgent<
  CALL_OPTIONS = never,
  TOOLS extends ToolSet = {},
  OUTPUT = any,
> extends ToolLoopAgent<CALL_OPTIONS, TOOLS, OUTPUT> {
  constructor(opts: OpenAIAgentOptions<CALL_OPTIONS, TOOLS, OUTPUT>) {
    const { model, ...rest } = opts;
    super({
      ...rest,
      model: resolveSdkModel(model, openai),
    } as any);
  }

  generate(args: {
    options?: CALL_OPTIONS;
    abortSignal?: AbortSignal;
    prompt: string;
    timeout?: { totalMs: number; idleMs?: number };
    onStdout?: (text: string) => void;
    onStderr?: (text: string) => void;
    outputSchema?: import("zod").ZodObject<any>;
  }) {
    return super.generate({
      options: args.options as CALL_OPTIONS,
      abortSignal: args.abortSignal,
      prompt: args.prompt,
      timeout: args.timeout as any,
    } as any);
  }
}
