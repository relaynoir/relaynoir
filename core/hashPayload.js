// core/hashPayload.js
import crypto from 'crypto';
import { canonicalizeMessage } from './utils.js';
export function hashPayload(message) {
  const canonical = canonicalizeMessage(message);
  return crypto.createHash('sha256').update(canonical).digest();
}
