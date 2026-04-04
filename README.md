<div align="center">

# Lore

**DeFi protocol research agent.**
Scores every major Solana protocol on security, traction, tokenomics, team, and moat. Tells you what's worth your capital.

[![Build](https://img.shields.io/github/actions/workflow/status/LoreResearch/Lore/ci.yml?branch=main&style=flat-square&label=Build)](https://github.com/LoreResearch/Lore/actions)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
[![Built with Claude Agent SDK](https://img.shields.io/badge/Built%20with-Claude%20Agent%20SDK-cc7800?style=flat-square)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-agent-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)](https://www.typescriptlang.org/)

</div>

---

Most DeFi research is either too shallow (Twitter threads) or too deep (lengthy reports nobody finishes). What you actually need is a structured score: how safe is this protocol, is it growing, is the token fairly valued, who's building it, and can it be replicated?

`Lore` fetches TVL, audit history, and protocol metadata from DefiLlama and GitHub. Claude scores each protocol across five dimensions, writes a research report with bullish/bearish/watch points, and assigns a verdict: accumulate, watch, or avoid. Reports refresh daily.

```
FETCH → SCORE → ANALYZE → REPORT → STORE
```

---

## Research Report

![Lore Report](assets/preview-report.svg)

---

## Protocol Comparison

![Lore Protocols](assets/preview-protocols.svg)

---

## Architecture

```
┌──────────────────────────────────────────────┐
│          Protocol Registry                    │
│  Built-in: Jupiter, Kamino, Jito, MarginFi  │
│  Custom protocols via addProtocol()           │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│          DefiLlama Data Layer                 │
│  TVL · 7d change · volume · audits · mcap   │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│         Preliminary Scorer                    │
│  Auto-scores: security, traction, tokenomics │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│          Claude Lore Agent                    │
│  get_protocol_metadata → get_protocol_metrics│
│  → get_preliminary_scores → submit_report    │
└──────────────────────┬───────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│          Report Store + Printer               │
│  Session cache · ranked table · score bars   │
└──────────────────────────────────────────────┘
```

---

## Score Dimensions

| Dimension | What It Measures |
|-----------|-----------------|
| **Security** | Audits, exploit history, upgrade key custody |
| **Traction** | TVL growth, active users, volume/TVL ratio |
| **Tokenomics** | Inflation, value accrual, mcap/TVL |
| **Team** | Track record, doxxed status, delivery |
| **Moat** | Network effects, switching costs, differentiation |

---

## Usage

```bash
# Research all protocols in registry
bun run dev

# Research a specific protocol
bun run dev kamino
bun run dev jupiter
```

---

## Quick Start

```bash
git clone https://github.com/LoreResearch/Lore
cd Lore && bun install
cp .env.example .env
bun run dev
```

---

## License

MIT

---

*know what you're buying before you buy it.*
