// auto-relay.js
import fs from 'fs';
import path from 'path';
import { parseMetadata } from './core/parseMetadata.js';
import { validateSignature } from './agent/validateSignature.js';
import { routeByTopic } from './core/topic-router.js';
import { writeRelayLog } from './core/relaylog.js';

const eventsPath = path.resolve('./events/local-events.json');

async function run(){
  console.log('⏳ Local Relay started (no .env, no chain)...\n');
  if (!fs.existsSync(eventsPath)) {
    console.log('ℹ️ No events file found. Use `npm run local:gen` to create one.');
    return;
  }
  const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
  for (const msg of events){
    try {
      const meta = parseMetadata(msg.text);
      const ok = await validateSignature({ message: meta.raw ?? meta, signature: msg.signature });
      if (!ok){ console.log('⛔️ Rejected (failed signature validation)\n'); continue; }
      const res = routeByTopic(meta);
      console.log('🧭 Routed:', { topic: meta.topic, intent: meta.intent, agent: meta.agent });
      console.log('💬 Response:', res, '\n');
    } catch (e) {
      writeRelayLog('relay-loop-error', { error: e?.message || String(e) });
      console.error('❌ Relay loop error:', e.message);
    }
  }
}
run().catch(e=>console.error('❌ Relay error:', e));
