// localtest/runMaliciousPack.js
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { parseMetadata } from '../core/parseMetadata.js';
import { validateSignature } from '../agent/validateSignature.js';
import { hashPayload } from '../core/hashPayload.js';

const trustedPath = path.resolve('./agent/trustedAgents.json');

function saveTrusted(list) {
  fs.mkdirSync(path.dirname(trustedPath), { recursive: true });
  fs.writeFileSync(trustedPath, JSON.stringify(list, null, 2));
}

async function sign(wallet, agent, payload) {
  const text = JSON.stringify(payload);
  const digest = hashPayload(payload);
  const sigObj = wallet.signingKey.sign(digest);
  const signature = ethers.Signature.from(sigObj).serialized;
  return { sender: await wallet.getAddress(), text, signature };
}

async function run(label, payloadFn, expect) {
  try {
    const ev = await payloadFn();
    let meta;
    try { meta = parseMetadata(ev.text); }
    catch (e) { return expect === 'parse-reject' ? ok(label, 'parse rejected') : bad(label, 'parse failed'); }
    const okv = await validateSignature({ message: meta.raw ?? meta, signature: ev.signature });
    if (okv && expect === 'pass') return ok(label, 'passed');
    if (!okv && expect === 'reject') return ok(label, 'rejected');
    return bad(label, `unexpected ${okv ? 'pass' : 'reject'}`);
  } catch (e) { return bad(label, e.message); }
}
function ok(l, m){ console.log(`✅ ${l}: ${m}`); return true; }
function bad(l,m){ console.error(`❌ ${l}: ${m}`); return false; }

async function main(){
  const good = ethers.Wallet.createRandom();
  saveTrusted([{ name:'agent-echo.v0.2.local', address: await good.getAddress(), trusted:true }]);

  const valid = { intent:'remember', topic:'memory', agent:'agent-echo.v0.2.local', time:new Date().toISOString(), content:'ok' };
  const oversize = { ...valid, content: 'a'.repeat(6000) };

  const results = [];
  results.push(await run('missing-fields', async()=>({ text: JSON.stringify({ topic:'memory' }) }), 'parse-reject'));
  results.push(await run('oversize', async()=>({ text: JSON.stringify(oversize) }), 'parse-reject'));
  results.push(await run('bad-hex', async()=>({ text: JSON.stringify(valid), signature:'0xdeadbeef' }), 'reject'));
  results.push(await run('disallowed-intent', async()=>({ text: JSON.stringify({ ...valid, intent:'forget' }) }), 'parse-reject'));
  results.push(await run('stale-time', async()=>{
    const p = { ...valid, time: new Date(Date.now()-15*60*1000).toISOString() };
    return sign(good, 'agent-echo.v0.2.local', p);
  }, 'reject'));

  console.log(results.every(Boolean) ? '🎉 Malicious pack all rejected as expected.' : '❌ Malicious pack failures.');
}
main().catch(e=>console.error(e));
