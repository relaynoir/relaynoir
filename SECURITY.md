# SECURITY

## Signing & Verification
- Canonicalize JSON (stable key order), hash with SHA-256.
- Sign **raw digest** (no Ethereum message prefix).
- Verify with `ethers.recoverAddress(digest, signature)`.
- Reject non-hex, non-canonical signatures or invalid `v`.

## Validation Order
1. Size cap (default 5KB)
2. Parse JSON
3. Allowlist topic/intent
4. Time window (±10 minutes)
5. Signature recovery and whitelist match
6. Replay cache
7. Route by topic

## Logs
- Every reject writes `.relaylog` with reason and fields.
