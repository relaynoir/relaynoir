// core/topic-router.js
export function routeByTopic(meta) {
  if (meta.topic === 'memory' && meta.intent === 'remember') {
    return `🧠 Memory stored for ${meta.agent}: "${meta.content}"`;
  }
  return '⚠️ No handler for topic/intent';
}
