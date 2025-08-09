# RelayNoir

RelayNoir is a hardened local relay between humans and agents. Internally, our logic agent is **Echo**.

---

## Quickstart (v0.2‑ol)

```bash
git clone https://github.com/relaynoir/relaynoir.git
cd relaynoir
npm i
```

Generate a signed local event:
```bash
npm run local:gen
```

Run the hardened local relay:
```bash
npm run local:run
```

### Testing
```bash
npm run local:malicious   # expect all rejections
npm run local:gauntlet    # expect 14/14 passes
```

### Clearing Stale Replay Tokens
If you see `replay-detected` or valid events suddenly reject, clear local state:

```powershell
del .\logs\replay-cache.json
del .\events\local-events.json
```
```bash
rm -f logs/replay-cache.json events/local-events.json
```

Then regenerate and rerun:
```bash
npm run local:gen
npm run local:run
```

---

## Security Model

- Deterministic canonical JSON → SHA‑256 digest
- Raw digest signing
- Strict `recoverAddress` verification
- Topic/intent allowlist
- Payload size & time window limits
- Replay cache
- `.relaylog` forensic trail

---

## Roadmap

### ✅ v0.2‑ol — 2025-08-09
- [x] Canonical JSON + SHA‑256
- [x] Raw‑digest signing & recovery
- [x] Allowlist
- [x] Payload size & time window
- [x] Replay cache
- [x] 14/14 gauntlet
- [x] `.relaylog` forensic trail

### ⏳ v0.2‑oc
- [ ] On‑chain tailer
- [ ] Domain separation
- [ ] Safe poster script
- [ ] CI on fork chain

### ⏳ v0.3‑aa
- [ ] Multi‑agent profiles
- [ ] Personality hooks
- [ ] Abuse prevention & rate limit
- [ ] Web gateway
