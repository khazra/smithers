import type { SmithersWorkflow, SmithersWorkflowOptions, RunOptions, RunResult, GraphSnapshot, SchemaRegistryEntry } from "./types";
import type { SmithersCtx, WorkflowProps } from "./types";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import React from "react";
import { runWorkflow as runWorkflowEngine, renderFrame as renderFrameEngine } from "./engine";
import { createSmithersContext } from "./context";
import { Workflow as BaseWorkflow } from "./components";
import { zodToTable, zodToCreateTableSQL, camelToSnake } from "./zod-to-table";
import type { z } from "zod";

export * from "./types";
export * from "./components";
export * from "./agents/cli";
export { mdxPlugin } from "./mdx-plugin";
export { markdownComponents, renderMdx } from "./mdx-components";
export { zodToTable, zodToCreateTableSQL, camelToSnake, unwrapZodType } from "./zod-to-table";
export { zodSchemaToJsonExample } from "./zod-to-example";

/**
 * Original API — user provides a pre-configured Drizzle db instance.
 * Kept for backward compatibility.
 */
export function smithers<Schema extends Record<string, unknown>>(
  db: BunSQLiteDatabase<Schema>,
  build: (ctx: any) => React.ReactElement,
  opts?: SmithersWorkflowOptions,
): SmithersWorkflow<Schema> {
  return { db, build, opts: opts ?? {} } as SmithersWorkflow<Schema>;
}

/**
 * Schema-driven API — users define only Zod schemas, the framework owns the entire storage layer.
 *
 * @example
 * ```ts
 * const { Workflow, useCtx, smithers } = createSmithers({
 *   discover: discoverOutputSchema,
 *   research: researchOutputSchema,
 * });
 *
 * export default smithers(() => (
 *   <Workflow name="my-workflow">
 *     <Task id="discover" output="discover" agent={myAgent}>...</Task>
 *   </Workflow>
 * ));
 * ```
 */
export function createSmithers<
  Schemas extends Record<string, z.ZodObject<any>>,
>(
  schemas: Schemas,
  opts?: { dbPath?: string },
): {
  Workflow: (props: WorkflowProps) => React.ReactElement;
  useCtx: () => SmithersCtx<any>;
  smithers: (build: (ctx: SmithersCtx<any>) => React.ReactElement, opts?: SmithersWorkflowOptions) => SmithersWorkflow<any>;
  db: BunSQLiteDatabase<any>;
  tables: { [K in keyof Schemas]: any };
};

/**
 * Original db-based API — user provides a pre-configured Drizzle db instance.
 * Kept for backward compatibility.
 */
export function createSmithers<Schema extends Record<string, unknown>>(
  db: BunSQLiteDatabase<Schema>,
): {
  Workflow: (props: WorkflowProps) => React.ReactElement;
  useCtx: () => SmithersCtx<Schema>;
  smithers: (build: () => React.ReactElement, opts?: SmithersWorkflowOptions) => SmithersWorkflow<Schema>;
};

export function createSmithers(
  schemasOrDb: any,
  opts?: { dbPath?: string },
) {
  // Detect which overload: if it has $client or _.fullSchema, it's a Drizzle db
  const isDrizzleDb =
    schemasOrDb?.$client != null ||
    schemasOrDb?._ != null ||
    typeof schemasOrDb?.select === "function";

  if (isDrizzleDb) {
    return createSmithersFromDb(schemasOrDb);
  }

  return createSmithersFromSchemas(schemasOrDb as Record<string, z.ZodObject<any>>, opts);
}

/**
 * Internal: original db-based implementation.
 */
function createSmithersFromDb<Schema extends Record<string, unknown>>(
  db: BunSQLiteDatabase<Schema>,
) {
  const { SmithersContext, useCtx } = createSmithersContext<Schema>();
  const ctxRef = { current: null as SmithersCtx<Schema> | null };

  function Workflow(props: WorkflowProps) {
    return React.createElement(
      SmithersContext.Provider,
      { value: ctxRef.current },
      React.createElement(BaseWorkflow, props, props.children)
    );
  }

  function boundSmithers(
    build: () => React.ReactElement,
    smithersOpts?: SmithersWorkflowOptions,
  ): SmithersWorkflow<Schema> {
    return {
      db,
      build: (ctx: SmithersCtx<Schema>) => {
        ctxRef.current = ctx;
        return build();
      },
      opts: smithersOpts ?? {},
    } as SmithersWorkflow<Schema>;
  }

  return { Workflow, useCtx, smithers: boundSmithers };
}

