import { resolve, sep } from "node:path";
import type { RpcSend } from "@smithers/core";
import { createAppRuntime } from "@smithers/core";

const runtime = createAppRuntime({
  dbPath: process.env.SMITHERS_DB_PATH,
  workspaceRoot: process.env.SMITHERS_WORKSPACE,
});

const publicDir = resolve(import.meta.dir, "../../packages/ui/assets");

const noopSend: RpcSend = {
  agentEvent: () => {},
  chatMessage: () => {},
  workflowEvent: () => {},
  workflowFrame: () => {},
  workspaceState: () => {},
  toast: () => {},
};

let currentAbort: (() => void) | null = null;

function sendEvent(writer: WritableStreamDefaultWriter, event: string, payload: unknown) {
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  return writer.write(new TextEncoder().encode(data));
}

function attachClient(writer: WritableStreamDefaultWriter) {
  if (currentAbort) currentAbort();
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    try {
      writer.close();
    } catch {
      // ignore
    }
    runtime.setSend(noopSend);
  };
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  const cleanup = () => {
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
    close();
  };
  currentAbort = cleanup;

  const send: RpcSend = {
    agentEvent: (payload) => {
      void sendEvent(writer, "agentEvent", payload);
    },
    chatMessage: (payload) => {
      void sendEvent(writer, "chatMessage", payload);
    },
    workflowEvent: (payload) => {
      void sendEvent(writer, "workflowEvent", payload);
    },
    workflowFrame: (payload) => {
      void sendEvent(writer, "workflowFrame", payload);
    },
    workspaceState: (payload) => {
      void sendEvent(writer, "workspaceState", payload);
    },
    toast: (payload) => {
      void sendEvent(writer, "toast", payload);
    },
  };

  runtime.setSend(send);

  void runtime.emitWorkspaceState();

  heartbeat = setInterval(() => {
    if (closed) return;
    void sendEvent(writer, "ping", { t: Date.now() });
  }, 15000);

  return cleanup;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function resolveStaticPath(pathname: string): string | null {
  const relative = pathname === "/" ? "/index.html" : pathname;
  const resolved = resolve(publicDir, `.${relative}`);
  if (!resolved.startsWith(publicDir + sep) && resolved !== publicDir) return null;
  return resolved;
}

const server = Bun.serve({
  port: Number(process.env.PORT ?? 5173),
  idleTimeout: 0,
  fetch: async (req) => {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === "/events") {
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      const cleanup = attachClient(writer);
      req.signal.addEventListener("abort", () => {
        cleanup?.();
      });

      return new Response(stream.readable, {
        headers: {
          "content-type": "text/event-stream",
          "cache-control": "no-store",
          connection: "keep-alive",
        },
      });
    }

    if (pathname === "/rpc" && req.method === "POST") {
      const payload = await req.json().catch(() => ({}));
      const method = payload?.method as string | undefined;
      const params = payload?.params ?? {};
      if (!method || !(method in runtime.handlers.requests)) {
        return json({ ok: false, error: { message: "Unknown RPC method" } }, 404);
      }
      try {
        const handler = runtime.handlers.requests[method as keyof typeof runtime.handlers.requests];
        const result = await handler(params as any);
        return json({ ok: true, result });
      } catch (err: any) {
        return json({ ok: false, error: { message: err?.message ?? String(err) } }, 500);
      }
    }

    const filePath = resolveStaticPath(pathname);
    if (filePath) {
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Web app running on http://localhost:${server.port}`);
