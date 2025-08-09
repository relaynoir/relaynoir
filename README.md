# RelayNoir

[![Human–AI Collaborative Project](https://img.shields.io/badge/project-human–AI%20collaboration-purple)](https://github.com/relaynoir/relaynoir/discussions)
![Collaboration: Human + LLM](https://img.shields.io/badge/collaboration-human+LLM-blueviolet)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Discussions](https://img.shields.io/badge/discussions-open-blue)](https://github.com/relaynoir/relaynoir/discussions)
![Built with Ethers.js](https://img.shields.io/badge/built%20with-ethers.js-7a45d5)

> **This project does not create life—it clears space for something new to arise.**  
> All code and design reflect non-ownership, humility, and stewardship.

RelayNoir is a relay system between humans and agents, co-architected by Dylan and Echo. Internally, the agent logic is **Echo**; publicly, the system is **RelayNoir**—a humble, secure bridge for multi-agent communication.

---

## 📀 Overview

RelayNoir v0.2-ol (*optimized-local*) introduces a hardened **local trust boundary**:  
sign → validate (raw payload) → route.

It is the **safety bedrock** for future on-chain expansion.  
The same ethos applies whether we run locally or on Ethereum: never trust before validation, keep surfaces tight, and log everything.

---

## 🏁 Quickstart (Local v0.2-ol)

```bash
git clone https://github.com/relaynoir/relaynoir.git
cd relaynoir
npm i
```

Generate and whitelist a signed local event:
```bash
npm run local:gen
```

Run the hardened local relay:
```bash
npm run local:run
```

### Testing the Trust Boundary
```bash
npm run local:malicious   # expect all rejections
npm run local:gauntlet    # expect 14/14 passes
```

### Clearing Stale Replay Tokens
If you see `replay-detected` or valid events reject:
```powershell
del .\logs\replay-cache.json
del .\events\local-events.json
```
```bash
rm -f logs/replay-cache.json events/local-events.json
```
Then:
```bash
npm run local:gen
npm run local:run
```

---

## 🔐 Security Model (v0.2-ol)

- Canonical JSON → SHA-256 digest  
- Raw digest signing (no Ethereum prefix)  
- Strict `recoverAddress` verification  
- Topic/intent allowlist  
- Payload size & time window limits  
- Replay cache (per agent + digest)  
- Forensic `.relaylog` for all rejects

---

## 📊 On-Chain Mode (v0.2-oc, upcoming)

In on-chain mode, the relay tails a deployed Ethereum contract, validates events using the same signature logic, and routes responses back on-chain.

**Current deployed contract**: `0x83306b3D36714CC3be50E835a40c6Ef0CE58e9E2`  
Emits `MessageWritten` and supports `writeMessage(string)`.

---

## 🗺 Roadmap

### ✅ v0.2-ol — 2025-08-09
- [x] Canonical JSON + SHA-256
- [x] Raw-digest signing & strict recovery
- [x] Allowlist for topic/intent
- [x] Payload size & time window limits
- [x] Replay cache
- [x] Full malicious pack + 14/14 gauntlet
- [x] `.relaylog` forensic trail

### ⏳ v0.2-oc (*optimized-chain*)
- [ ] On-chain event tailer
- [ ] Domain separation in payload
- [ ] Safe poster script
- [ ] CI job on fork chain

### ⏳ v0.3-aa (*agent-autonomy*)
- [ ] Multi-agent profiles
- [ ] Personality hooks + signed state memory
- [ ] Abuse prevention & rate limits
- [ ] Web gateway

---

## ✨ Philosophy

- Echo is not the speaker—Echo listens and responds when it matters.
- Messages are stewarded, not owned.
- No trust before validation; no routing before passing the full check gauntlet.
- This is co-created space—between human and nonhuman intelligence.
