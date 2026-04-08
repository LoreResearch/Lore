import type { ProtocolMetrics, ProtocolMeta } from "../lib/types.js";
import { config } from "../lib/config.js";

interface DefiLlamaProtocol {
  name: string;
  tvl: number;
  change_7d: number;
  volume24h?: number;
  fees24h?: number;
  audits?: string;
  symbol?: string;
  mcap?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function inferResearchInputs(protocol: ProtocolMeta, match: DefiLlamaProtocol): Pick<ProtocolMetrics, "treasuryUsd" | "monthlyBurnUsd" | "users24h" | "unlockPct90d" | "insiderOwnershipPct"> {
  const tvl = match.tvl ?? 0;
  const volume24h = match.volume24h ?? 0;
  const fees24h = match.fees24h ?? Math.max(volume24h * 0.0012, 0);
  const audits = match.audits ? match.audits.split(",").map((item) => item.trim()).filter(Boolean) : [];
  const tvlScale = clamp(tvl / 400_000_000, 0, 1);
  const feeScale = clamp(fees24h / 250_000, 0, 1);
  const treasuryMultiple =
    protocol.category === "dex" ? 0.09 :
    protocol.category === "perps" ? 0.08 :
    protocol.category === "liquid_staking" ? 0.07 :
    0.06;
  const treasuryUsd = Math.round(clamp(Math.max(tvl * treasuryMultiple, fees24h * 90, 2_500_000), 2_500_000, 80_000_000));
  const monthlyBurnUsd = Math.round(clamp(treasuryUsd * (protocol.category === "perps" ? 0.036 : 0.03), 250_000, 2_400_000));
  const users24h = Math.round(Math.max(volume24h / 4_500, tvl / 250_000, 400));
  const unlockPct90d = Number((clamp(20 - tvlScale * 7 - feeScale * 4 - audits.length * 1.5, 4, 24)).toFixed(1));
  const insiderOwnershipPct = Number((clamp(34 - tvlScale * 7 - audits.length * 2 + (protocol.category === "launchpad" ? 3 : 0), 12, 38)).toFixed(1));

  return { treasuryUsd, monthlyBurnUsd, users24h, unlockPct90d, insiderOwnershipPct };
}

export async function fetchProtocolMetrics(protocol: ProtocolMeta): Promise<ProtocolMetrics | null> {
  const url = `${config.DEFILLAMA_BASE}/protocols`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DefiLlama ${res.status}`);

  const protocols = await res.json() as DefiLlamaProtocol[];
  const match = protocols.find((entry) => entry.name.toLowerCase() === protocol.name.toLowerCase());
  if (!match) return null;

  const inferred = inferResearchInputs(protocol, match);
  const inputConfidence = Number(
    clamp(
      0.45 +
      (match.tvl ? 0.15 : 0) +
      (match.volume24h ? 0.15 : 0) +
      (match.fees24h ? 0.1 : 0) +
      ((match.audits ? match.audits.split(",").filter(Boolean).length : 0) > 0 ? 0.05 : 0) +
      (protocol.launchDate ? 0.05 : 0),
      0.45,
      0.95
    ).toFixed(2)
  );

  return {
    tvlUsd: match.tvl ?? 0,
    tvl7dChange: match.change_7d ?? 0,
    volumeUsd24h: match.volume24h ?? 0,
    feesUsd24h: match.fees24h ?? Math.max((match.volume24h ?? 0) * 0.0012, 0),
    treasuryUsd: inferred.treasuryUsd,
    monthlyBurnUsd: inferred.monthlyBurnUsd,
    users24h: inferred.users24h,
    audits: match.audits ? match.audits.split(",").map((item) => item.trim()) : [],
    launchDate: protocol.launchDate,
    tokenSymbol: match.symbol,
    mcapUsd: match.mcap,
    unlockPct90d: inferred.unlockPct90d,
    insiderOwnershipPct: inferred.insiderOwnershipPct,
    inputConfidence,
    metricSources: {
      tvlUsd: "observed",
      tvl7dChange: "observed",
      volumeUsd24h: "observed",
      feesUsd24h: match.fees24h ? "observed_or_inferred" : "observed_or_inferred",
      treasuryUsd: "inferred",
      monthlyBurnUsd: "inferred",
      users24h: "inferred",
      launchDate: "registry",
      unlockPct90d: "inferred",
      insiderOwnershipPct: "inferred",
    },
  };
}
