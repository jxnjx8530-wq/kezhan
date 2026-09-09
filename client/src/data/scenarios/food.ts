/**
 * 미식채 (Gourmet Wing) — dining scenarios, transcribed from the reviewed
 * final script. See journey.ts for the note on combining consecutive
 * same-speaker turns instead of inventing filler lines.
 */
import { AlertTriangle, Bike, CalendarClock, ClipboardList, Coffee, CookingPot, Flame, IceCreamCone, PackageOpen, Receipt } from "lucide-react";

import { makeStepIndex, type ScenarioData } from "./types";

export const foodScenarios: ScenarioData[] = [
  {
    slug: "cafe-order",
    icon: Coffee,
    ko: { title: "카페에서 음료 주문하기" },
    en: { title: "Ordering a Drink at a Café" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["menu"], ["size"], ["forhere"], ["pay"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "欢迎光临,请问需要点什么?", pinyin: "Huānyíng guānglín, qǐngwèn xūyào diǎn shénme?", ko: "어서 오세요, 뭐 드릴까요?", en: "Welcome, what can I get for you?" },
        choices: [
          { id: "latte", line: { zh: "我要一杯拿铁。", pinyin: "Wǒ yào yì bēi nátiě.", ko: "라떼 한 잔 주세요.", en: "I'll have a latte." }, next: "size" },
          { id: "americano", line: { zh: "我要一杯美式。", pinyin: "Wǒ yào yì bēi měishì.", ko: "아메리카노 한 잔 주세요.", en: "I'll have an Americano." }, next: "size" },
          { id: "cappuccino", line: { zh: "我要一杯卡布奇诺。", pinyin: "Wǒ yào yì bēi kǎbùqínuò.", ko: "카푸치노 한 잔 주세요.", en: "I'll have a cappuccino." }, next: "size" },
          { id: "milktea", line: { zh: "我要一杯奶茶。", pinyin: "Wǒ yào yì bēi nǎichá.", ko: "밀크티 한 잔 주세요.", en: "I'll have a milk tea." }, next: "size" },
          { id: "menu", line: { zh: "我想看一下菜单。", pinyin: "Wǒ xiǎng kàn yíxià càidān.", ko: "메뉴 좀 보여주세요.", en: "Could I see the menu?" }, next: "menu" },
        ],
      },
      menu: {
        id: "menu",
        aiLine: { zh: "好,这是菜单。", pinyin: "Hǎo, zhè shì càidān.", ko: "네, 여기 메뉴예요.", en: "Sure, here's the menu." },
        choices: [
          { id: "latte2", line: { zh: "我要一杯拿铁。", pinyin: "Wǒ yào yì bēi nátiě.", ko: "라떼 한 잔 주세요.", en: "I'll have a latte." }, next: "size" },
          { id: "americano2", line: { zh: "我要一杯美式。", pinyin: "Wǒ yào yì bēi měishì.", ko: "아메리카노 한 잔 주세요.", en: "I'll have an Americano." }, next: "size" },
          { id: "cappuccino2", line: { zh: "我要一杯卡布奇诺。", pinyin: "Wǒ yào yì bēi kǎbùqínuò.", ko: "카푸치노 한 잔 주세요.", en: "I'll have a cappuccino." }, next: "size" },
          { id: "milktea2", line: { zh: "我要一杯奶茶。", pinyin: "Wǒ yào yì bēi nǎichá.", ko: "밀크티 한 잔 주세요.", en: "I'll have a milk tea." }, next: "size" },
        ],
      },
      size: {
        id: "size",
        aiLine: { zh: "大杯还是中杯?", pinyin: "Dà bēi háishì zhōng bēi?", ko: "큰 사이즈요, 중간 사이즈요?", en: "Large or medium?" },
        choices: [{ id: "large", line: { zh: "大杯,谢谢。", pinyin: "Dà bēi, xièxie.", ko: "큰 사이즈로 주세요.", en: "Large, please." }, next: "forhere" }],
      },
      forhere: {
        id: "forhere",
        aiLine: { zh: "在这里喝还是带走?", pinyin: "Zài zhèlǐ hē háishì dàizǒu?", ko: "여기서 드세요, 포장하세요?", en: "For here or to go?" },
        choices: [
          { id: "togo", line: { zh: "带走。", pinyin: "Dàizǒu.", ko: "포장할게요.", en: "To go." }, next: "pay" },
          { id: "here", line: { zh: "在这里喝。", pinyin: "Zài zhèlǐ hē.", ko: "여기서 마실게요.", en: "For here." }, next: "pay" },
        ],
      },
      pay: {
        id: "pay",
        aiLine: { zh: "一共十八块。", pinyin: "Yígòng shíbā kuài.", ko: "전부 18위안이에요.", en: "That's 18 yuan in total." },
        choices: [{ id: "givemoney", line: { zh: "好的,给你。", pinyin: "Hǎo de, gěi nǐ.", ko: "네, 여기 있어요.", en: "Sure, here you go." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "谢谢,请稍等。", pinyin: "Xièxie, qǐng shāo děng.", ko: "감사합니다, 잠시만요.", en: "Thank you, one moment please." },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "restaurant-reservation",
    icon: CalendarClock,
    ko: { title: "식당 예약하기" },
    en: { title: "Booking a Restaurant Table" },
    totalSteps: 8,
    stepIndex: makeStepIndex([["start"], ["peopleQ"], ["timeQ"], ["confirmed"], ["specialOk"], ["changeTime"], ["changed"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: {
          zh: "您好,这里是餐厅,请问有什么需要?",
          pinyin: "Nín hǎo, zhè lǐ shì cāntīng, qǐngwèn yǒu shénme xūyào?",
          ko: "안녕하세요, 식당입니다, 무엇을 도와드릴까요?",
          en: "Hello, this is the restaurant — how can I help you?",
        },
        choices: [
          {
            id: "book",
            line: {
              zh: "你好,我想预订一个位子,朋友要过生日。",
              pinyin: "Nǐ hǎo, wǒ xiǎng yùdìng yí ge wèizi, péngyou yào guò shēngrì.",
              ko: "안녕하세요, 자리 예약하고 싶어요, 친구가 생일이라서요.",
              en: "Hi, I'd like to book a table — it's for a friend's birthday.",
            },
            next: "peopleQ",
          },
        ],
      },
      peopleQ: {
        id: "peopleQ",
        aiLine: { zh: "好的,一共几位?", pinyin: "Hǎo de, yígòng jǐ wèi?", ko: "네, 전부 몇 분이세요?", en: "Sure, how many people in total?" },
        choices: [
          { id: "five", line: { zh: "五位。", pinyin: "Wǔ wèi.", ko: "다섯 명이요.", en: "Five people." }, next: "timeQ" },
          { id: "three", line: { zh: "三位。", pinyin: "Sān wèi.", ko: "세 명이요.", en: "Three people." }, next: "timeQ" },
        ],
      },
      timeQ: {
        id: "timeQ",
        aiLine: { zh: "预订几点的?", pinyin: "Yùdìng jǐ diǎn de?", ko: "몇 시로 예약해 드릴까요?", en: "What time would you like the booking for?" },
        choices: [
          {
            id: "seven",
            line: { zh: "今天晚上七点。", pinyin: "Jīntiān wǎnshang qī diǎn.", ko: "오늘 저녁 7시요.", en: "7 p.m. tonight." },
            next: "confirmed",
          },
        ],
      },
      confirmed: {
        id: "confirmed",
        aiLine: {
          zh: "好的,已经帮您预订好了。有什么特别需要吗?",
          pinyin: "Hǎo de, yǐjīng bāng nín yùdìng hǎo le. Yǒu shénme tèbié xūyào ma?",
          ko: "네, 예약 도와드렸어요. 특별히 필요한 게 있으세요?",
          en: "Great, your table is booked. Any special requests?",
        },
        choices: [
          {
            id: "window",
            line: { zh: "可以订靠窗的位子吗?", pinyin: "Kěyǐ dìng kào chuāng de wèizi ma?", ko: "창가 자리 가능할까요?", en: "Could I get a table by the window?" },
            next: "specialOk",
          },
          {
            id: "cake",
            line: { zh: "可以准备一个蛋糕吗?", pinyin: "Kěyǐ zhǔnbèi yí ge dàngāo ma?", ko: "케이크 준비해 주실 수 있어요?", en: "Could you prepare a cake?" },
            next: "specialOk",
          },
        ],
      },
      specialOk: {
        id: "specialOk",
        aiLine: { zh: "可以,没问题。", pinyin: "Kěyǐ, méi wèntí.", ko: "네, 가능해요.", en: "Sure, no problem." },
        choices: [
          {
            id: "changePlease",
            line: { zh: "不好意思,我想把时间改一下。", pinyin: "Bù hǎoyìsi, wǒ xiǎng bǎ shíjiān gǎi yíxià.", ko: "죄송한데, 시간을 좀 바꾸고 싶어요.", en: "Sorry, I'd like to change the time." },
            next: "changeTime",
          },
        ],
      },
      changeTime: {
        id: "changeTime",
        aiLine: { zh: "好的,您要改到几点?", pinyin: "Hǎo de, nín yào gǎi dào jǐ diǎn?", ko: "네, 몇 시로 바꾸고 싶으세요?", en: "Sure, what time would you like instead?" },
        choices: [
          { id: "eight", line: { zh: "八点。", pinyin: "Bā diǎn.", ko: "8시요.", en: "8 o'clock." }, next: "changed" },
          { id: "sixthirty", line: { zh: "六点半。", pinyin: "Liù diǎn bàn.", ko: "6시 반이요.", en: "6:30." }, next: "changed" },
        ],
      },
      changed: {
        id: "changed",
        aiLine: {
          zh: "好的,已经帮您改好时间了。",
          pinyin: "Hǎo de, yǐjīng bāng nín gǎi hǎo shíjiān le.",
          ko: "네, 시간 바꿔드렸어요.",
          en: "Done, I've updated the time for you.",
        },
        choices: [
          { id: "settled", line: { zh: "谢谢,那就这样定了。", pinyin: "Xièxie, nà jiù zhèyàng dìng le.", ko: "감사합니다, 그럼 그렇게 할게요.", en: "Thanks, let's go with that." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好的,八点见。", pinyin: "Hǎo de, bā diǎn jiàn.", ko: "네, 8시에 뵐게요.", en: "Great, see you at 8." },
        choices: [],
      },
    },
  },
  {
    slug: "restaurant-order",
    icon: ClipboardList,
    ko: { title: "식당에서 메뉴 주문하기" },
    en: { title: "Ordering Food at a Restaurant" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["more"], ["wait"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "您好,您想吃点什么?", pinyin: "Nín hǎo, nín xiǎng chī diǎn shénme?", ko: "안녕하세요, 뭐 드시겠어요?", en: "Hello, what would you like to eat?" },
        choices: [
          { id: "dish", line: { zh: "我要一份宫保鸡丁。", pinyin: "Wǒ yào yí fèn Gōngbǎo jīdīng.", ko: "궁바오지딩 하나 주세요.", en: "I'll have the Kung Pao chicken." }, next: "more" },
        ],
      },
      more: {
        id: "more",
        aiLine: { zh: "还要别的吗?", pinyin: "Hái yào bié de ma?", ko: "더 필요한 거 있으세요?", en: "Anything else?" },
        choices: [
          { id: "rice", line: { zh: "再来一碗米饭。", pinyin: "Zài lái yì wǎn mǐfàn.", ko: "밥 한 그릇 더요.", en: "One more bowl of rice." }, next: "wait" },
          { id: "nothanks", line: { zh: "不用了,谢谢。", pinyin: "Búyòng le, xièxie.", ko: "괜찮아요, 감사합니다.", en: "That's all, thanks." }, next: "wait" },
        ],
      },
      wait: {
        id: "wait",
        aiLine: { zh: "好的,请稍等。", pinyin: "Hǎo de, qǐng shāo děng.", ko: "네, 잠시만 기다려주세요.", en: "Sure, please wait a moment." },
        choices: [{ id: "ok", line: { zh: "好,谢谢。", pinyin: "Hǎo, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "菜马上就好。", pinyin: "Cài mǎshàng jiù hǎo.", ko: "음식 곧 나와요.", en: "Your food will be right out." },
        choices: [{ id: "ok2", line: { zh: "好的。", pinyin: "Hǎo de.", ko: "네.", en: "Great." }, next: "end" }],
      },
    },
  },
  {
    slug: "spice-level",
    icon: Flame,
    ko: { title: "맵기·간 조절 요청하기" },
    en: { title: "Asking to Adjust Spice Level & Seasoning" },
    totalSteps: 3,
    stepIndex: makeStepIndex([["start"], ["saltAns"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: {
          zh: "辣度可以选择,您要选几分辣?",
          pinyin: "Là dù kěyǐ xuǎnzé, nín yào xuǎn jǐ fēn là?",
          ko: "맵기 선택 가능한데, 얼마나 맵게 드릴까요?",
          en: "You can choose the spice level — how spicy would you like it?",
        },
        choices: [
          {
            id: "mild",
            line: {
              zh: "不要辣,可以少放点糖吗?",
              pinyin: "Bú yào là, kěyǐ shǎo fàng diǎn táng ma?",
              ko: "안 맵게요, 설탕은 좀 적게 넣어주실 수 있어요?",
              en: "Not spicy — and could you go easy on the sugar?",
            },
            next: "saltAns",
          },
          {
            id: "little",
            line: {
              zh: "微辣就好,可以少放点糖吗?",
              pinyin: "Wēi là jiù hǎo, kěyǐ shǎo fàng diǎn táng ma?",
              ko: "살짝 맵게요, 설탕은 좀 적게 넣어주실 수 있어요?",
              en: "Just a little spicy — and could you go easy on the sugar?",
            },
            next: "saltAns",
          },
        ],
      },
      saltAns: {
        id: "saltAns",
        aiLine: {
          zh: "可以。盐也会少放一点。",
          pinyin: "Kěyǐ. Yán yě huì shǎo fàng yìdiǎn.",
          ko: "그럼요. 소금도 좀 덜 넣을게요.",
          en: "Sure. We'll go a little light on the salt too.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好,我记下了。", pinyin: "Hǎo, wǒ jì xià le.", ko: "네, 적어놨어요.", en: "Got it, I've noted that down." },
        choices: [{ id: "thanks2", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Great, thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "allergy-check",
    icon: AlertTriangle,
    ko: { title: "알레르기 있는 재료 물어보기" },
    en: { title: "Asking About Allergens in a Dish" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["confirm"], ["kitchen"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "ask",
            line: { zh: "请问这道菜里有花生吗?", pinyin: "Qǐngwèn zhè dào cài lǐ yǒu huāshēng ma?", ko: "이 요리에 땅콩 들어가나요?", en: "Does this dish have peanuts in it?" },
            next: "confirm",
          },
        ],
      },
      confirm: {
        id: "confirm",
        aiLine: {
          zh: "有一点,您对花生过敏吗?",
          pinyin: "Yǒu yìdiǎn, nín duì huāshēng guòmǐn ma?",
          ko: "조금 들어가요, 땅콩 알레르기 있으세요?",
          en: "A little — are you allergic to peanuts?",
        },
        choices: [
          { id: "yes", line: { zh: "是的,可以不放吗?", pinyin: "Shì de, kěyǐ bú fàng ma?", ko: "네, 빼주실 수 있어요?", en: "Yes, could you leave them out?" }, next: "kitchen" },
        ],
      },
      kitchen: {
        id: "kitchen",
        aiLine: { zh: "可以,我跟厨房说一下。", pinyin: "Kěyǐ, wǒ gēn chúfáng shuō yíxià.", ko: "네, 주방에 말씀드릴게요.", en: "Sure, I'll let the kitchen know." },
        choices: [
          { id: "thanks", line: { zh: "太谢谢您了。", pinyin: "Tài xièxie nín le.", ko: "정말 감사합니다.", en: "Thank you so much." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "应该的。菜会尽快上。",
          pinyin: "Yīnggāi de. Cài huì jǐnkuài shàng.",
          ko: "당연한 거예요. 음식 최대한 빨리 내드릴게요.",
          en: "Of course. We'll get your food out as quickly as we can.",
        },
        choices: [{ id: "ok", line: { zh: "好,谢谢。", pinyin: "Hǎo, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "bill-payment",
    icon: Receipt,
    ko: { title: "계산서 요청하고 결제하기" },
    en: { title: "Asking for the Bill and Paying" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["total"], ["payOk"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "bill", line: { zh: "服务员,买单。", pinyin: "Fúwùyuán, mǎidān.", ko: "저기요, 계산할게요.", en: "Excuse me, could I get the bill?" }, next: "total" }],
      },
      total: {
        id: "total",
        aiLine: {
          zh: "好的,一共一百二十块。需要开发票吗?",
          pinyin: "Hǎo de, yígòng yìbǎi èrshí kuài. Xūyào kāi fāpiào ma?",
          ko: "네, 전부 120위안이에요. 영수증 필요하세요?",
          en: "Sure, that's 120 yuan in total. Would you like a receipt?",
        },
        choices: [
          {
            id: "card",
            line: { zh: "不用,谢谢。可以刷卡吗?", pinyin: "Búyòng, xièxie. Kěyǐ shuākǎ ma?", ko: "아니요, 괜찮아요. 카드 되나요?", en: "No thanks, that's fine. Can I pay by card?" },
            next: "payOk",
          },
          {
            id: "qr",
            line: { zh: "不用,谢谢。可以扫码支付吗?", pinyin: "Búyòng, xièxie. Kěyǐ sǎomǎ zhīfù ma?", ko: "아니요, 괜찮아요. QR코드 결제 되나요?", en: "No thanks, that's fine. Can I pay by QR code?" },
            next: "payOk",
          },
        ],
      },
      payOk: {
        id: "payOk",
        aiLine: { zh: "可以。", pinyin: "Kěyǐ.", ko: "그럼요.", en: "Sure." },
        choices: [
          { id: "tasty", line: { zh: "谢谢,菜很好吃。", pinyin: "Xièxie, cài hěn hǎochī.", ko: "감사합니다, 음식 맛있었어요.", en: "Thanks, the food was delicious." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "谢谢光临,欢迎再来。",
          pinyin: "Xièxie guānglín, huānyíng zài lái.",
          ko: "와주셔서 감사합니다, 또 오세요.",
          en: "Thank you for coming, please come again.",
        },
        choices: [],
      },
    },
  },
  {
    slug: "takeout-order",
    icon: PackageOpen,
    ko: { title: "테이크아웃 주문하기" },
    en: { title: "Ordering Food to Go" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["order"], ["wait"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "togo", line: { zh: "你好,我要打包。", pinyin: "Nǐ hǎo, wǒ yào dǎbāo.", ko: "안녕하세요, 포장해 주세요.", en: "Hi, I'd like to order to go." }, next: "order" }],
      },
      order: {
        id: "order",
        aiLine: { zh: "好的,您要点什么?", pinyin: "Hǎo de, nín yào diǎn shénme?", ko: "네, 뭐 주문하시겠어요?", en: "Sure, what would you like?" },
        choices: [{ id: "friedrice", line: { zh: "我要一份炒饭。", pinyin: "Wǒ yào yí fèn chǎofàn.", ko: "볶음밥 하나 주세요.", en: "I'll have one fried rice." }, next: "wait" }],
      },
      wait: {
        id: "wait",
        aiLine: { zh: "好,您要等十分钟左右。", pinyin: "Hǎo, nín yào děng shí fēnzhōng zuǒyòu.", ko: "네, 10분 정도 기다리셔야 해요.", en: "Sure, it'll take about 10 minutes." },
        choices: [
          {
            id: "chopsticks",
            line: { zh: "可以给我一双筷子吗?", pinyin: "Kěyǐ gěi wǒ yì shuāng kuàizi ma?", ko: "젓가락 하나 주실 수 있어요?", en: "Could I get a pair of chopsticks?" },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "可以。好了,您的炒饭。",
          pinyin: "Kěyǐ. Hǎo le, nín de chǎofàn.",
          ko: "그럼요. 다 됐어요, 볶음밥 나왔습니다.",
          en: "Sure. Here you go, your fried rice.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "delivery-order",
    icon: Bike,
    ko: { title: "배달 음식 주문하기" },
    en: { title: "Ordering Food Delivery" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["order"], ["address"], ["eta"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "delivery", line: { zh: "你好,我想点外卖。", pinyin: "Nǐ hǎo, wǒ xiǎng diǎn wàimài.", ko: "안녕하세요, 배달 주문하고 싶어요.", en: "Hi, I'd like to order delivery." }, next: "order" },
        ],
      },
      order: {
        id: "order",
        aiLine: { zh: "好的,您要点什么?", pinyin: "Hǎo de, nín yào diǎn shénme?", ko: "네, 뭐 주문하시겠어요?", en: "Sure, what would you like?" },
        choices: [
          {
            id: "dishes",
            line: { zh: "一份麻婆豆腐,一碗米饭。", pinyin: "Yí fèn mápó dòufu, yì wǎn mǐfàn.", ko: "마파두부 하나, 밥 한 그릇이요.", en: "One mapo tofu, one bowl of rice." },
            next: "address",
          },
        ],
      },
      address: {
        id: "address",
        aiLine: { zh: "好,请问送到哪里?", pinyin: "Hǎo, qǐngwèn sòng dào nǎlǐ?", ko: "네, 어디로 배달해 드릴까요?", en: "Got it, where should we deliver it?" },
        choices: [
          {
            id: "location",
            line: {
              zh: "送到阳光小区三号楼。",
              pinyin: "Sòng dào Yángguāng Xiǎoqū sān hào lóu.",
              ko: "양광 단지 3동으로 보내주세요.",
              en: "Building 3, Yangguang Residential Complex.",
            },
            next: "eta",
          },
        ],
      },
      eta: {
        id: "eta",
        aiLine: {
          zh: "好的,大概四十分钟以后能送到。",
          pinyin: "Hǎo de, dàgài sìshí fēnzhōng yǐhòu néng sòngdào.",
          ko: "네, 대략 40분 뒤에 도착해요.",
          en: "Got it, it'll arrive in about 40 minutes.",
        },
        choices: [{ id: "ok", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Great, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "不客气,祝您用餐愉快。",
          pinyin: "Bú kèqi, zhù nín yòngcān yúkuài.",
          ko: "아니에요, 맛있게 드세요.",
          en: "You're welcome, enjoy your meal.",
        },
        choices: [],
      },
    },
  },
  {
    slug: "street-food",
    icon: CookingPot,
    ko: { title: "길거리 음식 사 먹기" },
    en: { title: "Buying Street Food" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["price"], ["spicy"], ["give"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "ask", line: { zh: "老板,这个多少钱?", pinyin: "Lǎobǎn, zhège duōshao qián?", ko: "사장님, 이거 얼마예요?", en: "How much is this?" }, next: "price" }],
      },
      price: {
        id: "price",
        aiLine: { zh: "十块钱一串。", pinyin: "Shí kuài qián yí chuàn.", ko: "한 꼬치에 10위안이에요.", en: "10 yuan a skewer." },
        choices: [
          { id: "two", line: { zh: "我要两串。", pinyin: "Wǒ yào liǎng chuàn.", ko: "두 개 주세요.", en: "I'll take two." }, next: "spicy" },
          { id: "one", line: { zh: "要一份就够了。", pinyin: "Yào yí fèn jiù gòu le.", ko: "한 개면 충분해요.", en: "One is enough." }, next: "spicy" },
        ],
      },
      spicy: {
        id: "spicy",
        aiLine: { zh: "要辣的还是不辣的?", pinyin: "Yào là de háishì bú là de?", ko: "매운 걸로 드릴까요, 안 매운 걸로 드릴까요?", en: "Spicy or not spicy?" },
        choices: [{ id: "notspicy", line: { zh: "不辣的,谢谢。", pinyin: "Bú là de, xièxie.", ko: "안 매운 걸로요, 감사합니다.", en: "Not spicy, thanks." }, next: "give" }],
      },
      give: {
        id: "give",
        aiLine: { zh: "好嘞,给你。", pinyin: "Hǎo lei, gěi nǐ.", ko: "네, 여기 있어요.", en: "Here you go." },
        choices: [
          {
            id: "looksgood",
            line: { zh: "谢谢,看起来真好吃。", pinyin: "Xièxie, kànqǐlái zhēn hǎochī.", ko: "감사합니다, 맛있어 보이네요.", en: "Thanks, this looks delicious." },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "请慢用。", pinyin: "Qǐng màn yòng.", ko: "맛있게 드세요.", en: "Enjoy!" },
        choices: [],
      },
    },
  },
  {
    slug: "dessert-order",
    icon: IceCreamCone,
    ko: { title: "후식·디저트 추가 주문하기" },
    en: { title: "Ordering Dessert" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["recommend"], ["more"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "需要来点甜点吗?", pinyin: "Xūyào lái diǎn tiándiǎn ma?", ko: "디저트 좀 드릴까요?", en: "Would you like some dessert?" },
        choices: [
          {
            id: "sure",
            line: { zh: "好啊,有什么推荐的吗?", pinyin: "Hǎo a, yǒu shénme tuījiàn de ma?", ko: "좋아요, 추천해 주실 만한 거 있어요?", en: "Sure, anything you'd recommend?" },
            next: "recommend",
          },
        ],
      },
      recommend: {
        id: "recommend",
        aiLine: {
          zh: "芒果布丁很受欢迎。",
          pinyin: "Mángguǒ bùdīng hěn shòu huānyíng.",
          ko: "망고 푸딩이 인기 많아요.",
          en: "The mango pudding is very popular.",
        },
        choices: [
          { id: "takeit", line: { zh: "那我要一份。", pinyin: "Nà wǒ yào yí fèn.", ko: "그럼 하나 주세요.", en: "I'll have that, then." }, next: "more" },
          { id: "other", line: { zh: "有别的推荐的吗?", pinyin: "Yǒu bié de tuījiàn de ma?", ko: "다른 추천 메뉴도 있어요?", en: "Anything else you'd recommend?" }, next: "more" },
        ],
      },
      more: {
        id: "more",
        aiLine: { zh: "好,还需要别的吗?", pinyin: "Hǎo, hái xūyào bié de ma?", ko: "네, 더 필요한 거 있으세요?", en: "Sure, anything else?" },
        choices: [{ id: "nothanks", line: { zh: "不用了,谢谢。", pinyin: "Búyòng le, xièxie.", ko: "괜찮아요, 감사합니다.", en: "That's all, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好的,马上给您上。", pinyin: "Hǎo de, mǎshàng gěi nín shàng.", ko: "네, 바로 갖다 드릴게요.", en: "Great, I'll bring it right out." },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
    },
  },
];
