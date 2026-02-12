#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "fs";

const pages = [
  { path: "docs/introduction.mdx", url: "https://smithers.sh/introduction" },
  { path: "docs/installation.mdx", url: "https://smithers.sh/installation" },
  { path: "docs/quickstart.mdx", url: "https://smithers.sh/quickstart" },
  { path: "docs/concepts/execution-model.mdx", url: "https://smithers.sh/concepts/execution-model" },
  { path: "docs/concepts/data-model.mdx", url: "https://smithers.sh/concepts/data-model" },
  { path: "docs/concepts/context.mdx", url: "https://smithers.sh/concepts/context" },
  { path: "docs/concepts/approvals.mdx", url: "https://smithers.sh/concepts/approvals" },
  { path: "docs/concepts/caching.mdx", url: "https://smithers.sh/concepts/caching" },
  { path: "docs/concepts/renderer-internals.mdx", url: "https://smithers.sh/concepts/renderer-internals" },
  { path: "docs/components/workflow.mdx", url: "https://smithers.sh/components/workflow" },
  { path: "docs/components/task.mdx", url: "https://smithers.sh/components/task" },
  { path: "docs/components/sequence.mdx", url: "https://smithers.sh/components/sequence" },
  { path: "docs/components/parallel.mdx", url: "https://smithers.sh/components/parallel" },
  { path: "docs/components/branch.mdx", url: "https://smithers.sh/components/branch" },
  { path: "docs/components/ralph.mdx", url: "https://smithers.sh/components/ralph" },
  { path: "docs/guides/tutorial-workflow.mdx", url: "https://smithers.sh/guides/tutorial-workflow" },
  { path: "docs/guides/structured-output.mdx", url: "https://smithers.sh/guides/structured-output" },
  { path: "docs/guides/error-handling.mdx", url: "https://smithers.sh/guides/error-handling" },
  { path: "docs/guides/patterns.mdx", url: "https://smithers.sh/guides/patterns" },
  { path: "docs/guides/resumability.mdx", url: "https://smithers.sh/guides/resumability" },
  { path: "docs/guides/debugging.mdx", url: "https://smithers.sh/guides/debugging" },
  { path: "docs/guides/monitoring-logs.mdx", url: "https://smithers.sh/guides/monitoring-logs" },
  { path: "docs/guides/best-practices.mdx", url: "https://smithers.sh/guides/best-practices" },
  { path: "docs/guides/vcs.mdx", url: "https://smithers.sh/guides/vcs" },
  { path: "docs/runtime/run-workflow.mdx", url: "https://smithers.sh/runtime/run-workflow" },
  { path: "docs/runtime/render-frame.mdx", url: "https://smithers.sh/runtime/render-frame" },
  { path: "docs/runtime/events.mdx", url: "https://smithers.sh/runtime/events" },
  { path: "docs/runtime/revert.mdx", url: "https://smithers.sh/runtime/revert" },
  { path: "docs/cli/overview.mdx", url: "https://smithers.sh/cli/overview" },
  { path: "docs/integrations/tools.mdx", url: "https://smithers.sh/integrations/tools" },
  { path: "docs/integrations/cli-agents.mdx", url: "https://smithers.sh/integrations/cli-agents" },
  { path: "docs/integrations/server.mdx", url: "https://smithers.sh/integrations/server" },
  { path: "docs/integrations/pi-plugin.mdx", url: "https://smithers.sh/integrations/pi-plugin" },
  { path: "docs/examples/hello-world.mdx", url: "https://smithers.sh/examples/hello-world" },
  { path: "docs/examples/dynamic-plan.mdx", url: "https://smithers.sh/examples/dynamic-plan" },
  { path: "docs/examples/ralph-loop.mdx", url: "https://smithers.sh/examples/ralph-loop" },
  { path: "docs/examples/multi-agent-review.mdx", url: "https://smithers.sh/examples/multi-agent-review" },
  { path: "docs/examples/approval-gate.mdx", url: "https://smithers.sh/examples/approval-gate" },
  { path: "docs/examples/tools-agent.mdx", url: "https://smithers.sh/examples/tools-agent" },
  { path: "docs/reference/types.mdx", url: "https://smithers.sh/reference/types" },
];

function stripFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    const frontmatter = match[1];
    const body = match[2];
    const titleMatch = frontmatter.match(/title:\s*["']?(.+?)["']?\s*$/m);
    const descMatch = frontmatter.match(/description:\s*["']?(.+?)["']?\s*$/m);
    const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, "") : "";
    const desc = descMatch ? descMatch[1].trim().replace(/^["']|["']$/g, "") : "";
    return { title, description: desc, body: body.trim() };
  }
  return { title: "", description: "", body: content.trim() };
}

function cleanMdx(body: string) {
  return body
    .replace(/<Warning>\s*/g, "> **Warning:** ")
    .replace(/<\/Warning>/g, "")
    .replace(/<Tip>\s*/g, "> **Tip:** ")
    .replace(/<\/Tip>/g, "")
    .replace(/<Note>\s*/g, "> **Note:** ")
    .replace(/<\/Note>/g, "");
}

let output = `# Smithers

> Deterministic, resumable AI workflow orchestration using JSX.
> Source: https://smithers.sh
> GitHub: https://github.com/evmts/smithers
> Package: smithers-orchestrator on npm

This file contains the complete Smithers documentation. Each section below corresponds to a documentation page on smithers.sh.

`;

for (const page of pages) {
  const content = readFileSync(page.path, "utf-8");
  const { title, description, body } = stripFrontmatter(content);
  const cleaned = cleanMdx(body);

  output += `---

## ${title}

`;
  if (description) {
    output += `> ${description}\n`;
  }
  output += `> Source: ${page.url}

${cleaned}

`;
}

writeFileSync("docs/llms-full.txt", output);
console.log(`Generated docs/llms-full.txt (${output.length} chars, ~${Math.round(output.length / 4)} tokens)`);
