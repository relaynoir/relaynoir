// localtest/decodeWhy.js
import fs from 'fs';
import path from 'path';
import { parseMetadata } from '../core/parseMetadata.js';
import { validateSignature } from '../agent/validateSignature.js';

const eventsPath = path.resolve('./events/local-events.json');
const logsDir = path.resolve('./logs');

function newestLog() {
  try {
    const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.relaylog'));
    if (!files.length) return null;
    const withTime = files.map(f => ({ f, t: fs.statSync(path.join(logsDir, f)).mtimeMs }));
    withTime.sort((a,b)=>b.t-a.t);
    return path.join(logsDir, withTime[0].f);
  } catch { return null; }
}

async function main() {
  const arr = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
  const e = arr[0];
  const meta = parseMetadata(e.text);
  const ok = await validateSignature({ message: meta.raw ?? meta, signature: e.signature });
  console.log('valid =', ok);
  const latest = newestLog();
  if (latest) {
    const log = JSON.parse(fs.readFileSync(latest, 'utf-8'));
    console.log('latest .relaylog:', latest);
    console.log(JSON.stringify(log, null, 2));
  } else {
    console.log('no .relaylog files found.');
  }
}
main().catch(e => { console.error(e); process.exit(1); });
