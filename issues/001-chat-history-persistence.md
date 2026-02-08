# Chat History Persistence, Browsing, Forking & Search

## Summary

Add full chat history management to Smithers: persist conversations, browse past chats, resume/fork threads, and search across all history from the main agent. This brings the chat experience closer to what Claude/ChatGPT web apps offer.

## Context

Currently Smithers creates a single Codex thread per workspace session (`thread/start`). Messages live only in `WorkspaceState.chatMessages` (in-memory `[ChatMessage]`). When the app closes or a new directory is opened, all chat history is lost.

The good news: **codex-app-server already has a rich thread history API** (v2 protocol) that Smithers doesn't use yet. The backend persists conversations as rollout `.jsonl` files and exposes these RPC methods:

| Method | Purpose |
|--------|---------|
| `thread/list` | Paginated list of past threads (filterable by provider, source, archived status, sortable by created/updated) |
| `thread/read` | Read a thread's metadata + optionally its full turn history |
| `thread/resume` | Resume an existing thread (restores context, allows sending new turns) |
| `thread/fork` | Fork a thread at any point (creates new thread with copied history) |
| `thread/archive` | Soft-delete a thread (moves rollout to archived dir) |
| `thread/unarchive` | Restore an archived thread |
| `thread/name/set` | Rename a thread |
| `thread/rollback` | Undo the last N turns |

All of these are already implemented server-side. Smithers just needs to call them.

## Feature Breakdown

### Phase 1: Core Persistence & Resume

**Goal**: Chat history survives across sessions; user can resume where they left off.

1. **Store thread ID in WorkspaceState**
   - After `thread/start`, save the returned `threadId` and associate it with the workspace root directory
   - Persist the mapping (e.g. `~/.smithers/thread-map.json` or use `UserDefaults`) so reopening the same directory resumes the same thread

2. **Resume on workspace open**
   - On `openDirectory`, check if a threadId exists for that directory
   - Call `thread/resume` instead of `thread/start` to restore context
   - The resume response includes full turn history — replay it into `chatMessages` so the user sees their past conversation

3. **Replay turn history into ChatMessages**
   - Map `ThreadItem` types from the v2 API (UserMessage, AgentMessage, Reasoning, Plan, CommandExecution, FileChange) to the existing `ChatMessage` model
   - The v2 `ThreadItem` enum is richer than current `ChatMessage.Kind` — extend Kind or add new cases as needed

4. **"New Chat" action**
   - Add a command palette entry and toolbar button to start a fresh thread
   - Calls `thread/start` and clears `chatMessages`
   - The old thread remains in history (accessible later)

### Phase 2: Chat History Sidebar / Browser

**Goal**: User can browse, search, and manage past conversations.

5. **Thread list view**
   - New view (could be a sheet, sidebar section, or dedicated panel) that calls `thread/list`
   - Show each thread's preview text, timestamp, git branch info, working directory
   - Paginated loading with cursor-based pagination
   - Sort by created_at or updated_at

6. **Open a past thread**
   - Clicking a thread calls `thread/read` with `include_turns: true`
   - Renders the full conversation read-only, or calls `thread/resume` to continue chatting

7. **Thread management actions**
   - Rename: `thread/name/set`
   - Archive (hide): `thread/archive`
   - Unarchive: `thread/unarchive`
   - Delete: archive and remove from list (or just archive, which is the soft-delete)

8. **Visual grouping**
   - Group threads by date (Today, Yesterday, Last 7 Days, Last 30 Days, Older)
   - Show git branch badge if available
   - Show workspace path for context

### Phase 3: Forking & Branching

**Goal**: User can fork a conversation at any point to explore alternatives.

9. **Fork from any turn**
   - When viewing a thread, allow user to right-click or use a button on any turn to "Fork from here"
   - Calls `thread/fork` with the thread ID (server handles copying history)
   - Opens the new forked thread as the active chat

10. **Rollback**
    - Allow user to undo the last N turns (`thread/rollback`)
    - Useful when the agent went in a wrong direction