/**
 * Internal: new schema-driven implementation.
 * Auto-creates SQLite db, generates Drizzle tables from Zod schemas,
 * and manages the entire storage layer.
 */
function createSmithersFromSchemas<
  Schemas extends Record<string, z.ZodObject<any>>,
>(
  schemas: Schemas,
  opts?: { dbPath?: string },
) {
  // Dynamic import to avoid hard dependency issues at module level
  const { Database } = require("bun:sqlite");
  const { drizzle } = require("drizzle-orm/bun-sqlite");

  // 1. Generate Drizzle tables from Zod schemas
  const tables: Record<string, any> = {};
  const inputTable = sqliteTable("input", {
    runId: text("run_id").primaryKey(),
  });

  for (const [name, zodSchema] of Object.entries(schemas)) {
    const tableName = camelToSnake(name);
    tables[name] = zodToTable(tableName, zodSchema);
  }

  // 2. Create SQLite db
  const dbPath = opts?.dbPath ?? "./smithers.db";
  const sqlite = new Database(dbPath);
  sqlite.exec("PRAGMA journal_mode = WAL");
  sqlite.exec("PRAGMA foreign_keys = ON");

  // 3. Auto-create tables using CREATE TABLE IF NOT EXISTS
  sqlite.exec(`CREATE TABLE IF NOT EXISTS "input" (run_id TEXT PRIMARY KEY)`);

  for (const [name, zodSchema] of Object.entries(schemas)) {
    const tableName = camelToSnake(name);
    const ddl = zodToCreateTableSQL(tableName, zodSchema);
    sqlite.exec(ddl);
  }

  // 4. Create Drizzle instance with all tables in the schema
  const drizzleSchema: Record<string, any> = { input: inputTable };
  for (const [key, table] of Object.entries(tables)) {
    drizzleSchema[key] = table;
  }
  const db = drizzle(sqlite, { schema: drizzleSchema });

  // 5. Build schema registry for engine resolution of string output keys
  const schemaRegistry = new Map<string, SchemaRegistryEntry>();
  for (const [name, zodSchema] of Object.entries(schemas)) {
    schemaRegistry.set(name, { table: tables[name], zodSchema });
  }

  // 6. Context + hooks
  const { SmithersContext, useCtx } = createSmithersContext<any>();
  const ctxRef = { current: null as SmithersCtx<any> | null };

  function Workflow(props: WorkflowProps) {
    return React.createElement(
      SmithersContext.Provider,
      { value: ctxRef.current },
      React.createElement(BaseWorkflow, props, props.children)
    );
  }

  function boundSmithers(
    build: (ctx: SmithersCtx<any>) => React.ReactElement,
    smithersOpts?: SmithersWorkflowOptions,
  ): SmithersWorkflow<any> {
    return {
      db,
      build: (ctx: SmithersCtx<any>) => {
        ctxRef.current = ctx;
        return build(ctx);
      },
      opts: smithersOpts ?? {},
      schemaRegistry,
    } as SmithersWorkflow<any>;
  }

  return {
    Workflow,
    useCtx,
    smithers: boundSmithers,
    db,
    tables: tables as { [K in keyof Schemas]: any },
  };
}

export async function runWorkflow<Schema>(
  workflow: SmithersWorkflow<Schema>,
  opts: RunOptions,
): Promise<RunResult> {
  return runWorkflowEngine(workflow, opts);
}

export async function renderFrame<Schema>(
  workflow: SmithersWorkflow<Schema>,
  ctx: any,
): Promise<GraphSnapshot> {
  const snap = await renderFrameEngine(workflow, ctx);
  return { runId: snap.runId, frameNo: snap.frameNo, xml: snap.xml, tasks: snap.tasks };
}
