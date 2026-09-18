/**
 * Generic conversation practice, now with voice: the AI's lines can be
 * played aloud (ElevenLabs TTS via /api/tts), and the learner can speak
 * their reply instead of tapping one (browser Web Speech API STT). Renders
 * whichever scenario the slug points to. The scripted lines are reference
 * examples of how the exchange could go, not a required script — speaking
 * or tapping one just moves the conversation forward, the way real
 * conversation would. Spoken input is never blocked on an exact match: a
 * close match advances as that choice, anything else still advances as the
 * learner's own phrasing, with the closest line shown only as a reference.
 */
import { ArrowLeft, Mic, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";
import { getScenario, type Choice, type Line, type ScenarioWithImage } from "@/data/scenarios";
import NotFound from "@/pages/NotFound";

const BRAND_MARK = "/brand-mark.svg";
const VOICE_MATCH_THRESHOLD = 0.6;

type Message =
  | { speaker: "ai"; line: Line }
  | { speaker: "learner"; line: Line; matched?: boolean }
  | { speaker: "learner-voice"; heard: string; reference: Line };

interface SpeechRecognitionResultLike {
  results: { 0: { transcript: string } }[];
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition || w.webkitSpeechRecognition) as (new () => SpeechRecognitionLike) | undefined;
}

function normalizeZh(value: string): string {
  return value.replace(/[，。！？、,.!?\s]/g, "");
}

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

function findBestVoiceMatch(heard: string, choices: Choice[]): { choice: Choice; score: number } {
  const normalizedHeard = normalizeZh(heard);
  let best = { choice: choices[0], score: -1 };
  for (const choice of choices) {
    const score = similarity(normalizedHeard, normalizeZh(choice.line.zh));
    if (score > best.score) best = { choice, score };
  }
  return best;
}

export default function PracticeScenario() {
  const { slug } = useParams<{ slug: string }>();
  const scenario = slug ? getScenario(slug) : undefined;

  if (!scenario) {
    return <NotFound />;
  }

  return <ScenarioChat scenario={scenario} />;
}

function initialHistory(scenario: ScenarioWithImage): Message[] {
  const aiLine = scenario.dialogue.start.aiLine;
  return aiLine ? [{ speaker: "ai", line: aiLine }] : [];
}

