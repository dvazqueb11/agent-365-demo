// Automatic routing logic — decides which tool(s) to call based on user message

const N8N_KEYWORDS = ['calculate', 'process', 'workflow', 'run', 'automation'];
const COPILOT_KEYWORDS = ['summarize', 'explain', 'analyze', 'describe'];

/**
 * Decides which tool(s) to call based on the user's message.
 * @param {string} message - The user's message
 * @returns {'n8n' | 'copilot' | 'both'} The tool(s) to call
 */
function decideTool(message) {
  const lower = message.toLowerCase();

  const matchesN8n = N8N_KEYWORDS.some((kw) => lower.includes(kw));
  const matchesCopilot = COPILOT_KEYWORDS.some((kw) => lower.includes(kw));

  if (matchesN8n && matchesCopilot) return 'both';
  if (matchesN8n) return 'n8n';
  if (matchesCopilot) return 'copilot';

  // Default: call both when unclear
  return 'both';
}

module.exports = { decideTool, N8N_KEYWORDS, COPILOT_KEYWORDS };
