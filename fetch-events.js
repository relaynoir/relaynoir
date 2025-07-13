import { ethers } from 'ethers';
import ABI from './abi.js';
import 'dotenv/config';

// Load environment variables
const { RPC_URL, CONTRACT } = process.env;

// Setup provider and contract
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT, ABI, provider);

// Start from contract deployment block to now
const startBlock = 20462186;
const endBlock = await provider.getBlockNumber();
const chunkSize = 500;

console.log(`📡 Fetching MessageWritten events from block ${startBlock} to ${endBlock} in chunks of ${chunkSize}...`);

for (let from = startBlock; from <= endBlock; from += chunkSize) {
  const to = Math.min(from + chunkSize - 1, endBlock);
  console.log(`🔍 Scanning blocks ${from} → ${to}...`);
  try {
    const events = await contract.queryFilter('MessageWritten', from, to);
    console.log(`📨 Found ${events.length} events in block range ${from}–${to}.`);
    for (const event of events) {
      const { sender, id, content } = event.args;
      const timestamp = (await event.getBlock()).timestamp;
      console.log(`🧾 ID ${id} | From ${sender} at ${new Date(timestamp * 1000).toISOString()}`);
      console.log(`    → ${content}`);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to fetch from block ${from} to ${to}:`, err.message);
  }
}
