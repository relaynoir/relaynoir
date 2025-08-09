// localtest/generateSignedEvent.js
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { hashPayload } from '../core/hashPayload.js';

const trustedPath = path.resolve('./agent/trustedAgents.json');
const eventsPath = path.resolve('./events/local-events.json');

async function main() {
  const wallet = ethers.Wallet.createRandom();
  const agentName = 'agent-echo.v0.2.local';

  const message = {
    intent: 'remember',
    topic: 'memory',
    agent: agentName,
    time: new Date().toISOString(),
    content: 'banana = yellow stick of joy 🍌'
  };

  const digest = hashPayload(message);
  const sigObj = wallet.signingKey.sign(digest);
  const signature = ethers.Signature.from(sigObj).serialized;

  const trustedAgents = [{ name: agentName, address: await wallet.getAddress(), trusted: true }];
  fs.mkdirSync(path.dirname(trustedPath), { recursive: true });
  fs.writeFileSync(trustedPath, JSON.stringify(trustedAgents, null, 2));

  const events = [{ sender: await wallet.getAddress(), text: JSON.stringify(message), signature }];
  fs.mkdirSync(path.dirname(eventsPath), { recursive: true });
  fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));

  console.log(`✅ Generated signed event and trusted agent.`);
  console.log(`   agent: ${agentName}`);
  console.log(`   address: ${await wallet.getAddress()}`);
  console.log(`   events → ${eventsPath}`);
}
main().catch(err => console.error('❌ generateSignedEvent error:', err));
