import crypto from "node:crypto";

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

/**
 * Resolves service-account credentials. Prefers GOOGLE_SERVICE_ACCOUNT_JSON
 * (the entire downloaded key file, pasted as-is into one env var) because
 * pasting just the private_key value into a UI text field is error-prone —
 * some inputs silently strip the real newlines a PEM key needs, and there's
 * no way to detect that from the resulting string. A JSON blob doesn't have
 * that problem: the key's newlines live inside the JSON string as literal
 * "\n" (backslash-n) characters, which survive even if actual newlines
 * elsewhere in the pasted text get collapsed.
 * Falls back to separate GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY
 * env vars for anyone who already set those up.
 */
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

/**
 * Appends one row to the configured Google Sheet via a service account.
 * See getCredentials() for the two supported env var setups. Also requires
 * GOOGLE_SHEET_ID; the sheet must be shared with the service account email
 * as Editor. Throws when unconfigured or on any request failure, so callers
 * can fall back to another storage path.
 */
export async function appendRowToSheet(row: string[]): Promise<void> {
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
