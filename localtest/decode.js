// localtest/decode.js
import fs from 'fs';
import path from 'path';
import { parseMetadata } from '../core/parseMetadata.js';
import { validateSignature } from '../agent/validateSignature.js';

const eventsPath = path.resolve('./events/local-events.json');

async function main(){
  const arr = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));
  const e = arr[0];
  const meta = parseMetadata(e.text);
  const ok = await validateSignature({ message: meta.raw ?? meta, signature: e.signature });
  console.log(JSON.stringify({ valid: ok, metadata: meta }, null, 2));
}
main().catch(e=>console.error(e));
