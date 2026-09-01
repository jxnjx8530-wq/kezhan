import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const leadSchema = z.object({
  type: z.enum(["contact", "waitlist"]),
  source: z.string().max(100).optional(),
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(200),
  inquiryType: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
});

const dataDir = path.resolve(process.cwd(), "data");
const dataFile = path.join(dataDir, "leads.jsonl");

export type SaveLeadResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export function saveLead(body: unknown): SaveLeadResult {
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const entry = { ...parsed.data, receivedAt: new Date().toISOString() };

  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.appendFileSync(dataFile, `${JSON.stringify(entry)}\n`, "utf-8");
    return { ok: true };
  } catch (err) {
    console.error("Failed to persist lead", err);
    return { ok: false, status: 500, error: "storage_error" };
  }
}
