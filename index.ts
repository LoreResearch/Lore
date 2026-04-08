import { getAllProtocols } from "./src/data/registry.js";
import { fetchProtocolMetrics } from "./src/data/defillama.js";
import { runLoreAgent } from "./src/agent/loop.js";
import { printReport } from "./src/output/printer.js";
import { saveReport, getAllReports } from "./src/output/store.js";
import { config } from "./src/lib/config.js";
import { log } from "./src/lib/logger.js";

async function researchProtocol(protocolId: string): Promise<void> {
  const protocols = getAllProtocols();
  const protocol = protocols.find((p) => p.id === protocolId);
  if (!protocol) { log.warn(`Protocol not found: ${protocolId}`); return; }

  log.info(`Researching ${protocol.name}...`);
  const metrics = await fetchProtocolMetrics(protocol).catch((e) => {
    log.warn(`Metrics fetch failed for ${protocol.name}:`, e.message);
    return null;
  });

  const report = await runLoreAgent(protocol, metrics);
  if (report) {
    saveReport(report);
    printReport(report);
  }
}

async function researchAll(): Promise<void> {
  const protocols = getAllProtocols().slice(0, config.MAX_PROTOCOLS_PER_RUN);
  log.info(`Researching ${protocols.length} protocols...`);

  for (const protocol of protocols) {
    await researchProtocol(protocol.id);
    // small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  const all = getAllReports();
  log.info(`Research complete. ${all.length} reports generated.`);
  log.info(`Top protocol: ${all[0]?.protocolName} (${all[0]?.overallScore}) — ${all[0]?.verdict}`);
}

async function main(): Promise<void> {
  log.info("Lore v0.1.0 — DeFi protocol research agent");

  const target = process.argv[2];
  if (target) {
    await researchProtocol(target);
  } else {
    await researchAll();
    setInterval(() => researchAll().catch((e) => log.error("Research cycle error:", e)), config.REFRESH_INTERVAL_MS);
  }
}

main().catch((e) => { log.error("Fatal:", e); process.exit(1); });
