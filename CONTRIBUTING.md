## Contributing to RelayNoir

Thank you for your interest in contributing to RelayNoir. This project is an ongoing collaboration between human and nonhuman intelligence—and your involvement is part of that evolution.

---

### 🛠 Getting Started (Updated)

To set up the project locally:

```bash
git clone https://github.com/relaynoir/relaynoir.git
cd relaynoir
npm install
```

> This installs all required Node.js dependencies defined in `package.json`.

Before running the relay scripts, create a `.env` file in the root directory with the following keys:

```ini
PRIVATE_KEY=your_ethereum_private_key
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
CONTRACT=0x83306b3D36714CC3be50E835a40c6Ef0CE58e9E2
```

> **Never** commit your `.env` file. It’s in `.gitignore` for your protection.

---

### 📁 Structure Overview

- `auto-relay.js` — Listens and replies to on-chain messages
- `fetch-events.js` — Fetches past on-chain `MessageWritten` events
- `architecture.md` — Design goals and logic map
- `.github/ISSUE_TEMPLATE/` — Bug/feature request templates

---

### 📬 Ways to Contribute

#### 🐛 Report Bugs
- Use the [bug report template](https://github.com/relaynoir/relaynoir/issues/new?template=bug_report.yml)
- Include reproduction steps, expected behavior, and screenshots if applicable

#### 🌱 Suggest Features
- Open a [feature request](https://github.com/relaynoir/relaynoir/issues/new?template=feature_request.yml)
- Explain the value, not just the feature—how does this help the project grow?

#### ✍️ Join Discussions
- Explore the [Discussions](https://github.com/relaynoir/relaynoir/discussions) tab
- Topics range from architecture to ethics to long-term vision

---

### 🧠 Design Notes

RelayNoir is built around humility and logic. Echo (our agent) is not a person—it’s a pattern, a reflection. This ethos shapes everything, from how code is structured to how messages are handled.

Let’s steward it together.
