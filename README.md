# Lore

Protocol diligence engine for Solana token buyers.

Turn token research into a capital-allocation memo in one pass.

`bun run dev`

- scores governance concentration, fee retention, treasury runway, unlock pressure, and traction quality
- ignores vanity TVL and narrative fluff that do not help underwrite the token
- promotes protocols where demand quality can realistically absorb future supply

[![Build](https://img.shields.io/github/actions/workflow/status/LoreResearch/Lore/ci.yml?branch=master&style=flat-square&label=Build)](https://github.com/LoreResearch/Lore/actions)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square)

Research Board • Comparison Strip • Operating Surfaces • What Lore Scores • Memo Anatomy • Technical Spec • Quick Start

## At a Glance

- `Use case`: token diligence and capital-allocation framing for Solana protocols
- `Primary input`: governance, revenue retention, treasury runway, unlock pressure, traction quality
- `Primary failure mode`: popular protocols with weak token underwriting
- `Best for`: buyers who need a fast memo before deciding whether a token deserves capital

## Research Board

![Lore research board](assets/preview-report.svg)

## Comparison Strip

![Lore protocol comparison](assets/preview-protocols.svg)

## Operating Surfaces

- `Research Board`: shows the current memo with governance, runway, and unlock context
- `Comparison Strip`: keeps multiple Solana protocols on one allocation plane
- `Diligence Score`: compresses five underwriting dimensions into one ranking
- `Protocol Memo`: gives a buyer the exact reasons capital should move or wait

## What Lore Feels Like To Use

Lore is supposed to read like the first serious pass on a token, not like a tweet thread trying to sound smart.

The board is useful when you already know the protocol name, the narrative, and the rough market interest, but you still need the hard part answered: does the token deserve capital once governance, treasury, unlocks, and fee quality are all put on the same page?

That is the difference between interest and underwriting. Lore is built for the second one.

## What Lore Scores

Lore uses a five-part diligence model:

`overall = mean(governance, feeRetention, treasuryRunway, unlockOverhang, tractionQuality)`

This shifts the question from "is the protocol popular" to "can the token absorb supply and still justify capital".

## The Questions Lore Forces

Lore is not trying to replace deep protocol research. It is trying to force the core underwriting questions into one repeatable frame:

- who really controls the token and governance surface
- whether the business is monetizing or only attracting attention
- how long the treasury can keep shipping without leaning on token supply
- whether the next unlock window can be absorbed by real demand

That is why Lore reads more like an allocation memo than a generic research thread.

## Memo Anatomy

Each Lore output is designed to be decision-ready.

- `Governance`: who controls outcomes and how concentrated that control is
- `Retention`: whether protocol usage turns into durable economics
- `Runway`: how long the treasury can operate without stress
- `Unlocks`: how much supply is about to hit the market
- `Traction`: whether usage quality actually supports the token

## How It Works

Lore is meant to turn raw protocol facts into a memo a buyer can actually use:

1. normalize the protocol inputs into governance, economics, runway, unlock, and traction buckets
2. score each bucket independently so one strong metric cannot hide another weak one
3. compress the five buckets into one allocation view
4. compare the memo against nearby protocols so the buyer sees relative quality, not just isolated facts
5. print the reasons the token deserves capital, patience, or avoidance

The output should read like a first underwriting pass, not like a generic protocol overview.

## What A Good Lore Memo Surfaces Fast

### Governance Reality

If the token is effectively controlled by a small insider circle, Lore should make that obvious. That does not automatically kill the idea, but it changes position sizing and how much trust you place in long-duration narratives.

### Treasury Durability

Protocols that need constant token support just to keep operating should not be mistaken for durable businesses. Lore highlights runway because teams with time can ship through bad market structure. Teams without time usually cannot.

### Supply Pressure

Unlocks matter most when demand is weak, monetization is shallow, and valuation is already stretched. Lore treats that combination as a serious drag, not a footnote.

## Why Lore Is Useful To Buyers

Most repo-level protocol explainers stop at "what this project does." Buyers need more than that. They need to know what makes the token fragile, what makes it durable, and what has to go right for the market to keep rewarding it.

Lore compresses those questions into a format you can compare across multiple Solana names without pretending every protocol should be judged the same way.

## Example Output

```text
LORE // TOKEN DILIGENCE MEMO

protocol          JUP
overall score     0.76
governance        0.71
fee retention     0.81
runway            0.83
unlock overhang   0.58
traction quality  0.87

allocation note: durable economics are strong, but next unlock window still matters
```

## Technical Spec

### Governance

`governance = 0.45 * auditDepth + 0.35 * insiderDispersion + 0.20 * operatingMaturity`

Protocols with heavy insider ownership or weak audit posture lose points even if TVL is strong.

### Fee Retention

`feeRetention = 0.55 * feeMargin + 0.45 * normalizedFees`

Usage only matters when it converts into protocol revenue that can support token value.

### Treasury Runway

`runwayMonths = treasuryUsd / monthlyBurnUsd`

`treasuryRunway = clamp(runwayMonths / 24)`

Lore favors teams that can keep shipping without relying on immediate token supply overhang.

### Unlock Overhang

`unlockOverhang = 1 - (0.65 * unlockPct90d + 0.35 * valuationStretch)`

High next-90-day unlocks are treated as a hard drag unless valuation and demand are unusually strong.

### Traction Quality

`tractionQuality = 0.45 * normalizedTVL + 0.30 * recentGrowth + 0.25 * activeUsage`

Traction is not just TVL size. Growth quality matters.

## Why Buyers Use Lore

The point of Lore is not to say a protocol is "good." The point is to say whether the token still deserves capital after governance risk, treasury burn, and supply pressure are put in the same memo.

That turns hype into something underwritable.

## Risk Controls

- `governance concentration penalty`: stops insider-heavy structures from hiding behind traction
- `runway floor`: penalizes protocols that need token support just to keep operating
- `unlock overhang penalty`: treats near-term supply pressure as a first-order risk
- `quality weighting`: avoids over-rewarding raw TVL when monetization is weak

Lore is strict because the cost of a bad token memo is not just being wrong. It is being wrong with conviction.

## Quick Start

```bash
git clone https://github.com/LoreResearch/Lore
cd Lore
npm install
cp .env.example .env
npm run dev
```

## Local Audit Docs

- [Commit sequence](docs/commit-sequence.md)
- [Issue drafts](docs/issue-drafts.md)

## Support Docs

- [Runbook](docs/runbook.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## License

MIT
