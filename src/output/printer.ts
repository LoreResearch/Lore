import type { ResearchReport } from "../lib/types.js";

const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[93m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

function scoreBar(score: number, width = 16): string {
  const filled = Math.round(score * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const color = score >= 0.7 ? GREEN : score >= 0.5 ? YELLOW : RED;
  return `${color}${bar}${RESET} ${score.toFixed(2)}`;
}

function verdictColor(v: string): string {
  switch (v) {
    case "accumulate": return GREEN;
    case "watch": return YELLOW;
    case "avoid": return RED;
    default: return DIM;
  }
}

export function printReport(report: ResearchReport): void {
  const bar = "═".repeat(68);
  const vc = verdictColor(report.verdict);

  console.log(`\n${BOLD}${bar}${RESET}`);
  console.log(`  ${BOLD}${CYAN}${report.protocolName.toUpperCase()}${RESET}  —  ${vc}${BOLD}${report.verdict.toUpperCase()}${RESET}  (overall: ${report.overallScore.toFixed(2)})`);
  console.log(`${BOLD}${bar}${RESET}`);

  console.log(`\n  ${BOLD}SCORES${RESET}`);
  console.log(`  Security   ${scoreBar(report.scores.security)}`);
  console.log(`  Traction   ${scoreBar(report.scores.traction)}`);
  console.log(`  Tokenomics ${scoreBar(report.scores.tokenomics)}`);
  console.log(`  Team       ${scoreBar(report.scores.team)}`);
  console.log(`  Moat       ${scoreBar(report.scores.moat)}`);

  console.log(`\n  ${BOLD}SUMMARY${RESET}`);
  console.log(`  ${report.summary}`);

  console.log(`\n  ${GREEN}✓ BULLISH${RESET}`);
  for (const p of report.bullishPoints) console.log(`    · ${p}`);

  console.log(`\n  ${RED}✗ BEARISH${RESET}`);
  for (const p of report.bearishPoints) console.log(`    · ${p}`);

  console.log(`\n  ${YELLOW}⚠ WATCH${RESET}`);
  for (const p of report.watchItems) console.log(`    · ${p}`);

  console.log(`\n${bar}\n`);
}
