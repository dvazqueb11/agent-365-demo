// Tool A — Calls an n8n webhook endpoint

/**
 * Sends the user's message to an n8n workflow webhook.
 * @param {string} userMessage - The user's message
 * @returns {Promise<object>} The n8n workflow response
 */
async function callN8nWorkflow(userMessage) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    return { status: 'error', message: 'N8N_WEBHOOK_URL is not configured' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userMessage }),
    });
    return await res.json();
  } catch (err) {
    return { status: 'error', message: err.message };
  }
}

module.exports = { callN8nWorkflow };
