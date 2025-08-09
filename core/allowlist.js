// core/allowlist.js
const allowed = {
  memory: new Set(['remember'])
};
export function isAllowed(topic, intent) {
  return !!(allowed[topic] && allowed[topic].has(intent));
}
