import fs from "node:fs";
import path from "node:path";

import { appendRowToSheet } from "../server/googleSheets";
import { leadSchema, toSheetRow } from "../server/leadSchema";

// Vercel serverless function backing POST /api/leads. Mirrors server/leads.ts,
// which handles the same route for the standalone Node/Express deploy target.
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "invalid_input" });
    return;
  }

  const entry = { ...parsed.data, receivedAt: new Date().toISOString() };

  try {
    await appendRowToSheet(toSheetRow(entry));
  } catch (err) {
    console.error("Failed to append lead to Google Sheets, falling back to /tmp", err);
    try {
      // NOTE: Vercel functions have a read-only filesystem except /tmp, and
      // /tmp is wiped on cold start/redeploy — this fallback only keeps the
      // form flow working end to end if Sheets is temporarily unreachable.
      fs.appendFileSync(path.join("/tmp", "leads.jsonl"), `${JSON.stringify(entry)}\n`, "utf-8");
    } catch (fallbackErr) {
      console.error("Failed to persist lead to /tmp either", fallbackErr);
    }
  }

  res.status(200).json({ ok: true });
}
