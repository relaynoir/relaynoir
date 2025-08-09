// core/relaylog.js
import fs from 'fs';
import path from 'path';
export function writeRelayLog(reason, data) {
  const dir = path.resolve('./logs');
  fs.mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const p = path.join(dir, `${ts}.${reason}.relaylog`);
  const payload = { timestamp: new Date().toISOString(), reason, ...data };
  fs.writeFileSync(p, JSON.stringify(payload, null, 2));
}
