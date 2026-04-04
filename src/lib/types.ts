export type ProtocolCategory =
  | "lending"
  | "dex"
  | "liquid_staking"
  | "perps"
  | "bridge"
  | "yield"
  | "launchpad"
  | "other";

export type Chain = "solana" | "ethereum" | "base" | "arbitrum" | "sui";

export interface ProtocolMeta {
  id: string;
  name: string;
  category: ProtocolCategory;
  chain: Chain;
  website: string;
  github?: string;
  twitter?: string;
  description: string;
  addedAt: number;
}

export interface ProtocolMetrics {
  tvlUsd: number;
  tvl7dChange: number;
  volumeUsd24h: number;
  users24h: number;
  audits: string[];
  launchDate?: string;
  tokenSymbol?: string;
  mcapUsd?: number;
}

export interface ResearchReport {
  id: string;
  protocolId: string;
  protocolName: string;
  generatedAt: number;
  scores: {
    security: number;
    traction: number;
    tokenomics: number;
    team: number;
    moat: number;
  };
  overallScore: number;
  summary: string;
  bullishPoints: string[];
  bearishPoints: string[];
  watchItems: string[];
  verdict: "accumulate" | "watch" | "avoid" | "neutral";
}
