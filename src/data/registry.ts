import type { ProtocolMeta } from "../lib/types.js";

export const PROTOCOL_REGISTRY: ProtocolMeta[] = [
  {
    id: "kamino",
    name: "Kamino Finance",
    category: "lending",
    chain: "solana",
    website: "https://kamino.finance",
    github: "https://github.com/Kamino-Finance",
    twitter: "https://twitter.com/kaminofinance",
    description: "Automated liquidity management and lending on Solana",
    addedAt: Date.now(),
  },
  {
    id: "jito",
    name: "Jito",
    category: "liquid_staking",
    chain: "solana",
    website: "https://jito.network",
    github: "https://github.com/jito-labs",
    twitter: "https://twitter.com/jito_labs",
    description: "MEV-enhanced liquid staking on Solana",
    addedAt: Date.now(),
  },
  {
    id: "jupiter",
    name: "Jupiter",
    category: "dex",
    chain: "solana",
    website: "https://jup.ag",
    github: "https://github.com/jup-ag",
    twitter: "https://twitter.com/JupiterExchange",
    description: "Best-price DEX aggregator and liquidity infrastructure on Solana",
    addedAt: Date.now(),
  },
  {
    id: "marginfi",
    name: "MarginFi",
    category: "lending",
    chain: "solana",
    website: "https://marginfi.com",
    github: "https://github.com/mrgnlabs",
    twitter: "https://twitter.com/marginfi",
    description: "Permissionless borrowing and lending protocol on Solana",
    addedAt: Date.now(),
  },
  {
    id: "drift",
    name: "Drift Protocol",
    category: "perps",
    chain: "solana",
    website: "https://drift.trade",
    github: "https://github.com/drift-labs",
    twitter: "https://twitter.com/DriftProtocol",
    description: "Decentralized perpetuals and spot trading on Solana",
    addedAt: Date.now(),
  },
];

const customProtocols: ProtocolMeta[] = [];

export function getAllProtocols(): ProtocolMeta[] {
  return [...PROTOCOL_REGISTRY, ...customProtocols];
}

export function addProtocol(p: ProtocolMeta): void {
  customProtocols.push(p);
}

export function findProtocol(id: string): ProtocolMeta | undefined {
  return getAllProtocols().find((p) => p.id === id);
}
