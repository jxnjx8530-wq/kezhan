/**
 * Prototype: text-based conversation practice, no voice yet.
 * Scripted branching dialogue (matches the reviewed MVP scenario script)
 * rather than freeform LLM chat — validates the interaction shape before
 * a speech API is wired in.
 */
import { ArrowLeft, Coffee, RotateCcw } from "lucide-react";
import { useState } from "react";
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

interface Message {
  speaker: "ai" | "learner";
  line: Line;
}

export default function PracticeCafeOrder() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  const [history, setHistory] = useState<Message[]>([{ speaker: "ai", line: dialogue.start.aiLine }]);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [completed, setCompleted] = useState(false);
  const [pickedCount, setPickedCount] = useState(0);

  const currentNode = dialogue[currentNodeId];

  const handleChoice = (choice: Choice) => {
    const nextHistory: Message[] = [...history, { speaker: "learner", line: choice.line }];
    setPickedCount(count => count + 1);

    if (choice.next === "end") {
      setHistory(nextHistory);
      setCompleted(true);
      return;
    }

    const nextNode = dialogue[choice.next];
    setHistory([...nextHistory, { speaker: "ai", line: nextNode.aiLine }]);
    setCurrentNodeId(choice.next);
  };

  const handleRestart = () => {
    setHistory([{ speaker: "ai", line: dialogue.start.aiLine }]);
    setCurrentNodeId("start");
    setCompleted(false);
    setPickedCount(0);
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
          <span>{t("카페에서 음료 주문하기", "Ordering a Drink at a Café")}</span>
        </div>
        <span className="chat-progress">
          {Math.min(stepIndex(currentNodeId) + 1, TOTAL_STEPS)}/{TOTAL_STEPS}
        </span>
      </header>

      <Link href="/practice/cafe-order-typing" className="chat-mode-switch">
        {t("다른 방식(타이핑형)으로 보기 →", "See the typing-mode version →")}
      </Link>

      <div className="chat-note">
        <img src={BRAND_MARK} alt="" />
        <p>
          {t(
            "프로토타입 안내: 지금은 실제 음성 없이, 미리 검수된 대화 스크립트를 선택지로 눌러 진행하는 텍스트 버전입니다. AI 음성 인식·발음 평가는 준비 중입니다.",
            "Prototype note: this is a text-only version — no live voice yet. You're stepping through a reviewed dialogue script by tapping choices. AI speech recognition and pronunciation feedback are still in progress."
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
          <div className="chat-choices">
            <span className="chat-choices-label">
              {currentNode.choices.length > 1
                ? t("이렇게 말해보세요 — 하나를 골라주세요", "Say it this way — pick one")
                : t("이렇게 말해보세요", "Say it this way")}
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
                `카페 주문 대화에서 ${pickedCount}번의 응답을 선택하며 대화를 이어갔습니다. 다음 버전에서는 이 자리에 발음·표현·현지 말투에 대한 AI 피드백이 표시됩니다.`,
                `You carried the cafe-order conversation through ${pickedCount} responses. In the next version, this is where AI feedback on pronunciation, phrasing, and local tone will appear.`
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
