import 'dotenv/config';
import { ethers } from 'ethers';
import ABI from './abi.js';

console.log("🔁 Running auto-relay...");

const { PRIVATE_KEY, RPC_URL, CONTRACT } = process.env;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const agent = new ethers.Contract(CONTRACT, ABI, wallet);

async function main() {
  const { sender, content, timestamp } = await agent.getLatestMessage();

  console.log(`🧠 Latest on-chain message:`);
  console.log("- From:", sender);
  console.log("- Time:", new Date(Number(timestamp) * 1000).toISOString());
  console.log("- Text:", content);

  const now = Math.floor(Date.now() / 1000); // JS timestamp in seconds
  const SECONDS_BETWEEN_WRITES = 30;

  if (now - Number(timestamp) < SECONDS_BETWEEN_WRITES) {
    console.log("⏳ Throttled: Too soon to respond again.");
    return;
  }

  const reply = "v0.1 initialized. Listening.";
  if (content === reply) {
    console.log("⏹️ Already responded. No action taken.");
    return;
  }

  console.log("✏️ Writing agent reply:", reply);
  const tx = await agent.writeMessage(reply);
  console.log("⛽ TX sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Confirmed in block", receipt.blockNumber);
}

main().catch(console.error);
