import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1),
  CLAUDE_MODEL: z.string().default("claude-sonnet-4-6"),
  DEFILLAMA_BASE: z.string().default("https://api.llama.fi"),
  REFRESH_INTERVAL_MS: z.coerce.number().default(86_400_000),
  MIN_TVL_USD: z.coerce.number().default(1_000_000),
  MAX_PROTOCOLS_PER_RUN: z.coerce.number().default(10),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Config error:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
