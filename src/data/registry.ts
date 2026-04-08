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
    description: "Capital-efficient lending, vaults, and liquidity strategies on Solana",
    governanceModel: "foundation-led with public product cadence",
    tokenUtility: "governance, fee alignment, ecosystem incentives",
    launchDate: "2022-08-01",
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
    description: "MEV-enhanced liquid staking and blockspace infrastructure",
    governanceModel: "token governance with validator-aligned ecosystem influence",
    tokenUtility: "governance, value capture around MEV and staking flows",
    launchDate: "2022-11-29",
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
    description: "Routing, aggregation, launch surfaces, and front-end liquidity demand",
    governanceModel: "large community token base with active product governance",
    tokenUtility: "governance, launch alignment, ecosystem participation",
    launchDate: "2021-10-01",
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
    description: "Permissionless borrowing, points flywheel, and retail credit markets",
    governanceModel: "team-led operations with growing community oversight",
    tokenUtility: "ecosystem and governance optionality",
    launchDate: "2023-02-01",
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
    description: "Perpetuals, prediction-style flow, and exchange-style fee generation",
    governanceModel: "protocol token with product-driven governance cadence",
    tokenUtility: "governance and ecosystem coordination",
    launchDate: "2021-10-15",
    addedAt: Date.now(),
  },
];

const customProtocols: ProtocolMeta[] = [];

export function getAllProtocols(): ProtocolMeta[] {
  return [...PROTOCOL_REGISTRY, ...customProtocols];
}

export function addProtocol(protocol: ProtocolMeta): void {
  customProtocols.push(protocol);
}

export function findProtocol(id: string): ProtocolMeta | undefined {
  return getAllProtocols().find((protocol) => protocol.id === id);
}
