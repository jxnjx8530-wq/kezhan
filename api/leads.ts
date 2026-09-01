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

// Vercel serverless function backing POST /api/leads. Mirrors server/leads.ts,
// which handles the same route for the standalone Node/Express deploy target.
export default function handler(req: any, res: any) {
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
    // NOTE: Vercel functions have a read-only filesystem except /tmp, and
    // /tmp is wiped on cold start/redeploy — this is a stopgap so the form
    // flow works end to end, not durable storage. Before relying on this
    // for real signups, wire it to a real datastore or an email/webhook
    // service instead.
    fs.appendFileSync(path.join("/tmp", "leads.jsonl"), `${JSON.stringify(entry)}\n`, "utf-8");
  } catch (err) {
    console.error("Failed to persist lead", err);
  }

  res.status(200).json({ ok: true });
}
