# Contributing to RelayNoir

## Workflow

1. Install deps:
```bash
npm i
```

2. Run the gauntlet:
```bash
npm run local:gauntlet   # must be 14/14
```

3. If failing unexpectedly, clear state:
```powershell
del .\logs\replay-cache.json
del .\events\local-events.json
```
```bash
rm -f logs/replay-cache.json events/local-events.json
```

4. Do not commit:
- logs/*.relaylog
- logs/replay-cache.json
- events/local-events.json

## PR Checklist
- [ ] All tests pass (14/14)
- [ ] No logs or caches
- [ ] SECURITY model preserved
