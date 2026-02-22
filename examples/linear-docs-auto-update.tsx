import { createSmithers, Sequence, Parallel } from "smithers-orchestrator";
import { ToolLoopAgent as Agent, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { read, bash, grep, edit } from "smithers-orchestrator/tools";
import { z } from "zod";

/**
 * Example: Auto-update Linear and Documentation After Implementation
 *
 * This workflow demonstrates the pattern where side effects (updating Linear tickets,
 * updating docs) happen in SEPARATE focused contexts AFTER the main implementation.
 *
 * Key insights from the conversation:
 * - Models are bad at "if (condition) doThing()" state management
 * - Side effects like updating Linear/docs should have their own focused context
 * - Parallel separate agents handle these better than the main implementation agent
 * - This prevents the implementation agent from being distracted by state management
 */

// Schema: Implementation output
const implementationSchema = z.object({
  filesChanged: z.array(z.string()),
  summary: z.string(),
  testsPassed: z.boolean(),
  completionNotes: z.string(),
});

// Schema: Linear update (what we did, not querying state)
const linearUpdateSchema = z.object({
  ticketId: z.string(),
  status: z.enum(["done", "in-progress", "blocked"]),
  comment: z.string(),
  timeSpent: z.string().optional(), // e.g., "2h"
  labels: z.array(z.string()).optional(),
});

// Schema: Documentation update
const docsUpdateSchema = z.object({
  filesUpdated: z.array(z.string()),
  sectionsAdded: z.array(z.string()),
  changelogEntry: z.string(),
});

// Schema: Final output
const outputSchema = z.object({
  implementationComplete: z.boolean(),
  linearUpdated: z.boolean(),
  docsUpdated: z.boolean(),
  summary: z.string(),
});

const { Workflow, Task, smithers, outputs } = createSmithers({
  implementation: implementationSchema,
  linearUpdate: linearUpdateSchema,
  docsUpdate: docsUpdateSchema,
  output: outputSchema,
});

// Agent 1: Main implementation agent (focused ONLY on the ticket)
const implementationAgent = new Agent({
  model: anthropic("claude-sonnet-4-20250514"),
  tools: { read, grep, bash, edit },
  output: Output.object({ schema: implementationSchema }),
  instructions: `You are a senior software engineer implementing a ticket.

FOCUS ONLY on:
1. Reading the code to understand the change
2. Implementing the requested feature/fix
3. Running tests to verify it works

DO NOT worry about:
- Updating Linear (a separate agent handles this)
- Updating documentation (a separate agent handles this)
- Project state management (not your job)

Your ONLY job is to implement the feature and verify it works.`,
});

// Agent 2: Linear update agent (separate context, runs AFTER implementation)
const linearAgent = new Agent({
  model: anthropic("claude-sonnet-4-20250514"),
  tools: { bash }, // Linear CLI or API
  output: Output.object({ schema: linearUpdateSchema }),
  instructions: `You are a Linear automation agent.

Your job is to update the Linear ticket based on implementation results.

Use the Linear CLI to:
1. Update ticket status
2. Add a completion comment with summary
3. Add time tracking if available
4. Update labels if needed

Example Linear CLI commands:
- linear issue update <id> --status Done
- linear issue comment <id> "Implementation complete: [summary]"

The ticket info and implementation results will be provided in the prompt.`,
});

// Agent 3: Documentation agent (separate context, runs AFTER implementation)
const docsAgent = new Agent({
  model: anthropic("claude-sonnet-4-20250514"),
  tools: { read, grep, edit, bash },
  output: Output.object({ schema: docsUpdateSchema }),
  instructions: `You are a documentation specialist.

Your job is to update documentation based on implementation changes.

1. Read the implementation summary to understand what changed
2. Find relevant documentation files (README.md, docs/, CHANGELOG.md)
3. Update documentation to reflect the new changes
4. Add a changelog entry

Focus on:
- API changes
- New features
- Behavior changes
- Migration notes if needed`,
});

export default smithers((ctx) => {
  // Access implementation results for the side-effect agents
  const impl = ctx.outputMaybe("implementation", { nodeId: "implement" });

  return (
    <Workflow name="linear-docs-auto-update">
      <Sequence>
        {/*
          STEP 1: Main implementation task
          This agent is FOCUSED - it only implements the feature.
          It doesn't worry about Linear, docs, or state management.
        */}
        <Task
          id="implement"
          output={outputs.implementation}
          agent={implementationAgent}
        >
          {`Implement the following ticket:

Ticket ID: ${ctx.input.ticketId}
Title: ${ctx.input.ticketTitle}
Description: ${ctx.input.ticketDescription}

Repository: ${ctx.input.repoPath}

After implementing:
1. Run the relevant tests
2. Verify everything passes
3. Provide a summary of what you did

Do NOT update Linear or documentation - other agents handle that.`}
        </Task>

        {/*
          STEP 2: Side effects in PARALLEL separate contexts

          These agents run AFTER implementation completes.
          They each have a FOCUSED job:
          - One updates Linear
          - One updates documentation

          This is much better than having the implementation agent
          track state and conditionally update things.
        */}
        <Parallel>
          {/* Linear update agent - separate focused context */}
          <Task
            id="update-linear"
            output={outputs.linearUpdate}
            agent={linearAgent}
          >
            {`Update Linear ticket after implementation:

Ticket ID: ${ctx.input.ticketId}

Implementation Results:
- Files changed: ${impl?.filesChanged?.join(", ") ?? "unknown"}
- Summary: ${impl?.summary ?? "No summary"}
- Tests passed: ${impl?.testsPassed ?? false}
- Notes: ${impl?.completionNotes ?? "None"}

Update the ticket status to Done and add a comment with the implementation summary.

If you need the Linear API key, it should be in SMITHERS_LINEAR_API_KEY env var.
Use the Linear CLI:
  export LINEAR_API_KEY=$SMITHERS_LINEAR_API_KEY
  linear issue update ${ctx.input.ticketId} --status Done
  linear issue comment ${ctx.input.ticketId} "Implementation complete: ${impl?.summary ?? ""}"`}
          </Task>

          {/* Documentation update agent - separate focused context */}
          <Task
            id="update-docs"
            output={outputs.docsUpdate}
            agent={docsAgent}
          >
            {`Update documentation after implementation:

Implementation Summary:
${impl?.summary ?? "No summary available"}

Files Changed:
${impl?.filesChanged?.join("\n") ?? "None"}

Repository: ${ctx.input.repoPath}

1. Find relevant docs (README.md, docs/, CHANGELOG.md)
2. Update them to reflect the changes
3. Add a CHANGELOG entry

Changelog format:
## [Unreleased]
### ${impl?.testsPassed ? "Added" : "Changed"}
- ${ctx.input.ticketTitle}: ${impl?.summary ?? ""}
`}
          </Task>
        </Parallel>

        {/* STEP 3: Final summary task */}
        <Task id="summary" output={outputs.output}>
          {{
            implementationComplete: impl?.testsPassed ?? false,
            linearUpdated: true, // If we got here, it ran
            docsUpdated: true,   // If we got here, it ran
            summary: `✅ Ticket ${ctx.input.ticketId} completed:
- Implementation: ${impl?.summary ?? "No summary"}
- Linear: Updated to Done
- Docs: Updated
- Tests: ${impl?.testsPassed ? "✅ Passed" : "❌ Failed"}`,
          }}
        </Task>
      </Sequence>
    </Workflow>
  );
});

/**
 * To run this workflow:
 *
 * 1. Install Linear CLI: npm install -g @linear/cli
 * 2. Set environment variable: export SMITHERS_LINEAR_API_KEY="your_api_key"
 * 3. Run:
 *    smithers run linear-docs-auto-update \
 *      --input '{
 *        "ticketId": "ENG-123",
 *        "ticketTitle": "Add user authentication",
 *        "ticketDescription": "Implement JWT-based auth for the API",
 *        "repoPath": "/path/to/repo"
 *      }'
 *
 * Key benefits of this pattern:
 *
 * ✅ Focused agents: Each agent has ONE job
 *    - Implementation agent: implement the feature
 *    - Linear agent: update Linear
 *    - Docs agent: update docs
 *
 * ✅ No state management in main agent
 *    - Implementation agent doesn't track "did I update Linear?"
 *    - No "if (condition) doThing()" logic
 *    - Models are bad at this, so we avoid it
 *
 * ✅ Parallel side effects
 *    - Linear and docs updates happen simultaneously
 *    - Faster than sequential
 *
 * ✅ Separate context windows
 *    - Each agent has fresh context
 *    - No context pollution from other tasks
 *    - Linear agent doesn't see implementation details it doesn't need
 *
 * ⚠️  What to avoid:
 *    - DON'T make implementation agent update Linear
 *    - DON'T use conditional logic like "if done, update Linear"
 *    - DON'T share state across agents unless needed
 *    - DON'T make agents change directories or manage state
 */
