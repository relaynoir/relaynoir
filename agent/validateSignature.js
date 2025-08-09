// agent/validateSignature.js
import { readFileSync } from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import { writeRelayLog } from '../core/relaylog.js';
import { hasReplay, storeReplay } from '../core/replay-cache.js';
import { hashPayload } from '../core/hashPayload.js';

const trustedAgentsPath = path.resolve('./agent/trustedAgents.json');
const MAX_SKEW_MS = 10 * 60 * 1000; // ±10 minutes

function isValidHexSig(sig) {
  return typeof sig === 'string' && sig.startsWith('0x') && sig.length === 132 && /^[0-9a-fA-Fx]+$/.test(sig);
}

export async function validateSignature({ message, signature }) {
  if (!message || !signature) {
    writeRelayLog('missing-message-or-signature', { agent: message?.agent });
    return false;
  }
  if (!isValidHexSig(signature)) {
    writeRelayLog('bad-signature-format', { agent: message.agent, signaturePreview: String(signature).slice(0,12) });
    return false;
  }

  // Time window check
  if (message.time) {
    const ts = Date.parse(message.time);
    if (isNaN(ts) || Math.abs(Date.now() - ts) > MAX_SKEW_MS) {
      writeRelayLog('time-window-fail', { agent: message.agent, time: message.time });
      return false;
    }
  }

  // Load trusted agents
  let trustedAgents = [];
  try {
    trustedAgents = JSON.parse(readFileSync(trustedAgentsPath, 'utf-8'));
  } catch (err) {
    writeRelayLog('trusted-agents-read-failed', { error: err?.message || String(err) });
    return false;
  }

  // Compute digest (Uint8Array) and replay key
  const digest = ethers.getBytes(hashPayload(message));
  const replayKey = Buffer.from(digest).toString('hex');

  // Replay check
  if (hasReplay(message.agent, replayKey)) {
    writeRelayLog('replay-detected', { agent: message.agent, hash: replayKey });
    return false;
  }

  // Recover address
  let recoveredAddr;
  try {
    recoveredAddr = ethers.recoverAddress(digest, signature);
  } catch (err) {
    writeRelayLog('signature-recover-failed', {
      agent: message.agent,
      error: err?.message || String(err),
      signaturePreview: String(signature).slice(0,18)
    });
    return false;
  }

  // Match whitelist
  const matched = trustedAgents.some(a =>
    a?.trusted === true &&
    a?.name === message.agent &&
    typeof a?.address === 'string' &&
    a.address.toLowerCase() === recoveredAddr.toLowerCase()
  );

  if (!matched) {
    writeRelayLog('untrusted-or-mismatch', {
      agentExpected: message.agent,
      recovered: recoveredAddr,
      trustedAddresses: trustedAgents.map(a => a.address)
    });
    return false;
  }

  storeReplay(message.agent, replayKey);
  return true;
}
