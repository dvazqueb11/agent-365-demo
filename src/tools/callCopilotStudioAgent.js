// Tool B — Calls a Copilot Studio agent Action endpoint

/**
 * Sends the user's message to a Copilot Studio agent.
 * @param {string} userMessage - The user's message
 * @returns {Promise<object>} The Copilot Studio agent response
 */
async function callCopilotStudioAgent(userMessage) {
  const url = process.env.COPILOT_STUDIO_URL;
  if (!url) {
    return { status: 'error', message: 'COPILOT_STUDIO_URL is not configured' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: userMessage }),
    });
    if (!res.ok) {
      return { status: 'error', message: `HTTP ${res.status}: ${res.statusText}` };
    }
    return await res.json();
  } catch (err) {
    return { status: 'error', message: err.message };
  }
}

module.exports = { callCopilotStudioAgent };
