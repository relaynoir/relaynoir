// core/replay-cache.js
import fs from 'fs';
import path from 'path';
const cachePath = path.resolve('./logs/replay-cache.json');
function load() {
  try { return JSON.parse(fs.readFileSync(cachePath,'utf-8')); } catch { return {}; }
}
function save(db) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(db, null, 2));
}
export function hasReplay(agent, key) {
  const db = load();
  return !!db?.[agent]?.[key];
}
export function storeReplay(agent, key) {
  const db = load();
  db[agent] = db[agent] || {};
  if (!db[agent][key]) {
    db[agent][key] = { firstSeen: new Date().toISOString() };
    save(db);
  }
}
