import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Effect } from "effect";
import { Smithers } from "../src";

function makeTempDb() {
  const dir = mkdtempSync(join(tmpdir(), "smithers-toon-"));
  return join(dir, "smithers.db");
}

test("loadToon executes run steps and components", async () => {
  const dbPath = makeTempDb();
  const workflow = Smithers.loadToon("tests/fixtures/toon-basic.toon");
  const result = await Effect.runPromise(
    workflow
      .execute({ name: "World" })
      .pipe(Effect.provide(Smithers.sqlite({ filename: dbPath }))),
  );
  expect(result).toEqual({ wrapped: "<<Hello World>>" });
});

test("loadToon executes prompt steps with imported agents", async () => {
  const dbPath = makeTempDb();
  const workflow = Smithers.loadToon("tests/fixtures/toon-prompt.toon");
  const result = await Effect.runPromise(
    workflow
      .execute({ name: "Ada" })
      .pipe(Effect.provide(Smithers.sqlite({ filename: dbPath }))),
  );
  expect(result).toEqual({ message: expect.stringContaining("Hello Ada") });
});

test("loadToon executes quickstart-style research and report steps", async () => {
  const dbPath = makeTempDb();
  const workflow = Smithers.loadToon(
    "tests/fixtures/toon-research-report.toon",
  );
  const result = await Effect.runPromise(
    workflow
      .execute({ topic: "Zig" })
      .pipe(Effect.provide(Smithers.sqlite({ filename: dbPath }))),
  );
  expect(result).toEqual({
    title: expect.stringContaining("Report"),
    body: expect.stringContaining("Zig"),
    wordCount: expect.any(Number),
  });
});

test("loadToon supports loop nodes with skipIf logic", async () => {
  const dbPath = makeTempDb();
  const workflow = Smithers.loadToon("tests/fixtures/toon-review-loop.toon");
  const result = await Effect.runPromise(
    workflow
      .execute({ draft: "Draft v1" })
      .pipe(Effect.provide(Smithers.sqlite({ filename: dbPath }))),
  );
  expect(result).toEqual({
    approved: true,
    content: expect.stringContaining("Draft v1"),
  });
});

test("loadToon imports component libraries", async () => {
  const dbPath = makeTempDb();
  const workflow = Smithers.loadToon(
    "tests/fixtures/toon-components-workflow.toon",
  );
  const result = await Effect.runPromise(
    workflow
      .execute({ brief: "Ship the hotfix" })
      .pipe(Effect.provide(Smithers.sqlite({ filename: dbPath }))),
  );
  expect(result).toEqual({
    summary: expect.stringContaining("Ship the hotfix"),
    tags: expect.arrayContaining(["ship", "the"]),
  });
});
