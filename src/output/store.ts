import type { ResearchReport } from "../lib/types.js";

const reports = new Map<string, ResearchReport>();

export function saveReport(report: ResearchReport): void {
  reports.set(report.protocolId, report);
}

export function getReport(protocolId: string): ResearchReport | undefined {
  return reports.get(protocolId);
}

export function getAllReports(): ResearchReport[] {
  return Array.from(reports.values()).sort((a, b) => b.overallScore - a.overallScore);
}

export function getSummaryTable(): Array<{
  name: string;
  verdict: string;
  score: number;
  security: number;
  traction: number;
}> {
  return getAllReports().map((r) => ({
    name: r.protocolName,
    verdict: r.verdict,
    score: r.overallScore,
    security: r.scores.security,
    traction: r.scores.traction,
  }));
}
