import { describe, test, expect } from "bun:test";
import { parseRunUri } from "../../src/mcp/resource-mapper";

// Note: listRunResources and readRunResource require a real SmithersDb,
// which needs a SQLite database. We test the URI parsing logic here and
// the DB-dependent functions in the e2e test.

describe("parseRunUri", () => {
  test("parses a valid smithers run URI", () => {
    expect(parseRunUri("smithers://runs/run-123")).toBe("run-123");
  });

  test("parses a UUID run ID", () => {
    expect(parseRunUri("smithers://runs/550e8400-e29b-41d4-a716-446655440000"))
      .toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  test("returns null for non-matching URIs", () => {
    expect(parseRunUri("http://example.com")).toBeNull();
    expect(parseRunUri("smithers://tools/read")).toBeNull();
    expect(parseRunUri("")).toBeNull();
  });

  test("handles run IDs with special characters", () => {
    expect(parseRunUri("smithers://runs/run-2024-01-15T10:00:00")).toBe(
      "run-2024-01-15T10:00:00",
    );
  });
});
