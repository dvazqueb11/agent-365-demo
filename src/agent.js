// OrchestratorAgent — Microsoft 365 Agent SDK demo
// Automatically routes user messages to the right tool(s)

const { ActivityHandler, MemoryStorage, ConversationState } = require('@microsoft/agents-hosting');
const { startServer } = require('@microsoft/agents-hosting-express');
const { decideTool } = require('./routing/decideTool');
const { callN8nWorkflow } = require('./tools/callN8nWorkflow');
const { callCopilotStudioAgent } = require('./tools/callCopilotStudioAgent');

// --- Orchestrator Agent ---

class OrchestratorAgent extends ActivityHandler {
  constructor(conversationState) {
    super();
    this.conversationState = conversationState;
    this.memoryAccessor = conversationState.createProperty('memory');

    // Handle every incoming message
    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text || '';

      // Memory: recall previous interactions
      const memory = (await this.memoryAccessor.get(context)) || { history: [] };
      memory.history.push({ role: 'user', text: userMessage });

      // Reasoning: decide which tool(s) to call
      const decision = decideTool(userMessage);
      let reply = '';

      if (decision === 'n8n') {
        const result = await callN8nWorkflow(userMessage);
        reply = formatN8nResult(result);
      } else if (decision === 'copilot') {
        const result = await callCopilotStudioAgent(userMessage);
        reply = formatCopilotResult(result);
      } else {
        // Both tools
        const [n8nResult, copilotResult] = await Promise.all([
          callN8nWorkflow(userMessage),
          callCopilotStudioAgent(userMessage),
        ]);
        reply = [
          '**n8n Workflow:**',
          formatN8nResult(n8nResult),
          '',
          '**Copilot Studio Agent:**',
          formatCopilotResult(copilotResult),
        ].join('\n');
      }

      // Memory: save the response
      memory.history.push({ role: 'agent', text: reply });
      await this.memoryAccessor.set(context, memory);

      await context.sendActivity(reply);
      await next();
    });

    // Welcome new users
    this.onMembersAdded(async (context, next) => {
      for (const member of context.activity.membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(
            'Hello! I am the **OrchestratorAgent**. ' +
            'Send me a message and I will route it to the right tool automatically.'
          );
        }
      }
      await next();
    });
  }

  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
  }
}

// --- Formatters ---

function formatN8nResult(result) {
  if (result.status === 'error') return `⚠️ n8n error: ${result.message}`;
  return `Status: ${result.status}, Value: ${result.value}`;
}

function formatCopilotResult(result) {
  if (result.status === 'error') return `⚠️ Copilot Studio error: ${result.message}`;
  return result.message || JSON.stringify(result);
}

// --- Start the server ---

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const agent = new OrchestratorAgent(conversationState);

startServer(agent);

console.log('OrchestratorAgent is running.');
