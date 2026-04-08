import type { ProtocolMetrics, ResearchScores } from "../lib/types.js";

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function scoreProtocol(metrics: ProtocolMetrics): ResearchScores {
  const feeMargin = metrics.feesUsd24h / Math.max(metrics.volumeUsd24h, 1);
  const runwayMonths = metrics.monthlyBurnUsd > 0 ? metrics.treasuryUsd / metrics.monthlyBurnUsd : 60;
  const mcapToTvl = metrics.mcapUsd && metrics.tvlUsd > 0 ? metrics.mcapUsd / metrics.tvlUsd : 2;
  const confidence = metrics.inputConfidence ?? 0.6;

  const governance = clamp(
    0.45 * clamp(metrics.audits.length / 4) +
    0.35 * clamp(1 - metrics.insiderOwnershipPct / 80) +
    0.20 * clamp(metrics.launchDate ? 1 : 0.35)
  );
  const feeRetention = clamp(
    0.55 * clamp(feeMargin / 0.015) +
    0.45 * clamp(metrics.feesUsd24h / 250_000)
  );
  const treasuryRunway = clamp(runwayMonths / 24);
  const unlockOverhang = clamp(
    1 - (0.65 * clamp(metrics.unlockPct90d / 40) + 0.35 * clamp((mcapToTvl - 1) / 4))
  );
  const tractionQuality = clamp(
    0.45 * clamp(metrics.tvlUsd / 400_000_000) +
    0.30 * clamp((metrics.tvl7dChange + 25) / 50) +
    0.25 * clamp(metrics.users24h / 20_000)
  );
  const confidenceMultiplier = 0.75 + confidence * 0.25;

  return {
    governance: Number((governance * confidenceMultiplier).toFixed(2)),
    feeRetention: Number((feeRetention * confidenceMultiplier).toFixed(2)),
    treasuryRunway: Number((treasuryRunway * confidenceMultiplier).toFixed(2)),
    unlockOverhang: Number((unlockOverhang * confidenceMultiplier).toFixed(2)),
    tractionQuality: Number((tractionQuality * confidenceMultiplier).toFixed(2)),
  };
}
