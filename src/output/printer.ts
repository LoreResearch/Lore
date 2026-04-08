import type { ResearchReport } from "../lib/types.js";

const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[93m";
const CYAN = "\x1b[36m";

function scoreBar(score: number, width = 16): string {
  const filled = Math.round(score * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const color = score >= 0.7 ? GREEN : score >= 0.5 ? YELLOW : RED;
  return `${color}${bar}${RESET} ${score.toFixed(2)}`;
}

function verdictColor(verdict: string): string {
  switch (verdict) {
    case "accumulate": return GREEN;
    case "watch": return YELLOW;
    case "avoid": return RED;
    default: return CYAN;
  }
}

export function printReport(report: ResearchReport): void {
  const bar = "═".repeat(72);
  const color = verdictColor(report.verdict);

  console.log(`\n${BOLD}${bar}${RESET}`);
  console.log(`  ${BOLD}${CYAN}${report.protocolName.toUpperCase()}${RESET}  --  ${color}${BOLD}${report.verdict.toUpperCase()}${RESET}  (allocation score ${report.overallScore.toFixed(2)})`);
  console.log(`${BOLD}${bar}${RESET}`);

  console.log(`\n  ${BOLD}DILIGENCE SCORES${RESET}`);
  console.log(`  Governance      ${scoreBar(report.scores.governance)}`);
  console.log(`  Fee retention   ${scoreBar(report.scores.feeRetention)}`);
  console.log(`  Treasury runway ${scoreBar(report.scores.treasuryRunway)}`);
  console.log(`  Unlock overhang ${scoreBar(report.scores.unlockOverhang)}`);
  console.log(`  Traction qual.  ${scoreBar(report.scores.tractionQuality)}`);

  console.log(`\n  ${BOLD}SUMMARY${RESET}`);
  console.log(`  ${report.summary}`);

  console.log(`\n  ${GREEN}BULLISH${RESET}`);
  for (const point of report.bullishPoints) console.log(`    · ${point}`);

  console.log(`\n  ${RED}BEARISH${RESET}`);
  for (const point of report.bearishPoints) console.log(`    · ${point}`);

  console.log(`\n  ${YELLOW}WATCH${RESET}`);
  for (const point of report.watchItems) console.log(`    · ${point}`);

  console.log(`\n${bar}\n`);
}
