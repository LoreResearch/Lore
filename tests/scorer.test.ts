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
});
