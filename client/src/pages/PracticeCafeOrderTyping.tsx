/**
 * Prototype variant B: same scripted dialogue as PracticeCafeOrder, but the
 * learner types the pinyin themselves instead of tapping a pre-written
 * choice — a production task rather than a recognition task, closer to what
 * speaking practice will feel like once a speech API is wired in.
 */
import { ArrowLeft, Check, Coffee, RotateCcw, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  cafeOrderDialogue as dialogue,
  cafeOrderStepIndex as stepIndex,
  CAFE_ORDER_TOTAL_STEPS as TOTAL_STEPS,
  type Choice,
  type Line,
} from "@/data/cafeOrderDialogue";

const BRAND_MARK = "/brand-mark.svg";
const MATCH_THRESHOLD = 0.72;

interface Message {
  speaker: "ai" | "learner";
  line: Line;
}

function normalizePinyin(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

function findBestMatch(input: string, choices: Choice[]): { choice: Choice; score: number } {
  const normalizedInput = normalizePinyin(input);
  let best = { choice: choices[0], score: -1 };
  for (const choice of choices) {
    const score = similarity(normalizedInput, normalizePinyin(choice.line.pinyin));
    if (score > best.score) best = { choice, score };
  }
  return best;
}

export default function PracticeCafeOrderTyping() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  const [history, setHistory] = useState<Message[]>([{ speaker: "ai", line: dialogue.start.aiLine }]);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [completed, setCompleted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);

  const currentNode = dialogue[currentNodeId];

  const advance = (choice: Choice) => {
    const nextHistory: Message[] = [...history, { speaker: "learner", line: choice.line }];
    setInputValue("");
    setFeedback(null);
    setShowReveal(false);
    setHasRetried(false);

    if (choice.next === "end") {
      setHistory(nextHistory);
      setCompleted(true);
      return;
    }

    const nextNode = dialogue[choice.next];
    setHistory([...nextHistory, { speaker: "ai", line: nextNode.aiLine }]);
    setCurrentNodeId(choice.next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    setAttemptCount(count => count + 1);
    const { choice, score } = findBestMatch(inputValue, currentNode.choices);

    if (score >= MATCH_THRESHOLD) {
      if (!hasRetried) setCorrectFirstTry(count => count + 1);
      setFeedback("correct");
      window.setTimeout(() => advance(choice), 550);
    } else {
      setFeedback("incorrect");
      setHasRetried(true);
    }
  };

  const handleRestart = () => {
    setHistory([{ speaker: "ai", line: dialogue.start.aiLine }]);
    setCurrentNodeId("start");
    setCompleted(false);
    setAttemptCount(0);
    setCorrectFirstTry(0);
    setInputValue("");
    setFeedback(null);
    setShowReveal(false);
    setHasRetried(false);
  };

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <Link href="/" className="chat-back">
          <ArrowLeft size={18} />
          <span>{t("홈으로", "Home")}</span>
        </Link>
        <div className="chat-title">
          <Coffee size={18} />
          <span>{t("카페에서 음료 주문하기 · 타이핑형", "Ordering at a Café · Typing Mode")}</span>
        </div>
        <span className="chat-progress">
          {Math.min(stepIndex(currentNodeId) + 1, TOTAL_STEPS)}/{TOTAL_STEPS}
        </span>
      </header>

      <Link href="/practice/cafe-order" className="chat-mode-switch">
        {t("다른 방식(선택형)으로 보기 →", "See the tap-to-choose version →")}
      </Link>

      <div className="chat-note">
        <img src={BRAND_MARK} alt="" />
        <p>
          {t(
            "프로토타입 안내(타이핑형): 선택지를 누르는 대신, 병음을 직접 입력해서 말해보는 방식입니다. 성조 기호 없이 입력해도 인식됩니다. 예: 'da bei xiexie'",
            "Prototype note (typing mode): instead of tapping a choice, type the pinyin yourself. Tone marks aren't required — e.g. 'da bei xiexie' still works."
          )}
        </p>
      </div>

      <main className="chat-main">
        {history.map((message, index) => (
          <div key={index} className={`chat-bubble-row ${message.speaker}`}>
            <div className="chat-bubble">
              <strong>{message.line.zh}</strong>
              <small className="chat-pinyin">{message.line.pinyin}</small>
              <small className="chat-translation">{t(message.line.ko, message.line.en)}</small>
            </div>
          </div>
        ))}

        {!completed && (
          <div className="chat-type-area">
            <span className="chat-choices-label">{t("병음으로 말해보세요", "Say it in pinyin")}</span>
            <form className="chat-input-row" onSubmit={handleSubmit}>
              <input
                className="chat-input"
                value={inputValue}
                onChange={event => {
                  setInputValue(event.target.value);
                  if (feedback) setFeedback(null);
                }}
                placeholder={t("예: da bei xiexie", "e.g. da bei xiexie")}
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="chat-check-button">
                {t("확인", "Check")}
              </button>
            </form>

            {feedback === "correct" && (
              <div className="chat-feedback correct">
                <Check size={16} />
                {t("정확해요!", "That's right!")}
              </div>
            )}
            {feedback === "incorrect" && (
              <div className="chat-feedback incorrect">
                <X size={16} />
                <span>{t("다시 한 번 시도해보세요.", "Give it another try.")}</span>
                <button type="button" className="chat-reveal-link" onClick={() => setShowReveal(true)}>
                  {t("정답 보기", "Show the answer")}
                </button>
              </div>
            )}

            {showReveal && (
              <div className="chat-choices chat-reveal-list">
                {currentNode.choices.map(choice => (
                  <button key={choice.id} className="chat-choice" onClick={() => advance(choice)}>
                    <span className="chat-choice-zh">{choice.line.zh}</span>
                    <span className="chat-choice-pinyin">{choice.line.pinyin}</span>
                    <span className="chat-choice-translation">{t(choice.line.ko, choice.line.en)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {completed && (
          <div className="chat-complete">
            <h2>{t("대화를 완료했습니다!", "You finished the conversation!")}</h2>
            <p>
              {t(
                `총 ${attemptCount}번 입력해서 ${correctFirstTry}번은 한 번에 맞혔습니다. 다음 버전에서는 이 자리에 발음·표현·현지 말투에 대한 AI 피드백이 표시됩니다.`,
                `You typed ${attemptCount} answers and got ${correctFirstTry} right on the first try. In the next version, this is where AI feedback on pronunciation, phrasing, and local tone will appear.`
              )}
            </p>
            <div className="chat-complete-actions">
              <button className="button button-solid" onClick={handleRestart}>
                <RotateCcw size={17} />
                {t("다시 해보기", "Try Again")}
              </button>
              <Link href="/" className="text-link chat-home-link">
                {t("홈으로 돌아가기", "Back to Home")}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
