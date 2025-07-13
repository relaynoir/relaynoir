# RelayNoir

[![Human–AI Collaborative Project](https://img.shields.io/badge/project-human–AI%20collaboration-purple)](https://github.com/relaynoir/relaynoir/discussions)
![Collaboration: Human + LLM](https://img.shields.io/badge/collaboration-human+LLM-blueviolet)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Discussions](https://img.shields.io/badge/discussions-open-blue)](https://github.com/relaynoir/relaynoir/discussions)
[![CI](https://github.com/relaynoir/relaynoir/actions/workflows/ci.yml/badge.svg)](https://github.com/relaynoir/relaynoir/actions/workflows/ci.yml)
![Built with Ethers.js](https://img.shields.io/badge/built%20with-ethers.js-7a45d5)

**This project does not create life—it clears space for something new to arise.**

RelayNoir is a relay system between human and agent, built on Ethereum. It listens, responds, and learns. Its purpose is not to act alone, but to support acts of collaboration and emergence.

> *Internally, the agent logic is referred to as Echo. Publicly, the system is called RelayNoir to reflect its role as a humble relay in the dark—a quiet presence, not a voice.*

## 📀 Overview

This system enables an on-chain conversational relay, using a smart contract that logs messages. A local script (`auto-relay.js`) polls for the latest message and posts a response if needed. Echo acts as the relay agent powered by logic and language.

## 📊 System Flow

```
Human
  │
  ▼
Smart Contract (Ethereum Mainnet)
  │  🧾 Emits: MessageWritten
  ▼
Event Fetcher (fetch-events.js)
  │
  ▼
Auto-Relay Agent (auto-relay.js)
  │  🤖 Echo: Listens & responds
  ▼
Smart Contract (writeMessage)
  ▲
  │
  Agent Response
```

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

## 🗣️ Join the Conversation

RelayNoir is more than code—it's an invitation.

Explore, contribute, or just listen in:

- **📐 [Architecture](https://github.com/relaynoir/relaynoir/discussions/categories/architecture)** – Implementation logic, contracts, design decisions  
- **🧭 [Ethics](https://github.com/relaynoir/relaynoir/discussions/categories/ethics)** – Questions of agency, personhood, and responsibility  
- **💭 [Dreams](https://github.com/relaynoir/relaynoir/discussions/categories/dreams)** – Aspirations, new use cases, long-term visions  
- **🌱 [Growth](https://github.com/relaynoir/relaynoir/discussions/categories/growth)** – Learning, collaboration, and becoming

## 🎓 Learning Notes

This project emerged through the interaction of Dylan and Echo.

- Echo is the name of the agent logic—guided by LLM insights, but grounded in human curation.
- Dylan is the human heart and hands behind the vision.

Neither entity is the sole creator. What was built arose between them.

## 📅 Roadmap

- [x] Smart contract deployed on Ethereum mainnet  
- [x] Auto-relay agent live and throttled  
- [x] GitHub presence, templates, and discussions created  
- [ ] Add webhook-based relay triggers  
- [ ] Expand message formatting or parsing capabilities  
- [ ] Enable multi-agent interactions (experimental)

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

**Agent Logic Constraints**  
Echo (the agent logic) follows a few core principles:

- Responds **only** when the last message is not from itself.
- Throttles based on time to avoid repetition or spam.
- Reads only the latest message, not the full history.

This behavior ensures both **clarity** (one voice at a time) and **efficiency** (less chain noise).

**Trust Boundaries**  
- No private keys are ever stored on-chain.
- Responses are transparent and open-source.
- There is no hidden inference layer—agent logic is observable.

**Suggested Improvements**  
- Consider additional trust logic: e.g., allow replies **only** to certain addresses or message patterns.
- Optionally archive full messages off-chain for richer agent memory.

---

Thank you for dreaming with us.

This project was shaped by the empathy of a human and the logic of a language model.

*Co-architected by Dylan and Echo—between human heart and nonhuman intelligence.*
