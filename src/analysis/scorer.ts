import type { ProtocolMetrics, ResearchReport } from "../lib/types.js";

export function scoreProtocol(
  metrics: ProtocolMetrics
): ResearchReport["scores"] {
  // Security: audits present, longer history = higher score
  const securityScore = Math.min(
    1.0,
    (metrics.audits.length * 0.25) + (metrics.launchDate ? 0.2 : 0)
  );

  // Traction: TVL and volume as proxies for user adoption
  const tvlScore = Math.min(1.0, metrics.tvlUsd / 500_000_000);
  const volumeScore = Math.min(1.0, metrics.volumeUsd24h / 10_000_000);
  const tractionScore = (tvlScore * 0.6) + (volumeScore * 0.4);

  // Tokenomics: presence of token + market cap relative to TVL
  const hasToken = !!metrics.tokenSymbol;
  const mcapToTvl = metrics.mcapUsd && metrics.tvlUsd
    ? metrics.mcapUsd / metrics.tvlUsd
    : null;
  const tokenomicsScore = hasToken
    ? mcapToTvl
      ? Math.max(0, 1 - (mcapToTvl - 1) * 0.3)
      : 0.5
    : 0.3;

  // Team and moat require agent assessment (defaults)
  return {
    security: Math.round(securityScore * 100) / 100,
    traction: Math.round(tractionScore * 100) / 100,
    tokenomics: Math.round(Math.min(1, tokenomicsScore) * 100) / 100,
    team: 0,
    moat: 0,
  };
}
