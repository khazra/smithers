import * as BunContext from "@effect/platform-bun/BunContext";
import { Cause, Effect, Exit, Layer, Logger, LogLevel, ManagedRuntime } from "effect";

function resolveLogLevel(
  value: string | undefined,
): LogLevel.LogLevel {
  switch ((value ?? "").toLowerCase()) {
    case "none":
      return LogLevel.None;
    case "trace":
      return LogLevel.Trace;
    case "debug":
      return LogLevel.Debug;
    case "warning":
    case "warn":
      return LogLevel.Warning;
    case "error":
      return LogLevel.Error;
    case "fatal":
      return LogLevel.Fatal;
    case "all":
      return LogLevel.All;
    case "info":
    default:
      return LogLevel.Info;
  }
}

function resolveLogger() {
  switch ((process.env.SMITHERS_LOG_FORMAT ?? "").toLowerCase()) {
    case "json":
      return Logger.withLeveledConsole(Logger.jsonLogger);
    case "pretty":
      return Logger.prettyLogger();
    case "string":
      return Logger.withLeveledConsole(Logger.stringLogger);
    case "logfmt":
    default:
      return Logger.withLeveledConsole(Logger.logfmtLogger);
  }
}

const SmithersRuntimeLayer = Layer.mergeAll(
  BunContext.layer,
  Logger.replace(Logger.defaultLogger, resolveLogger()),
  Logger.minimumLogLevel(
    resolveLogLevel(process.env.SMITHERS_LOG_LEVEL),
  ),
);

const runtime = ManagedRuntime.make(SmithersRuntimeLayer);

function decorate<A, E, R>(effect: Effect.Effect<A, E, R>) {
  return effect.pipe(Effect.annotateLogs("service", "smithers"));
}

function normalizeRejection(cause: unknown) {
  if (cause instanceof Error) return cause;
  return new Error(String(cause));
}

export async function runPromise<A, E, R>(
  effect: Effect.Effect<A, E, R>,
  options?: { signal?: AbortSignal },
) {
  const exit = await runtime.runPromiseExit(
    decorate(effect) as Effect.Effect<A, E, never>,
    options,
  );
  if (Exit.isSuccess(exit)) {
    return exit.value;
  }
  const failure = Cause.failureOption(exit.cause);
  if (failure._tag === "Some") {
    throw normalizeRejection(failure.value);
  }
  throw normalizeRejection(Cause.squash(exit.cause));
}

export function runPromiseExit<A, E, R>(
  effect: Effect.Effect<A, E, R>,
  options?: { signal?: AbortSignal },
) {
  return runtime.runPromiseExit(
    decorate(effect) as Effect.Effect<A, E, never>,
    options,
  );
}

export function runFork<A, E, R>(effect: Effect.Effect<A, E, R>) {
  return runtime.runFork(decorate(effect) as Effect.Effect<A, E, never>);
}

export function runSync<A, E, R>(effect: Effect.Effect<A, E, R>) {
  return runtime.runSync(decorate(effect) as Effect.Effect<A, E, never>);
}

export { SmithersRuntimeLayer };
