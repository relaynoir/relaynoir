// localtest/runFullGauntlet.js
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { parseMetadata } from '../core/parseMetadata.js';
import { validateSignature } from '../agent/validateSignature.js';
import { hashPayload } from '../core/hashPayload.js';

const trustedPath = path.resolve('./agent/trustedAgents.json');

function saveTrusted(list) {
  fs.mkdirSync(path.dirname(trustedPath), { recursive: true });
  fs.writeFileSync(trustedPath, JSON.stringify(list, null, 2));
}
function flipInsideR(sig){
  const start = 2 + 16; // flip within r field
  return sig.slice(0,start) + 'ff' + sig.slice(start+2);
}
async function signEvent(wallet, agentName, overrides = {}) {
  const payload = {
    intent: overrides.intent || 'remember',
    topic: overrides.topic || 'memory',
    agent: agentName,
    time: overrides.time || new Date().toISOString(),
    content: overrides.content || 'banana = yellow stick of joy 🍌'
  };
  const text = JSON.stringify(payload);
  const digest = hashPayload(payload);
  const sigObj = wallet.signingKey.sign(digest);
  const signature = ethers.Signature.from(sigObj).serialized;
  return { sender: await wallet.getAddress(), text, signature };
}
async function runCase(label, fn, expectPass){
  try{
    const ev = await fn();
    let meta;
    try { meta = parseMetadata(ev.text); }
    catch(e){ if(expectPass){ console.error(`❌ ${label}: parse failed unexpectedly`); return false; } console.log(`✅ ${label}: parse rejected`); return true; }
    const ok = await validateSignature({ message: meta.raw ?? meta, signature: ev.signature });
    if (ok && expectPass){ console.log(`✅ ${label}: passed as expected`); return true; }
    if (ok && !expectPass){ console.error(`❌ ${label}: unexpectedly passed`); return false; }
    if (!ok && expectPass){ console.error(`❌ ${label}: unexpectedly rejected`); return false; }
    console.log(`✅ ${label}: rejected as expected`); return true;
  } catch(e){ console.error(`❌ ${label}: threw error`, e); return false; }
}
async function main(){
  console.log('🚦 Running Full Local Trust Gauntlet...\n');
  let results = [];
  const good = ethers.Wallet.createRandom();
  const bad = ethers.Wallet.createRandom();
  saveTrusted([{ name:'agent-echo.v0.2.local', address: await good.getAddress(), trusted:true }]);

  results.push(await runCase('1A Whitelisted valid', ()=>signEvent(good,'agent-echo.v0.2.local'), true));
  saveTrusted([]);
  results.push(await runCase('1B Removed from whitelist', ()=>signEvent(good,'agent-echo.v0.2.local'), false));
  saveTrusted([{ name:'agent-echo.v0.2.local', address: await good.getAddress(), trusted:true }]);
  results.push(await runCase('1C Wrong agent name', ()=>signEvent(good,'agent-spoof.local'), false));
  results.push(await runCase('1D Wrong key', ()=>signEvent(bad,'agent-echo.v0.2.local'), false));

  results.push(await runCase('2A Signature bitflip', async()=>{ const ev = await signEvent(good,'agent-echo.v0.2.local'); ev.signature = flipInsideR(ev.signature); return ev; }, false));
  results.push(await runCase('2B Sig reuse with altered payload', async()=>{ const e1 = await signEvent(good,'agent-echo.v0.2.local'); const p = JSON.parse(e1.text); p.content='tampered'; return { ...e1, text: JSON.stringify(p) }; }, false));

  const replay = await signEvent(good,'agent-echo.v0.2.local');
  results.push(await runCase('3A Replay first send', async()=>replay, true));
  results.push(await runCase('3B Replay second send', async()=>replay, false));

  results.push(await runCase('4A Valid time', ()=>signEvent(good,'agent-echo.v0.2.local'), true));
  results.push(await runCase('4B Stale time', ()=>signEvent(good,'agent-echo.v0.2.local', { time: new Date(Date.now()-15*60*1000).toISOString() }), false));
  results.push(await runCase('4C Invalid time', ()=>signEvent(good,'agent-echo.v0.2.local', { time: 'not-a-date' }), false));

  results.push(await runCase('5A Small payload', ()=>signEvent(good,'agent-echo.v0.2.local', { content:'ok' }), true));
  results.push(await runCase('5B Oversize payload', ()=>signEvent(good,'agent-echo.v0.2.local', { content:'a'.repeat(6000) }), false));

  results.push(await runCase('6 Combined malicious', async()=>{
    const ev = await signEvent(bad,'agent-echo.v0.2.local', { content:'a'.repeat(6000) });
    return ev;
  }, false));

  const passCount = results.filter(Boolean).length;
  const total = results.length;
  console.log(`\nGauntlet complete: ${passCount}/${total} cases passed expected outcome.`);
  if (passCount !== total) process.exit(1);
}
main();
