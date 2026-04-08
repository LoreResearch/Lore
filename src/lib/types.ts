export type ProtocolCategory =
  | "lending"
  | "dex"
  | "liquid_staking"
  | "perps"
  | "bridge"
  | "yield"
  | "launchpad"
  | "other";

export type Chain = "solana";

export interface ProtocolMeta {
  id: string;
  name: string;
  category: ProtocolCategory;
  chain: Chain;
  website: string;
  github?: string;
  twitter?: string;
  description: string;
  governanceModel: string;
  tokenUtility: string;
  addedAt: number;
}

export interface ProtocolMetrics {
  tvlUsd: number;
  tvl7dChange: number;
  volumeUsd24h: number;
  feesUsd24h: number;
  treasuryUsd: number;
  monthlyBurnUsd: number;
  users24h: number;
  audits: string[];
  launchDate?: string;
  tokenSymbol?: string;
  mcapUsd?: number;
  unlockPct90d: number;
  insiderOwnershipPct: number;
}

export interface ResearchScores {
  governance: number;
  feeRetention: number;
  treasuryRunway: number;
  unlockOverhang: number;
  tractionQuality: number;
}

export interface ResearchReport {
  id: string;
  protocolId: string;
  protocolName: string;
  generatedAt: number;
  scores: ResearchScores;
  overallScore: number;
  summary: string;
  bullishPoints: string[];
  bearishPoints: string[];
  watchItems: string[];
  verdict: "accumulate" | "watch" | "avoid" | "neutral";
}
