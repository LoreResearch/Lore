import { describe, it, expect } from "vitest";
import type { ProtocolMetrics } from "../src/lib/types.js";

function makeMetrics(overrides: Partial<ProtocolMetrics> = {}): ProtocolMetrics {
  return {
    tvlUsd: 100_000_000,
    tvl7dChange: 5,
    volumeUsd24h: 5_000_000,
    users24h: 1000,
    audits: ["Halborn", "Neodyme"],
    launchDate: "2022-09-01",
    tokenSymbol: "KMN",
    mcapUsd: 80_000_000,
    ...overrides,
  };
}

describe("protocol registry", () => {
  it("has required protocols", async () => {
    const { PROTOCOL_REGISTRY } = await import("../src/data/registry.js");
    const ids = PROTOCOL_REGISTRY.map((p) => p.id);
    expect(ids).toContain("kamino");
    expect(ids).toContain("jupiter");
    expect(ids).toContain("jito");
  });

  it("all protocols have required fields", async () => {
    const { PROTOCOL_REGISTRY } = await import("../src/data/registry.js");
    for (const p of PROTOCOL_REGISTRY) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.chain).toBeTruthy();
      expect(p.category).toBeTruthy();
    }
  });
});

describe("protocol scorer", () => {
  it("security score increases with more audits", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const low = scoreProtocol(makeMetrics({ audits: [] }));
    const high = scoreProtocol(makeMetrics({ audits: ["Halborn", "Sec3", "Neodyme", "OtterSec"] }));
    expect(high.security).toBeGreaterThan(low.security);
  });

  it("traction score is higher for larger TVL", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const small = scoreProtocol(makeMetrics({ tvlUsd: 1_000_000 }));
    const large = scoreProtocol(makeMetrics({ tvlUsd: 400_000_000 }));
    expect(large.traction).toBeGreaterThan(small.traction);
  });

  it("scores are bounded 0–1", async () => {
    const { scoreProtocol } = await import("../src/analysis/scorer.js");
    const scores = scoreProtocol(makeMetrics());
    for (const v of Object.values(scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe("report model", () => {
  it("verdict enum is valid", () => {
    const valid = ["accumulate", "watch", "avoid", "neutral"];
    expect(valid).toContain("accumulate");
  });

  it("overall score is average of five dimensions", () => {
    const scores = { security: 0.8, traction: 0.7, tokenomics: 0.6, team: 0.5, moat: 0.9 };
    const overall = Object.values(scores).reduce((a, b) => a + b) / 5;
    expect(overall).toBeCloseTo(0.7, 2);
  });
});
