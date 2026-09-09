import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

// This file must stay self-contained (no imports from outside /api): Vercel's
// serverless function builder does not reliably resolve relative TypeScript
// imports across directories at runtime, which throws ERR_MODULE_NOT_FOUND.
// server/leads.ts (the standalone Node/Express deploy target) duplicates this
// logic because it's bundled differently (via esbuild, which does support it).

const leadSchema = z.object({
  type: z.enum(["contact", "waitlist"]),
  source: z.string().max(100).optional(),
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().email().max(200),
  inquiryType: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
});

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  // Strip surrounding quotes in case they were pasted along with the value.
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  // Env vars/UIs often store the key with literal "\n" sequences instead of
  // real newlines; restore them. Leaves already-real newlines untouched.
  key = key.replace(/\\n/g, "\n");
  return key;
}

interface ServiceAccountCredentials {
  clientEmail: string;
  privateKey: string;
}

// Prefers GOOGLE_SERVICE_ACCOUNT_JSON (the whole downloaded key file pasted
// as one env var) over separate GOOGLE_SERVICE_ACCOUNT_EMAIL/GOOGLE_PRIVATE_KEY
// vars: pasting just the private_key value into a UI text field is error-prone
// since some inputs silently strip real newlines a PEM key needs. A JSON blob
// avoids that — the key's newlines live as literal "\n" text inside the JSON
// string, which survives even if actual newlines elsewhere get collapsed.
function getCredentials(): ServiceAccountCredentials {
  const jsonRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (jsonRaw) {
    let parsed: { client_email?: string; private_key?: string };
    try {
      parsed = JSON.parse(jsonRaw);
    } catch {
      throw new Error("google_service_account_json_invalid: GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON");
    }
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("google_service_account_json_incomplete: missing client_email or private_key");
    }
    return { clientEmail: parsed.client_email, privateKey: parsed.private_key };
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKeyRaw) {
    throw new Error("google_sheets_not_configured");
  }
  return { clientEmail, privateKey: normalizePrivateKey(privateKeyRaw) };
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), privateKey);
  const jwt = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function appendRowToSheet(row: string[]): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Leads";

  if (!sheetId) {
    throw new Error("google_sheets_not_configured");
  }

  const { clientEmail, privateKey } = getCredentials();
  if (!privateKey.includes("BEGIN PRIVATE KEY") || !privateKey.includes("END PRIVATE KEY")) {
    throw new Error("google_private_key_malformed: private key does not look like a PEM key");
  }
  const accessToken = await getAccessToken(clientEmail, privateKey);

  const range = `${sheetName}!A:A`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!res.ok) {
    throw new Error(`Google Sheets append failed: ${res.status} ${await res.text()}`);
  }
}

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
  const row = [
    entry.receivedAt,
    entry.type,
    entry.source ?? "",
    entry.name ?? "",
    entry.email,
    entry.inquiryType ?? "",
    entry.message ?? "",
  ];

  try {
    await appendRowToSheet(row);
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
