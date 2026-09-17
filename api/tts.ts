// This file must stay self-contained (no imports from outside /api): Vercel's
// serverless function builder does not reliably resolve relative TypeScript
// imports across directories at runtime, which throws ERR_MODULE_NOT_FOUND.
// server/tts.ts (the standalone Node/Express deploy target) duplicates this
// logic because it's bundled differently (via esbuild, which does support it).

const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_MODEL_ID = "eleven_turbo_v2_5";
const MAX_TEXT_LENGTH = 500;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const text = req.body?.text;
  if (typeof text !== "string" || !text.trim()) {
    res.status(400).json({ ok: false, error: "invalid_input" });
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ ok: false, error: "elevenlabs_not_configured" });
    return;
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;

  let upstream: Response;
  try {
    upstream = await fetch(`${ELEVENLABS_TTS_URL}/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.slice(0, MAX_TEXT_LENGTH),
        model_id: modelId,
        voice_settings: { stability: 0.4, similarity_boost: 0.8 },
      }),
    });
  } catch (err) {
    console.error("ElevenLabs request failed", err);
    res.status(502).json({ ok: false, error: "elevenlabs_unreachable" });
    return;
  }

  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error("ElevenLabs returned an error", upstream.status, detail);
    res.status(502).json({ ok: false, error: `elevenlabs_error_${upstream.status}: ${detail.slice(0, 200)}` });
    return;
  }

  const audio = Buffer.from(await upstream.arrayBuffer());
  res.setHeader("Content-Type", "audio/mpeg");
  res.status(200).send(audio);
}