11. **Fork visualization** (stretch)
    - Show which threads were forked from which
    - Parent thread reference in thread list view

### Phase 4: Cross-History Search

**Goal**: User can ask the main agent to search across all past conversations.

12. **Search across chat histories**
    - Use `thread/list` to enumerate all threads, `thread/read` to get their content
    - Build a local search index (full-text over user messages + agent messages)
    - Surface this as a command: "search chats for <query>" or via a dedicated search panel

13. **Agent-powered search**
    - When the user asks the main Codex agent something like "search my past chats about authentication", the agent can:
      a. Call `thread/list` to get all threads
      b. Call `thread/read` on promising threads (based on preview text)
      c. Summarize relevant findings
    - This could be implemented as a system prompt addition that teaches the agent about the available history APIs
    - OR as a local tool/function the agent can call

14. **Context injection from history**
    - Allow user to pull context from a past thread into the current one
    - "Use the approach from chat X" → fetch that thread's content and inject as context

## Implementation Notes

### CodexService Changes

The current `CodexService` only exposes `start()`, `sendMessage()`, `interrupt()`, and `login()`. Need to add:

```swift
// Thread management
func listThreads(cursor: String?, limit: Int?, archived: Bool?) async throws -> ThreadListResponse
func readThread(threadId: String, includeTurns: Bool) async throws -> ThreadReadResponse
func resumeThread(threadId: String) async throws -> ThreadResumeResponse
func forkThread(threadId: String) async throws -> ThreadForkResponse
func archiveThread(threadId: String) async throws
func unarchiveThread(threadId: String) async throws
func renameThread(threadId: String, name: String) async throws
func rollbackThread(threadId: String, numTurns: Int) async throws
```

Each of these is a `transport.sendRequest()` call with the appropriate method name and params.

### Protocol Upgrade

Currently Smithers uses the v1 protocol (`thread/start` with minimal params). The v2 API methods (`thread/list`, `thread/read`, `thread/fork`, etc.) may require enabling experimental API or upgrading the initialize handshake. Check `experimentalApi: true` in `InitializeCapabilities`.

### New Swift Types Needed

```swift
struct ThreadListParams: Encodable { ... }
struct ThreadListResponse: Decodable {
    let data: [ThreadSummary]
    let nextCursor: String?
}
struct ThreadSummary: Decodable, Identifiable {
    let id: String
    let preview: String
    let modelProvider: String
    let createdAt: Int64
    let updatedAt: Int64
    let cwd: String
    let cliVersion: String
    let source: String
    let gitInfo: GitInfo?
}
struct ThreadReadResponse: Decodable { ... }
struct ThreadResumeResponse: Decodable { ... }
// etc.
```

### WorkspaceState Changes

- `chatMessages` needs to support multiple threads (or swap out when switching threads)
- New `@Published var activeThreadId: String?`
- New `@Published var threadHistory: [ThreadSummary] = []`
- Thread persistence mapping (directory URL → thread ID)

### UI Components Needed

- `ChatHistoryView` — list of past threads with search
- `ChatHistoryRow` — single thread preview row
- `ThreadDetailView` — read-only view of a past conversation
- Updates to `ChatView` — new chat button, thread switcher, fork/rollback controls
- Updates to `CommandPaletteView` — new commands (New Chat, Browse History, Search Chats)

## Priority

Phase 1 (persistence + resume) is the most impactful and should be done first. It's relatively small — mainly wiring up `thread/resume` and persisting the thread ID mapping. Phases 2-4 build on top progressively.

## Open Questions

- Should thread-to-directory mapping be stored per-user (`~/.smithers/`) or per-workspace (`.smithers/` in project root)?
- For Phase 4 search, should we index locally or lean entirely on the agent calling the Codex APIs?
- Should archived threads be visible by default or hidden behind a toggle?
- How should we handle the case where the Codex rollout files are cleaned up externally (thread/resume would fail)?
