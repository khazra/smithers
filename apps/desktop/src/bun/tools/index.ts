import { promises as fs } from "node:fs";
import { dirname } from "node:path";
import { spawn } from "node:child_process";
import { applyPatch } from "diff";
import { assertPathWithinRoot, resolveSandboxPath, truncateToBytes } from "./sandbox";

export type ToolOutput = {
  output: string;
  details?: Record<string, unknown>;
};

export type ToolRunnerOptions = {
  rootDir: string;
  maxOutputBytes?: number;
  timeoutMs?: number;
  allowNetwork?: boolean;
};

const DEFAULT_MAX_OUTPUT = 200_000;
const DEFAULT_TIMEOUT = 60_000;

export class ToolRunner {
  private rootDir: string;
  private maxOutputBytes: number;
  private timeoutMs: number;
  private allowNetwork: boolean;

  constructor(opts: ToolRunnerOptions) {
    this.rootDir = opts.rootDir;
    this.maxOutputBytes = opts.maxOutputBytes ?? DEFAULT_MAX_OUTPUT;
    this.timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
    this.allowNetwork = Boolean(opts.allowNetwork);
  }

  async read(path: string): Promise<ToolOutput> {
    const resolved = resolveSandboxPath(this.rootDir, path);
    await assertPathWithinRoot(this.rootDir, resolved);
    const stats = await fs.stat(resolved);
    if (stats.size > this.maxOutputBytes) {
      throw new Error(`File too large (${stats.size} bytes)`);
    }
    const content = await fs.readFile(resolved, "utf8");
    return { output: truncateToBytes(content, this.maxOutputBytes) };
  }

  async write(path: string, content: string): Promise<ToolOutput> {
    const resolved = resolveSandboxPath(this.rootDir, path);
    await assertPathWithinRoot(this.rootDir, resolved);
    const bytes = Buffer.byteLength(content, "utf8");
    if (bytes > this.maxOutputBytes) {
      throw new Error(`Content too large (${bytes} bytes)`);
    }
    await fs.mkdir(dirname(resolved), { recursive: true });
    await fs.writeFile(resolved, content, "utf8");
    return { output: "ok", details: { bytes } };
  }

  async edit(path: string, patch: string): Promise<ToolOutput> {
    const resolved = resolveSandboxPath(this.rootDir, path);
    await assertPathWithinRoot(this.rootDir, resolved);
    const patchBytes = Buffer.byteLength(patch, "utf8");
    if (patchBytes > this.maxOutputBytes) {
      throw new Error(`Patch too large (${patchBytes} bytes)`);
    }
    const stats = await fs.stat(resolved);
    if (stats.size > this.maxOutputBytes) {
      throw new Error(`File too large (${stats.size} bytes)`);
    }
    const current = await fs.readFile(resolved, "utf8");
    const updated = applyPatch(current, patch);
    if (updated === false) {
      throw new Error("Failed to apply patch");
    }
    await fs.writeFile(resolved, updated, "utf8");
    return { output: "ok", details: { bytes: Buffer.byteLength(updated, "utf8") } };
  }

  async bash(command: string): Promise<ToolOutput> {
    if (!this.allowNetwork && !isCommandSafe(command)) {
      throw new Error("Network access is disabled for bash commands. Enable allowNetwork to override.");
    }

    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);
    let timedOut = false;

    const child = spawn(command, {
      cwd: this.rootDir,
      shell: true,
      env: {
        ...process.env,
        SMITHERS_BASH_SANDBOX: "1",
      },
      detached: true,
    });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        if (child.pid) {
          process.kill(-child.pid, "SIGKILL");
        }
      } catch {
        try {
          child.kill("SIGKILL");
        } catch {
          // ignore
        }
      }
    }, this.timeoutMs);

    child.stdout?.on("data", (chunk) => {
      stdout = Buffer.concat([stdout, chunk]);
      if (stdout.length > this.maxOutputBytes) {
        stdout = stdout.slice(0, this.maxOutputBytes);
      }
    });

    child.stderr?.on("data", (chunk) => {
      stderr = Buffer.concat([stderr, chunk]);
      if (stderr.length > this.maxOutputBytes) {
        stderr = stderr.slice(0, this.maxOutputBytes);
      }
    });

    const exitCode: number = await new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", resolve);
    });

    clearTimeout(timer);

    if (timedOut) {
      throw new Error(`Command timed out after ${this.timeoutMs}ms`);
    }

    const output = truncateToBytes(stdout.toString("utf8"), this.maxOutputBytes);
    const err = truncateToBytes(stderr.toString("utf8"), this.maxOutputBytes);

    return {
      output: output || err || "",
      details: { stdout: output, stderr: err, exitCode },
    };
  }
}

function isCommandSafe(command: string): boolean {
  const tokens = tokenizeCommand(command);
  if (!tokens.length) return true;

  const blockedExecutables = new Set([
    "curl",
    "wget",
    "ssh",
    "scp",
    "sftp",
    "ftp",
    "git",
    "hg",
    "svn",
    "nc",
    "netcat",
    "telnet",
    "ping",
    "traceroute",
    "dig",
    "nslookup",
    "nmap",
    "openssl",
    "npm",
    "pnpm",
    "yarn",
    "pip",
    "pip3",
    "apt",
    "apt-get",
    "brew",
    "cargo",
    "go",
    "gem",
    "powershell",
    "pwsh",
  ]);

  const interpreterExecutables = new Set(["python", "python3", "node", "deno", "ruby", "perl", "php", "bash", "sh"]);

  for (const token of tokens) {
    const lowered = token.toLowerCase();
    if (blockedExecutables.has(lowered)) return false;
    if (looksLikeUrl(lowered) || looksLikeIp(lowered)) return false;
    if (lowered.startsWith("git@") || lowered.startsWith("ssh://")) return false;
    if (lowered.includes("--proxy") || lowered.includes("http_proxy") || lowered.includes("https_proxy")) return false;
  }

  const first = tokens[0]?.toLowerCase();
  if (first && interpreterExecutables.has(first)) {
    if (tokens.some((t) => t.toLowerCase().includes("http://") || t.toLowerCase().includes("https://"))) {
      return false;
    }
  }

  return true;
}

function tokenizeCommand(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escape = false;

  for (const char of input) {
    if (escape) {
      current += char;
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    if (char === "|" || char === ";" || char === "&") {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }

  if (current) tokens.push(current);
  return tokens;
}

function looksLikeUrl(token: string): boolean {
  return (
    token.includes("://") ||
    token.startsWith("www.") ||
    token.startsWith("http://") ||
    token.startsWith("https://") ||
    token.startsWith("ws://") ||
    token.startsWith("wss://")
  );
}

function looksLikeIp(token: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(token);
}
