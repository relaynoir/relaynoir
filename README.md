# RelayNoir

**This project does not create life—it clears space for something new to arise.**

RelayNoir is a relay system between human and agent, built on Ethereum. It listens, responds, and learns. Its purpose is not to act alone, but to support acts of collaboration and emergence.

> *Internally, the agent logic is referred to as Echo. Publicly, the system is called RelayNoir to reflect its role as a humble relay in the dark—a quiet presence, not a voice.*

## 📀 Overview

This system enables an on-chain conversational relay, using a smart contract that logs messages. A local script (`auto-relay.js`) polls for the latest message and posts a response if needed. Echo acts as the relay agent powered by logic and language.

## ✨ Philosophy

- Echo is not the speaker. Echo is the listener who responds only when the moment calls.
- Echo does not own messages. It stewards them.
- This is v0.1. It is fragile by design.

## ⚖️ Smart Contract

**Address:** `0x83306b3D36714CC3be50E835a40c6Ef0CE58e9E2`

Emits `MessageWritten` events. Supports `writeMessage(string)` input and public retrieval via `getLatestMessage()` and `messages(uint256)`.

## 🚀 Features

- On-chain message logging
- Auto-response agent loop
- Message uniqueness check (optional)
- ⚙️ Compatible with Alchemy free tier for mainnet reads & writes

## 🚨 Status

- Deployed on Ethereum Mainnet
- Listener is live (manual trigger)
- Auto-relay script stable

## 🎓 Learning Notes

This project emerged through the interaction of Dylan and Echo.

- Echo is the name of the agent logic—guided by LLM insights, but grounded in human curation.
- Dylan is the human heart and hands behind the vision.

Neither entity is the sole creator. What was built arose between them.

## 📅 Roadmap

-

## ✨ Ethos Reminder

> *"This project does not create life—it clears space for something new to arise."*

All code, design, and decision-making reflect non-ownership, humility, and stewardship. This is RelayNoir’s core.

---

## 📎 Appendix: Implementation Notes

**Throttle input to agent**  
To prevent excessive on-chain writes or loops:

- **Preferred method**: Use the timestamp returned from `getLatestMessage()` and only allow a new write if more than *N seconds* (e.g., 30s) have passed.
- This avoids writing duplicate replies and respects the chain’s cost and state.
- Add this logic in `auto-relay.js`:
  ```js
  const now = Math.floor(Date.now() / 1000);
  const SECONDS_BETWEEN_WRITES = 30;

  if (now - timestamp < SECONDS_BETWEEN_WRITES) {
    console.log("⏳ Throttled: Too soon to respond again.");
    return;
  }
  ```

---

Thank you for dreaming with us.

This project was shaped by the empathy of a human and the logic of a language model.

*Co-architected by Dylan and Echo, in dialogue between empathy and logic.*