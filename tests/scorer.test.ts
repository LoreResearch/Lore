import { describe, expect, it } from "vitest";
import type { ProtocolMetrics } from "../src/lib/types.js";

function makeMetrics(overrides: Partial<ProtocolMetrics> = {}): ProtocolMetrics {
  return {
    tvlUsd: 100_000_000,
    tvl7dChange: 8,
    volumeUsd24h: 18_000_000,
    feesUsd24h: 54_000,
    treasuryUsd: 22_000_000,
    monthlyBurnUsd: 900_000,
    users24h: 3_200,
    audits: ["Halborn", "Neodyme"],
    launchDate: "2022-09-01",
    tokenSymbol: "KMN",
    mcapUsd: 120_000_000,
    unlockPct90d: 9,
    insiderOwnershipPct: 22,
    inputConfidence: 0.82,
    metricSources: {
      tvlUsd: "observed",
      tvl7dChange: "observed",
      volumeUsd24h: "observed",
      feesUsd24h: "observed_or_inferred",
      treasuryUsd: "inferred",
      monthlyBurnUsd: "inferred",
      users24h: "inferred",
      launchDate: "registry",
      unlockPct90d: "inferred",
      insiderOwnershipPct: "inferred",
    },
    ...overrides,
  };
}

describe("protocol registry", () => {
  it("contains core Solana protocols", async () => {
    const { PROTOCOL_REGISTRY } = await import("../src/data/registry.js");
    const ids = PROTOCOL_REGISTRY.map((protocol) => protocol.id);
    expect(ids).toContain("kamino");
    expect(ids).toContain("jupiter");
    expect(ids).toContain("jito");
  });
});

describe("protocol scorer", () => {
  it("penalizes concentrated insider ownership inside governance scoring", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const dispersed = scoreProtocol(makeMetrics({ insiderOwnershipPct: 16 }));
    const concentrated = scoreProtocol(makeMetrics({ insiderOwnershipPct: 58 }));
    expect(dispersed.governance).toBeGreaterThan(concentrated.governance);
  });

  it("rewards longer treasury runway", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const short = scoreProtocol(makeMetrics({ treasuryUsd: 6_000_000, monthlyBurnUsd: 1_500_000 }));
    const long = scoreProtocol(makeMetrics({ treasuryUsd: 36_000_000, monthlyBurnUsd: 900_000 }));
    expect(long.treasuryRunway).toBeGreaterThan(short.treasuryRunway);
  });

  it("penalizes large unlock overhang", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const clean = scoreProtocol(makeMetrics({ unlockPct90d: 6 }));
    const heavy = scoreProtocol(makeMetrics({ unlockPct90d: 32 }));
    expect(clean.unlockOverhang).toBeGreaterThan(heavy.unlockOverhang);
  });

  it("keeps scores bounded between 0 and 1", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const scores = scoreProtocol(makeMetrics());
    for (const value of Object.values(scores)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it("discounts reports when input confidence is lower", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const high = scoreProtocol(makeMetrics({ inputConfidence: 0.9 }));
    const low = scoreProtocol(makeMetrics({ inputConfidence: 0.45 }));
    expect(high.tractionQuality).toBeGreaterThan(low.tractionQuality);
  });
});