function ScenarioChat({ scenario }: { scenario: ScenarioWithImage }) {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  const { dialogue } = scenario;

  const [history, setHistory] = useState<Message[]>(() => initialHistory(scenario));
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [completed, setCompleted] = useState(false);
  const [pickedCount, setPickedCount] = useState(0);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);

  const currentNode = dialogue[currentNodeId];
  const speechSupported = Boolean(getSpeechRecognitionCtor());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const node = sceneRef.current;
      if (!node) return;
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;
      node.style.setProperty("--parallax-x", `${xRatio * -22}px`);
      node.style.setProperty("--parallax-y", `${yRatio * -16}px`);
      node.style.setProperty("--tilt-x", `${yRatio * 9}deg`);
      node.style.setProperty("--tilt-y", `${xRatio * -11}deg`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const advance = (nextId: string, nextHistory: Message[]) => {
    if (nextId === "end") {
      setHistory(nextHistory);
      setCompleted(true);
      return;
    }

    const nextNode = dialogue[nextId];
    setHistory(nextNode.aiLine ? [...nextHistory, { speaker: "ai", line: nextNode.aiLine }] : nextHistory);

    if (nextNode.choices.length === 0) {
      setCompleted(true);
    } else {
      setCurrentNodeId(nextId);
    }
  };

  const handleChoice = (choice: Choice) => {
    setPickedCount(count => count + 1);
    advance(choice.next, [...history, { speaker: "learner", line: choice.line, matched: true }]);
  };

  const handleVoiceResult = (heard: string) => {
    setPickedCount(count => count + 1);
    const { choice, score } = findBestVoiceMatch(heard, currentNode.choices);

    if (score >= VOICE_MATCH_THRESHOLD) {
      advance(choice.next, [...history, { speaker: "learner", line: choice.line, matched: true }]);
    } else {
      // Never block: accept whatever was said and move on, showing the
      // closest scripted line as a reference, not as "the right answer".
      advance(choice.next, [...history, { speaker: "learner-voice", heard, reference: choice.line }]);
    }
  };

  const handleMicClick = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setVoiceError(t("이 브라우저는 음성 인식을 지원하지 않아요. 크롬을 사용해보세요.", "This browser doesn't support speech recognition. Try Chrome."));
      return;
    }
    setVoiceError(null);
    const recognition = new Ctor();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      handleVoiceResult(transcript);
    };
    recognition.onerror = () => {
      setListening(false);
      setVoiceError(t("음성을 인식하지 못했어요. 다시 시도해보세요.", "Couldn't catch that. Please try again."));
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  const playLine = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) {
      toast(t("음성 재생 미지원", "Audio playback not supported"), {
        description: t("이 브라우저는 음성 합성을 지원하지 않아요. 크롬을 사용해보세요.", "This browser doesn't support speech synthesis. Try Chrome."),
      });
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.92;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleRestart = () => {
    setHistory(initialHistory(scenario));
    setCurrentNodeId("start");
    setCompleted(false);
    setPickedCount(0);
    setVoiceError(null);
  };

  const Icon = scenario.icon;
  const stepNow = Math.min(scenario.stepIndex(currentNodeId) + 1, scenario.totalSteps);

  return (
    <div className="chat-shell">
      <div className="chat-scene-bg" ref={sceneRef} aria-hidden="true">
        <div className="chat-scene-drift">
          <img src={scenario.image} alt="" />
        </div>
      </div>

      <header className="chat-header">
        <Link href="/" className="chat-back">
          <ArrowLeft size={18} />
          <span>{t("홈으로", "Home")}</span>
        </Link>
        <div className="chat-title">
          <Icon size={18} />
          <span>{t(scenario.ko.title, scenario.en.title)}</span>
        </div>
        <span className="chat-progress">
          {stepNow}/{scenario.totalSteps}
        </span>
      </header>

      <div className="chat-note">
        <img src={BRAND_MARK} alt="" />
        <p>
          {t(
            "프로토타입 안내: 이 대화는 정해진 정답이 아니라, 실제 상황에서 참고할 수 있는 예시 표현입니다. 반드시 이대로 말해야 하는 건 아니고, 다른 표현을 써도 전혀 문제없습니다. AI 목소리 재생과 음성 인식은 실험 중인 기능입니다.",
            "Prototype note: these lines aren't the one correct answer — they're example phrasing you could use in the real situation. You're free to say it differently. AI voice playback and speech recognition are experimental features here."
          )}
        </p>
      </div>

      <div className="chat-scene-peek">
        <img className="chat-scene-hero" src={scenario.image} alt={t(scenario.ko.title, scenario.en.title)} />
      </div>

      <main className="chat-main">
        {history.map((message, index) => {
          if (message.speaker === "ai" || message.speaker === "learner") {
            return (
              <div key={index} className={`chat-bubble-row ${message.speaker === "ai" ? "ai" : "learner"}`}>
                <div className="chat-bubble">
                  {message.speaker === "ai" && (
                    <button
                      type="button"
                      className="chat-speak-button"
                      onClick={() => playLine(message.line.zh, index)}
                      disabled={speakingIndex === index}
                      aria-label={t("소리로 듣기", "Play audio")}
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                  <strong>{message.line.zh}</strong>
                  <small className="chat-pinyin">{message.line.pinyin}</small>
                  <small className="chat-translation">{t(message.line.ko, message.line.en)}</small>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="chat-bubble-row learner">
              <div className="chat-bubble chat-bubble-voice">
                <span className="chat-bubble-tag">{t("직접 말한 표현", "What you said")}</span>
                <strong className="chat-free-text">{message.heard}</strong>
                <div className="chat-reference">
                  <span>{t("참고 표현", "Reference")}</span>
                  <small>{message.reference.zh}</small>
                  <small className="chat-pinyin">{message.reference.pinyin}</small>
                  <small className="chat-translation">{t(message.reference.ko, message.reference.en)}</small>
                </div>
              </div>
            </div>
          );
        })}

        {!completed && (
          <div className="chat-choices">
            <div className="chat-voice-area">
              <button type="button" className={`chat-mic-button ${listening ? "listening" : ""}`} onClick={handleMicClick} disabled={!speechSupported || listening}>
                <Mic size={18} />
                {listening ? t("듣는 중...", "Listening...") : t("중국어로 말해보기", "Say it in Chinese")}
              </button>
              {voiceError && <p className="chat-voice-error">{voiceError}</p>}
              {!speechSupported && (
                <p className="chat-voice-error">
                  {t("이 브라우저는 음성 인식을 지원하지 않아요. 크롬을 사용해보세요.", "This browser doesn't support speech recognition. Try Chrome.")}
                </p>
              )}
            </div>

            <span className="chat-choices-label">
              {currentNode.choices.length > 1
                ? t("또는 예시 중 하나를 눌러보세요", "Or tap one of these examples")
                : t("또는 예시를 눌러보세요", "Or tap this example")}
            </span>
            {currentNode.choices.map(choice => (
              <button key={choice.id} className="chat-choice" onClick={() => handleChoice(choice)}>
                <span className="chat-choice-zh">{choice.line.zh}</span>
                <span className="chat-choice-pinyin">{choice.line.pinyin}</span>
                <span className="chat-choice-translation">{t(choice.line.ko, choice.line.en)}</span>
              </button>
            ))}
          </div>
        )}

        {completed && (
          <div className="chat-complete">
            <h2>{t("대화를 완료했습니다!", "You finished the conversation!")}</h2>
            <p>
              {t(
                `이 대화에서 ${pickedCount}번의 응답을 선택하며 흐름을 이어갔습니다. 다음 버전에서는 이 자리에 발음·표현·현지 말투에 대한 AI 피드백이 표시됩니다.`,
                `You carried this conversation through ${pickedCount} responses. In the next version, this is where AI feedback on pronunciation, phrasing, and local tone will appear.`
              )}
            </p>
            <div className="chat-complete-actions">
              <button className="button button-solid" onClick={handleRestart}>
                <RotateCcw size={17} />
                {t("다시 해보기", "Try Again")}
              </button>
              <Link href="/practice" className="text-link chat-home-link">
                {t("다른 시나리오 보기", "Browse other scenarios")}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
