import 'dotenv/config';
import { ethers } from 'ethers';
import ABI from './abi.js';

// Use WebSocket provider for real-time event streaming
const WS_URL = 'wss://eth-mainnet.g.alchemy.com/v2/-QNpVD8uIETONad9ml9x-PlwQYfjX9Uf';
const CONTRACT_ADDRESS = '0x83306b3D36714CC3be50E835a40c6Ef0CE58e9E2';

const provider = new ethers.WebSocketProvider(WS_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

console.log('👂 Echo is now listening for on-chain messages...\n');

contract.on('MessageWritten', (sender, id, content, event) => {
  const timestamp = new Date().toISOString();
  console.log('🔔 New MessageWritten event received!');
  console.log(`- Time: ${timestamp}`);
  console.log(`- From: ${sender}`);
  console.log(`- ID: ${id.toString()}`);
  console.log(`- Text: ${content}`);
  console.log('-----------------------------\n');
});
