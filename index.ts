import { getAllProtocols } from "./src/data/registry.js";
import { fetchProtocolMetrics } from "./src/data/defillama.js";
import { runLoreAgent } from "./src/agent/loop.js";
import { printReport } from "./src/output/printer.js";
import { saveReport, getAllReports } from "./src/output/store.js";
import { config } from "./src/lib/config.js";
import { log } from "./src/lib/logger.js";
import type { ResearchReport } from "./src/lib/types.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function researchProtocol(protocolId: string): Promise<ResearchReport | null> {
  const protocols = getAllProtocols();
  const protocol = protocols.find((p) => p.id === protocolId);
  if (!protocol) {
    log.warn(`Protocol not found: ${protocolId}`);
    return null;
  }

  log.info(`Researching ${protocol.name}...`);
  const metrics = await fetchProtocolMetrics(protocol).catch((e) => {
    const message = e instanceof Error ? e.message : String(e);
    log.warn(`Metrics fetch failed for ${protocol.name}:`, message);
    return null;
  });

  const report = await runLoreAgent(protocol, metrics).catch((e) => {
    const message = e instanceof Error ? e.message : String(e);
    log.warn(`Research generation failed for ${protocol.name}:`, message);
    return null;
  });

  if (report) {
    saveReport(report);
    printReport(report);
  }

  return report;
}

async function researchAll(): Promise<void> {
  const startedAt = Date.now();
  const protocols = getAllProtocols().slice(0, config.MAX_PROTOCOLS_PER_RUN);
  log.info(`Researching ${protocols.length} protocols...`);
  const cycleReports: ResearchReport[] = [];
  let skippedProtocols = 0;

  for (const protocol of protocols) {
    const report = await researchProtocol(protocol.id);
    if (report) {
      cycleReports.push(report);
    } else {
      skippedProtocols++;
    }

    await sleep(1000);
  }

  const all = getAllReports();
  const leader = cycleReports.sort((a, b) => b.overallScore - a.overallScore)[0];
  const durationMs = Date.now() - startedAt;

  log.info(
    `Research complete. ${cycleReports.length} reports generated this cycle | ${skippedProtocols} skipped | ${all.length} stored total`,
  );

  if (leader) {
    log.info(`Top protocol this cycle: ${leader.protocolName} (${leader.overallScore}) - ${leader.verdict}`);
  } else {
    log.info("No protocol reports qualified this cycle");
  }

  log.info("Lore research cycle complete", { durationMs });
}

async function main(): Promise<void> {
  log.info("Lore v0.1.0 - DeFi protocol research agent");

  const target = process.argv[2];
  if (target) {
    await researchProtocol(target);
  } else {
    let cycleInFlight = false;
    let skippedCycles = 0;

    const tick = async () => {
      if (cycleInFlight) {
        skippedCycles++;
        log.warn("Skipping research cycle because the previous sweep is still running", {
          skippedCycles,
        });
        return;
      }

      cycleInFlight = true;
      try {
        await researchAll();
      } catch (e) {
        log.error("Research cycle error:", e);
      } finally {
        cycleInFlight = false;
      }
    };

    await tick();
    setInterval(() => {
      void tick();
    }, config.REFRESH_INTERVAL_MS);
  }
}

main().catch((e) => {
  log.error("Fatal:", e);
  process.exit(1);
});
