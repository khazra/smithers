import {
  BaseCliAgent,
  pushFlag,
} from "./BaseCliAgent";
import type { BaseCliAgentOptions } from "./BaseCliAgent";

type AmpAgentOptions = BaseCliAgentOptions & {
  workDir?: string;
  thread?: string;
  visibility?: "private" | "public" | "workspace" | "group";
  quiet?: boolean;
  mcpConfig?: string;
  settingsFile?: string;
  logLevel?: "error" | "warn" | "info" | "debug" | "audit";
  logFile?: string;
  dangerouslyAllowAll?: boolean;
  ide?: boolean;
  jetbrains?: boolean;
};

export class AmpAgent extends BaseCliAgent {
  private readonly opts: AmpAgentOptions;

  constructor(opts: AmpAgentOptions = {}) {
    super(opts);
    this.opts = opts;
  }

  protected async buildCommand(params: {
    prompt: string;
    systemPrompt?: string;
    cwd: string;
    options: any;
  }) {
    const args: string[] = ["threads", "continue"];
    const yoloEnabled = this.opts.yolo ?? this.yolo;

    // Working directory
    pushFlag(args, "--work-dir", this.opts.workDir ?? params.cwd);

    // Thread ID (if continuing existing thread)
    pushFlag(args, "--thread", this.opts.thread);

    // Visibility for new threads
    pushFlag(args, "--visibility", this.opts.visibility);

    // Model
    pushFlag(args, "--model", this.opts.model ?? this.model);

    // Quiet mode
    if (this.opts.quiet) args.push("--quiet");

    // MCP config
    pushFlag(args, "--mcp-config", this.opts.mcpConfig);

    // Settings file
    pushFlag(args, "--settings-file", this.opts.settingsFile);

    // Log level
    pushFlag(args, "--log-level", this.opts.logLevel);

    // Log file
    pushFlag(args, "--log-file", this.opts.logFile);

    // Dangerous allow all (yolo mode)
    if (this.opts.dangerouslyAllowAll || yoloEnabled) {
      args.push("--dangerously-allow-all");
    }

    // IDE integration
    if (this.opts.ide === false) args.push("--no-ide");
    if (this.opts.jetbrains === false) args.push("--no-jetbrains");

    // Color handling
    args.push("--no-color"); // Disable color for clean output parsing

    if (this.extraArgs?.length) args.push(...this.extraArgs);

    // Build prompt with system prompt prepended
    const systemPrefix = params.systemPrompt
      ? `${params.systemPrompt}\n\n`
      : "";
    const fullPrompt = `${systemPrefix}${params.prompt ?? ""}`;

    // Amp accepts prompt as final argument
    args.push(fullPrompt);

    return {
      command: "amp",
      args,
      outputFormat: "text" as const,
    };
  }
}
