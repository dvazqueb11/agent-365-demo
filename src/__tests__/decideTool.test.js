const { describe, it } = require('node:test');
const assert = require('node:assert');
const { decideTool, N8N_KEYWORDS, COPILOT_KEYWORDS } = require('../routing/decideTool');

describe('decideTool', () => {
  it('returns "n8n" for n8n-related keywords', () => {
    assert.strictEqual(decideTool('Calculate my expenses'), 'n8n');
    assert.strictEqual(decideTool('Run the workflow'), 'n8n');
    assert.strictEqual(decideTool('process data now'), 'n8n');
    assert.strictEqual(decideTool('set up automation'), 'n8n');
  });

  it('returns "copilot" for copilot-related keywords', () => {
    assert.strictEqual(decideTool('Summarize the meeting'), 'copilot');
    assert.strictEqual(decideTool('Explain this feature'), 'copilot');
    assert.strictEqual(decideTool('analyze the report'), 'copilot');
    assert.strictEqual(decideTool('Describe the architecture'), 'copilot');
  });

  it('returns "both" when message matches both categories', () => {
    assert.strictEqual(decideTool('Process and summarize these results'), 'both');
    assert.strictEqual(decideTool('Run automation and explain the output'), 'both');
  });

  it('returns "both" when message matches neither category', () => {
    assert.strictEqual(decideTool('Hello!'), 'both');
    assert.strictEqual(decideTool(''), 'both');
    assert.strictEqual(decideTool('What is the weather?'), 'both');
  });

  it('is case-insensitive', () => {
    assert.strictEqual(decideTool('CALCULATE'), 'n8n');
    assert.strictEqual(decideTool('SUMMARIZE'), 'copilot');
  });

  it('exports the keyword lists', () => {
    assert.ok(Array.isArray(N8N_KEYWORDS));
    assert.ok(Array.isArray(COPILOT_KEYWORDS));
    assert.ok(N8N_KEYWORDS.length > 0);
    assert.ok(COPILOT_KEYWORDS.length > 0);
  });
});
