/**
 * Text-to-speech via ElevenLabs, used to voice the AI's lines in the
 * scenario practice pages. Kept server-side because it needs the secret
 * ElevenLabs API key — never expose that key to the browser.
 */
const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
// "Rachel", one of ElevenLabs' premade voices; works with the multilingual
// model. Override with ELEVENLABS_VOICE_ID to use a voice from your own
// ElevenLabs library instead.
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
// Turbo, not the flagship multilingual model: broadly available on free
// plans and cheaper per character. Override with ELEVENLABS_MODEL_ID if a
// higher-quality model is available on the account.
const DEFAULT_MODEL_ID = "eleven_turbo_v2_5";
const MAX_TEXT_LENGTH = 500;

export type SpeakResult =
  | { ok: true; audio: Buffer; contentType: string }
  | { ok: false; status: number; error: string };

export async function synthesizeSpeech(text: unknown): Promise<SpeakResult> {
  if (typeof text !== "string" || !text.trim()) {
    return { ok: false, status: 400, error: "invalid_input" };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, error: "elevenlabs_not_configured" };
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
    return { ok: false, status: 502, error: "elevenlabs_unreachable" };
  }

  if (!upstream.ok) {
    const detail = await upstream.text();
    console.error("ElevenLabs returned an error", upstream.status, detail);
    return { ok: false, status: 502, error: `elevenlabs_error_${upstream.status}: ${detail.slice(0, 200)}` };
  }

  const audio = Buffer.from(await upstream.arrayBuffer());
  return { ok: true, audio, contentType: "audio/mpeg" };
}
