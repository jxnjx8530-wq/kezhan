/**
 * Shared script for the cafe-order practice prototypes (click-to-select and
 * type-to-answer variants), so both interaction styles stay in sync with the
 * same reviewed MVP dialogue.
 */
export interface Line {
  zh: string;
  pinyin: string;
  ko: string;
  en: string;
}

export interface Choice {
  id: string;
  line: Line;
  next: string;
}

export interface DialogueNode {
  id: string;
  aiLine: Line;
  choices: Choice[];
}

export const cafeOrderDialogue: Record<string, DialogueNode> = {
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

export const CAFE_ORDER_TOTAL_STEPS = 6;

export function cafeOrderStepIndex(nodeId: string): number {
  const order = ["start", "menu", "size", "forhere", "pay", "closing", "end"];
  const i = order.indexOf(nodeId);
  return i === -1 ? order.length : i;
}
