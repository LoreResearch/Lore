import Anthropic from "@anthropic-ai/sdk";
import type { ProtocolMeta, ProtocolMetrics, ResearchReport } from "../lib/types.js";
import { LORE_SYSTEM } from "./prompts.js";
import { config } from "../lib/config.js";
import { log } from "../lib/logger.js";
import { scoreProtocol } from "../analysis/scorer.js";
import crypto from "crypto";

const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: "get_protocol_metadata",
    description: "Get basic metadata about the protocol (category, chain, website, github)",
    input_schema: {
      type: "object" as const,
      properties: { protocol_id: { type: "string" } },
      required: ["protocol_id"],
    },
  },
  {
    name: "get_protocol_metrics",
    description: "Get on-chain metrics: TVL, 7d change, volume, audits, token data",
    input_schema: {
      type: "object" as const,
      properties: { protocol_id: { type: "string" } },
      required: ["protocol_id"],
    },
  },
  {
    name: "get_preliminary_scores",
    description: "Get automatically computed scores based on available metrics (security, traction, tokenomics)",
    input_schema: {
      type: "object" as const,
      properties: { protocol_id: { type: "string" } },
      required: ["protocol_id"],
    },
  },
  {
    name: "submit_research_report",
    description: "Submit the final research report for this protocol",
    input_schema: {
      type: "object" as const,
      properties: {
        protocol_id: { type: "string" },
        scores: {
          type: "object",
          properties: {
            security: { type: "number" },
            traction: { type: "number" },
            tokenomics: { type: "number" },
            team: { type: "number" },
            moat: { type: "number" },
          },
          required: ["security", "traction", "tokenomics", "team", "moat"],
        },
        summary: { type: "string" },
        bullish_points: { type: "array", items: { type: "string" } },
        bearish_points: { type: "array", items: { type: "string" } },
        watch_items: { type: "array", items: { type: "string" } },
        verdict: { type: "string", enum: ["accumulate", "watch", "avoid", "neutral"] },
      },
      required: ["protocol_id", "scores", "summary", "bullish_points", "bearish_points", "watch_items", "verdict"],
    },
  },
];

export async function runLoreAgent(
  protocol: ProtocolMeta,
  metrics: ProtocolMetrics | null
): Promise<ResearchReport | null> {
  const preliminary = metrics ? scoreProtocol(metrics) : null;
  let report: ResearchReport | null = null;

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Research protocol: ${protocol.name} (${protocol.id}) on ${protocol.chain}. Generate a complete research report.`,
    },
  ];

  for (let turn = 0; turn < 12; turn++) {
    const response = await client.messages.create({
      model: config.CLAUDE_MODEL,
      max_tokens: 4096,
      system: LORE_SYSTEM,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });
    if (response.stop_reason !== "tool_use") break;

    const results: Anthropic.ToolResultBlockParam[] = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const input = block.input as Record<string, unknown>;
      let result = "";

      if (block.name === "get_protocol_metadata") {
        result = JSON.stringify(protocol);
      } else if (block.name === "get_protocol_metrics") {
        result = metrics ? JSON.stringify(metrics) : "metrics not available";
      } else if (block.name === "get_preliminary_scores") {
        result = preliminary
          ? JSON.stringify(preliminary)
          : "insufficient data for preliminary scoring";
      } else if (block.name === "submit_research_report") {
        const scores = input.scores as ResearchReport["scores"];
        const overall = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
        report = {
          id: crypto.randomUUID(),
          protocolId: input.protocol_id as string,
          protocolName: protocol.name,
          generatedAt: Date.now(),
          scores,
          overallScore: Math.round(overall * 100) / 100,
          summary: input.summary as string,
          bullishPoints: input.bullish_points as string[],
          bearishPoints: input.bearish_points as string[],
          watchItems: input.watch_items as string[],
          verdict: input.verdict as ResearchReport["verdict"],
        };
        log.info(`Report: ${protocol.name} — score=${report.overallScore} verdict=${report.verdict}`);
        result = JSON.stringify({ success: true, reportId: report.id });
      }

      results.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }

    messages.push({ role: "user", content: results });
  }

  return report;
}
