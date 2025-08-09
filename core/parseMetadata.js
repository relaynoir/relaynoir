// core/parseMetadata.js
import { isAllowed } from './allowlist.js';
const MAX_TEXT_LEN = 5_000;
export function parseMetadata(text) {
  if (typeof text !== 'string') throw new Error('Payload text is not a string.');
  if (text.length > MAX_TEXT_LEN) throw new Error(`Payload exceeds maximum size of ${MAX_TEXT_LEN} characters.`);
  let metadata;
  try { metadata = JSON.parse(text); } catch { throw new Error('Failed to parse metadata: Invalid JSON.'); }
  const { intent, topic, agent, priority, content, time } = metadata;
  if (!intent || !topic || !agent) throw new Error("Missing required metadata fields: 'intent', 'topic', or 'agent'.");
  if (!isAllowed(topic, intent)) throw new Error(`Disallowed topic/intent: ${topic}/${intent}`);
  return { intent, topic, agent, priority: priority || 'normal', content, time, raw: metadata };
}
