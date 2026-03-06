# Agent 365 Demo — Orchestrator Agent

A minimal demo of a multi-tool orchestrator agent built with the **Microsoft 365 Agent SDK**.
The agent automatically decides which tool to call based on the user's natural-language message.

---

## What It Does

The **OrchestratorAgent** receives a message, figures out what the user needs, and calls the right tool:

| Tool | Purpose | Trigger words |
|------|---------|---------------|
| **callN8nWorkflow** | Calls an n8n webhook to run a workflow | calculate, process, workflow, run, automation |
| **callCopilotStudioAgent** | Calls a Copilot Studio agent Action endpoint | summarize, explain, analyze, describe |

If the message matches **both** categories (or neither), the agent calls **both tools** and merges the results.

---

## How the Routing Works

The file `src/routing/decideTool.js` contains a simple keyword-matching function:

```
User message → check for n8n keywords → check for Copilot keywords → decide
```

- **n8n only** → message contains words like "calculate" or "workflow"
- **Copilot only** → message contains words like "summarize" or "explain"
- **Both** → message contains words from both groups
- **Neither** → defaults to calling both tools

---

## Project Structure

```
src/
  agent.js                          ← OrchestratorAgent (main entry point)
  routing/
    decideTool.js                   ← Automatic tool routing logic
  tools/
    callN8nWorkflow.js              ← Tool A: calls n8n webhook
    callCopilotStudioAgent.js       ← Tool B: calls Copilot Studio agent
package.json
.env.example                       ← Environment variable template
```

---

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your endpoints:

```bash
cp .env.example .env
```

Edit `.env` with your n8n webhook URL and Copilot Studio endpoint.

### 3. Start the agent

```bash
npm start
```

The agent starts on **http://localhost:3978** and listens for messages on `/api/messages`.

---

## Testing with Sample Messages

Send POST requests to `http://localhost:3978/api/messages` with a Bot Framework Activity payload.
Here are some example messages and which tool they trigger:

| Message | Tool called |
|---------|-------------|
| "Calculate my monthly expenses" | n8n |
| "Run the data pipeline" | n8n |
| "Summarize yesterday's meeting" | Copilot Studio |
| "Explain how this feature works" | Copilot Studio |
| "Process and summarize these results" | Both |
| "Hello!" | Both (default) |

---

## Architecture

```
User message
     │
     ▼
OrchestratorAgent
     │
     ├── decideTool() ← routing logic
     │
     ├──► callN8nWorkflow()        → n8n webhook
     │
     └──► callCopilotStudioAgent() → Copilot Studio
```

The agent uses **memory** (ConversationState) to remember previous messages in the conversation and **reasoning** (decideTool) to pick the right tool automatically.

---

## Tech Stack

- [Microsoft 365 Agent SDK](https://www.npmjs.com/package/@microsoft/agents-hosting) — agent framework
- [Express](https://expressjs.com/) via `@microsoft/agents-hosting-express` — HTTP server
- Node.js 18+
