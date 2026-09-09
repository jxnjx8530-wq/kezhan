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

const BRAND_MARK = "/brand-mark.svg";

interface Line {
  zh: string;
  pinyin: string;
  ko: string;
  en: string;
}

interface Choice {
  id: string;
  line: Line;
  next: string;
}

interface DialogueNode {
  id: string;
  aiLine: Line;
  choices: Choice[];
}

const dialogue: Record<string, DialogueNode> = {
  start: {
    id: "start",
    aiLine: {
      zh: "欢迎光临,请问需要点什么?",
      pinyin: "Huānyíng guānglín, qǐngwèn xūyào diǎn shénme?",
      ko: "어서 오세요, 뭐 드릴까요?",
      en: "Welcome, what can I get for you?",
    },
    choices: [
      {
        id: "latte",
        line: { zh: "我要一杯拿铁。", pinyin: "Wǒ yào yì bēi nátiě.", ko: "라떼 한 잔 주세요.", en: "I'll have a latte." },
        next: "size",
      },
      {
        id: "americano",
        line: { zh: "我要一杯美式。", pinyin: "Wǒ yào yì bēi měishì.", ko: "아메리카노 한 잔 주세요.", en: "I'll have an Americano." },
        next: "size",
      },
      {
        id: "cappuccino",
        line: { zh: "我要一杯卡布奇诺。", pinyin: "Wǒ yào yì bēi kǎbùqínuò.", ko: "카푸치노 한 잔 주세요.", en: "I'll have a cappuccino." },
        next: "size",
      },
      {
        id: "milktea",
        line: { zh: "我要一杯奶茶。", pinyin: "Wǒ yào yì bēi nǎichá.", ko: "밀크티 한 잔 주세요.", en: "I'll have a milk tea." },
        next: "size",
      },
      {
        id: "menu",
        line: { zh: "我想看一下菜单。", pinyin: "Wǒ xiǎng kàn yíxià càidān.", ko: "메뉴 좀 보여주세요.", en: "Could I see the menu?" },
        next: "menu",
      },
    ],
  },
  menu: {
    id: "menu",
    aiLine: {
      zh: "好,这是菜单。",
      pinyin: "Hǎo, zhè shì càidān.",
      ko: "네, 여기 메뉴예요.",
      en: "Sure, here's the menu.",
    },
    choices: [
      {
        id: "latte2",
        line: { zh: "我要一杯拿铁。", pinyin: "Wǒ yào yì bēi nátiě.", ko: "라떼 한 잔 주세요.", en: "I'll have a latte." },
        next: "size",
      },
      {
        id: "americano2",
        line: { zh: "我要一杯美式。", pinyin: "Wǒ yào yì bēi měishì.", ko: "아메리카노 한 잔 주세요.", en: "I'll have an Americano." },
        next: "size",
      },
      {
        id: "cappuccino2",
        line: { zh: "我要一杯卡布奇诺。", pinyin: "Wǒ yào yì bēi kǎbùqínuò.", ko: "카푸치노 한 잔 주세요.", en: "I'll have a cappuccino." },
        next: "size",
      },
      {
        id: "milktea2",
        line: { zh: "我要一杯奶茶。", pinyin: "Wǒ yào yì bēi nǎichá.", ko: "밀크티 한 잔 주세요.", en: "I'll have a milk tea." },
        next: "size",
      },
    ],
  },
  size: {
    id: "size",
    aiLine: {
      zh: "大杯还是中杯?",
      pinyin: "Dà bēi háishì zhōng bēi?",
      ko: "큰 사이즈요, 중간 사이즈요?",
      en: "Large or medium?",
    },
    choices: [
      {
        id: "large",
        line: { zh: "大杯,谢谢。", pinyin: "Dà bēi, xièxie.", ko: "큰 사이즈로 주세요.", en: "Large, please." },
        next: "forhere",
      },
    ],
  },
  forhere: {
    id: "forhere",
    aiLine: {
      zh: "在这里喝还是带走?",
      pinyin: "Zài zhèlǐ hē háishì dàizǒu?",
      ko: "여기서 드세요, 포장하세요?",
      en: "For here or to go?",
    },
    choices: [
      {
        id: "togo",
        line: { zh: "带走。", pinyin: "Dàizǒu.", ko: "포장할게요.", en: "To go." },
        next: "pay",
      },
      {
        id: "here",
        line: { zh: "在这里喝。", pinyin: "Zài zhèlǐ hē.", ko: "여기서 마실게요.", en: "For here." },
        next: "pay",
      },
    ],
  },
  pay: {
    id: "pay",
    aiLine: {
      zh: "一共十八块。",
      pinyin: "Yígòng shíbā kuài.",
      ko: "전부 18위안이에요.",
      en: "That's 18 yuan in total.",
    },
    choices: [
      {
        id: "givemoney",
        line: { zh: "好的,给你。", pinyin: "Hǎo de, gěi nǐ.", ko: "네, 여기 있어요.", en: "Sure, here you go." },
        next: "closing",
      },
    ],
  },
  closing: {
    id: "closing",
    aiLine: {
      zh: "谢谢,请稍等。",
      pinyin: "Xièxie, qǐng shāo děng.",
      ko: "감사합니다, 잠시만요.",
      en: "Thank you, one moment please.",
    },
    choices: [
      {
        id: "thanks",
        line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." },
        next: "end",
      },
    ],
  },
};

interface Message {
  speaker: "ai" | "learner";
  line: Line;
}

const TOTAL_STEPS = 6;

function stepIndex(nodeId: string): number {
  const order = ["start", "menu", "size", "forhere", "pay", "closing", "end"];
  const i = order.indexOf(nodeId);
  return i === -1 ? order.length : i;
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
