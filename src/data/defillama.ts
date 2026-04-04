import type { ProtocolMetrics } from "../lib/types.js";
import { config } from "../lib/config.js";

interface DefiLlamaProtocol {
  name: string;
  tvl: number;
  change_7d: number;
  volume24h?: number;
  audits?: string;
  symbol?: string;
  mcap?: number;
}

export async function fetchProtocolMetrics(protocolName: string): Promise<ProtocolMetrics | null> {
  const url = `${config.DEFILLAMA_BASE}/protocols`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DefiLlama ${res.status}`);

  const protocols = await res.json() as DefiLlamaProtocol[];
  const match = protocols.find(
    (p) => p.name.toLowerCase() === protocolName.toLowerCase()
  );

  if (!match) return null;

  return {
    tvlUsd: match.tvl ?? 0,
    tvl7dChange: match.change_7d ?? 0,
    volumeUsd24h: match.volume24h ?? 0,
    users24h: 0,
    audits: match.audits ? match.audits.split(",").map((s) => s.trim()) : [],
    tokenSymbol: match.symbol,
    mcapUsd: match.mcap,
  };
}

export async function fetchTopSolanaProtocols(limit = 20): Promise<Array<{ name: string; tvl: number }>> {
  const url = `${config.DEFILLAMA_BASE}/protocols`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DefiLlama ${res.status}`);

  const all = await res.json() as Array<{ name: string; tvl: number; chain?: string; chains?: string[] }>;
  return all
    .filter((p) =>
      (p.chain?.toLowerCase() === "solana" || p.chains?.some((c) => c.toLowerCase() === "solana")) &&
      p.tvl >= config.MIN_TVL_USD
    )
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, limit)
    .map(({ name, tvl }) => ({ name, tvl }));
}
