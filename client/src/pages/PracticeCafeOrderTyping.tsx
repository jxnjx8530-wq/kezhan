/**
 * Prototype variant B: same scripted dialogue as PracticeCafeOrder, but the
 * learner types their own response instead of tapping a pre-written choice.
 *
 * Important: real conversation has no single correct sentence, so this never
 * blocks progress. Typing anything reasonable always advances the dialogue —
 * the scripted line is shown only as a reference example, and is highlighted
 * as "close to a common phrasing" when the input resembles it, never as the
 * one accepted answer. Learners can also just tap a reference example
 * directly at any time without typing at all.
 */
import { ArrowLeft, Check, Coffee, RotateCcw } from "lucide-react";
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

type Message =
  | { speaker: "ai"; line: Line }
  | { speaker: "learner"; line: Line; matched: boolean }
  | { speaker: "learner-free"; freeText: string; reference: Line };

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
  const [typedCount, setTypedCount] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const currentNode = dialogue[currentNodeId];

  const finishStep = (nextId: string, nextHistory: Message[]) => {
    setInputValue("");

    if (nextId === "end") {
      setHistory(nextHistory);
      setCompleted(true);
      return;
    }

    const nextNode = dialogue[nextId];
    setHistory([...nextHistory, { speaker: "ai", line: nextNode.aiLine }]);
    setCurrentNodeId(nextId);
  };

  const handleExampleClick = (choice: Choice) => {
    finishStep(choice.next, [...history, { speaker: "learner", line: choice.line, matched: true }]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    setTypedCount(count => count + 1);
    const { choice, score } = findBestMatch(text, currentNode.choices);

    if (score >= MATCH_THRESHOLD) {
      setMatchedCount(count => count + 1);
      finishStep(choice.next, [...history, { speaker: "learner", line: choice.line, matched: true }]);
    } else {
      // Never block: accept the learner's own phrasing and move on, showing
      // the closest scripted line as a reference, not as "the right answer".
      finishStep(choice.next, [...history, { speaker: "learner-free", freeText: text, reference: choice.line }]);
    }
  };

  const handleRestart = () => {
    setHistory([{ speaker: "ai", line: dialogue.start.aiLine }]);
    setCurrentNodeId("start");
    setCompleted(false);
    setTypedCount(0);
    setMatchedCount(0);
    setInputValue("");
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
            "프로토타입 안내(타이핑형): 실제 대화에는 정답이 하나만 있지 않습니다. 병음으로 자유롭게 입력하시면 그대로 대화가 이어지고, 아래 예시 표현은 참고용입니다 — 예시를 그대로 입력하지 않아도 다음 단계로 진행됩니다.",
            "Prototype note (typing mode): real conversation never has just one correct sentence. Type your own response in pinyin and the dialogue moves on regardless — the example below is just a reference, not a required answer."
          )}
        </p>
      </div>

      <main className="chat-main">
        {history.map((message, index) => {
          if (message.speaker === "ai" || message.speaker === "learner") {
            return (
              <div key={index} className={`chat-bubble-row ${message.speaker === "ai" ? "ai" : "learner"}`}>
                <div className="chat-bubble">
                  {message.speaker === "learner" && message.matched && (
                    <span className="chat-bubble-tag">
                      <Check size={12} />
                      {t("예시 표현과 비슷해요", "Close to the example")}
                    </span>
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
              <div className="chat-bubble chat-bubble-free">
                <span className="chat-bubble-tag">{t("자유 표현", "Your own phrasing")}</span>
                <strong className="chat-free-text">{message.freeText}</strong>
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
          <div className="chat-type-area">
            <span className="chat-choices-label">{t("병음으로 자유롭게 말해보세요", "Say it in pinyin, your own way")}</span>
            <form className="chat-input-row" onSubmit={handleSubmit}>
              <input
                className="chat-input"
                value={inputValue}
                onChange={event => setInputValue(event.target.value)}
                placeholder={t("예: da bei xiexie", "e.g. da bei xiexie")}
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className="chat-check-button">
                {t("말하기", "Say it")}
              </button>
            </form>

            <div className="chat-examples">
              <span className="chat-examples-label">
                {t("또는 예시 표현을 눌러 바로 진행하세요", "Or tap an example to move on directly")}
              </span>
              <div className="chat-choices">
                {currentNode.choices.map(choice => (
                  <button key={choice.id} className="chat-choice" onClick={() => handleExampleClick(choice)}>
                    <span className="chat-choice-zh">{choice.line.zh}</span>
                    <span className="chat-choice-pinyin">{choice.line.pinyin}</span>
                    <span className="chat-choice-translation">{t(choice.line.ko, choice.line.en)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {completed && (
          <div className="chat-complete">
            <h2>{t("대화를 완료했습니다!", "You finished the conversation!")}</h2>
            <p>
              {t(
                `직접 입력한 표현 ${typedCount}개 중 ${matchedCount}개가 예시 표현과 비슷했습니다. 다양하게 말해도 대화가 자연스럽게 이어진다는 걸 확인하는 게 이 프로토타입의 목적입니다. 다음 버전에서는 이 자리에 발음·표현·현지 말투에 대한 AI 피드백이 표시됩니다.`,
                `${matchedCount} of your ${typedCount} typed responses were close to the example phrasing. The point of this prototype is to show the conversation flows naturally no matter how you phrase it. In the next version, this is where AI feedback on pronunciation, phrasing, and local tone will appear.`
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
