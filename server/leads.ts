import fs from "node:fs";
import path from "node:path";

import { appendRowToSheet } from "./googleSheets";
import { leadSchema, toSheetRow } from "./leadSchema";

const dataDir = path.resolve(process.cwd(), "data");
const dataFile = path.join(dataDir, "leads.jsonl");

export type SaveLeadResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function saveLead(body: unknown): Promise<SaveLeadResult> {
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const entry = { ...parsed.data, receivedAt: new Date().toISOString() };

  try {
    await appendRowToSheet(toSheetRow(entry));
    return { ok: true };
  } catch (err) {
    console.error("Failed to append lead to Google Sheets, falling back to local file", err);
    try {
      fs.mkdirSync(dataDir, { recursive: true });
      fs.appendFileSync(dataFile, `${JSON.stringify(entry)}\n`, "utf-8");
      return { ok: true };
    } catch (fallbackErr) {
      console.error("Failed to persist lead locally either", fallbackErr);
      return { ok: false, status: 500, error: "storage_error" };
    }
  }
}
