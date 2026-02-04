import { spawn } from "node:child_process";

export async function getJjPointer(): Promise<string | null> {
  return await new Promise((resolve) => {
    const child = spawn("jj", ["log", "-r", "@", "--no-graph", "--template", "change_id"], {
      stdio: ["ignore", "pipe", "ignore"],
    });
    let out = "";
    child.stdout.on("data", (chunk) => (out += chunk.toString("utf8")));
    child.on("error", () => resolve(null));
    child.on("close", (code) => {
      if (code === 0) resolve(out.trim() || null);
      else resolve(null);
    });
  });
}

export type JjRevertResult = {
  success: boolean;
  error?: string;
};

export async function revertToJjPointer(pointer: string): Promise<JjRevertResult> {
  return await new Promise((resolve) => {
    const child = spawn("jj", ["restore", "--from", pointer], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr?.on("data", (chunk) => (stderr += chunk.toString("utf8")));
    child.on("error", (err) => {
      resolve({ success: false, error: err.message });
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: stderr.trim() || `jj exited with code ${code}` });
      }
    });
  });
}
