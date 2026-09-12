/**
 * Generic text-based conversation practice, no voice yet. Renders whichever
 * scenario the slug points to. The scripted lines are reference examples of
 * how the exchange could go, not a required script — tapping one just moves
 * the conversation forward, the way real conversation would. Validates the
 * interaction shape before a speech API and a real adaptive AI are wired in.
 */
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";
import { getScenario, type Choice, type Line, type ScenarioWithImage } from "@/data/scenarios";
import NotFound from "@/pages/NotFound";

const BRAND_MARK = "/brand-mark.svg";

interface Message {
  speaker: "ai" | "learner";
  line: Line;
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
    setHistory(nextNode.aiLine ? [...nextHistory, { speaker: "ai", line: nextNode.aiLine }] : nextHistory);

    if (nextNode.choices.length === 0) {
      setCompleted(true);
    } else {
      setCurrentNodeId(choice.next);
    }
  };

  const handleRestart = () => {
    setHistory(initialHistory(scenario));
    setCurrentNodeId("start");
    setCompleted(false);
    setPickedCount(0);
  };

  const Icon = scenario.icon;
  const stepNow = Math.min(scenario.stepIndex(currentNodeId) + 1, scenario.totalSteps);

  return (
    <div className="chat-shell">
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

      <div className="chat-scene">
        <img src={scenario.image} alt={t(scenario.ko.title, scenario.en.title)} />
      </div>

      <div className="chat-note">
        <img src={BRAND_MARK} alt="" />
        <p>
          {t(
            "프로토타입 안내: 이 대화는 정해진 정답이 아니라, 실제 상황에서 참고할 수 있는 예시 표현입니다. 반드시 이대로 말해야 하는 건 아니고, 다른 표현을 써도 전혀 문제없습니다. 지금은 예시를 눌러 흐름을 확인하는 텍스트 버전이며, 다음 단계에서는 AI가 여러분이 실제로 하는 말에 맞춰 자연스럽게 대화를 이어가도록 발전시킬 예정입니다.",
            "Prototype note: these lines aren't the one correct answer — they're example phrasing you could use in the real situation. You're free to say it differently. This text version lets you tap examples to see how the flow works; the next step is an AI that actually adapts to whatever you say."
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
                ? t("이렇게 말할 수도 있어요 — 예시 중 하나를 눌러보세요", "Some ways you could say it — tap one example")
                : t("이렇게 말할 수도 있어요", "One way you could say it")}
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
