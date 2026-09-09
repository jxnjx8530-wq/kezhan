/**
 * 상점채 (Market Wing) — shopping scenarios, transcribed from the reviewed
 * final script. See journey.ts for the note on combining consecutive
 * same-speaker turns instead of inventing filler lines.
 */
import { Gift, HandCoins, Receipt, ShoppingBag, Shirt, Star, Store, Truck, Undo2, UserCheck } from "lucide-react";

import { makeStepIndex, type ScenarioData } from "./types";

export const marketScenarios: ScenarioData[] = [
  {
    slug: "clothing-size",
    icon: Shirt,
    ko: { title: "옷 가게에서 사이즈 물어보기" },
    en: { title: "Asking About Sizes at a Clothing Store" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["wait"], ["given"], ["colorAns", "priceAns"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "您好,请问需要什么帮助?", pinyin: "Nín hǎo, qǐngwèn xūyào shénme bāngzhù?", ko: "안녕하세요, 뭐 도와드릴까요?", en: "Hello, how can I help you?" },
        choices: [
          {
            id: "ask",
            line: {
              zh: "我想问一下这件衣服有没有M码。",
              pinyin: "Wǒ xiǎng wèn yíxià zhè jiàn yīfu yǒu méiyǒu M mǎ.",
              ko: "이 옷 M사이즈 있는지 물어보고 싶어요.",
              en: "I wanted to ask if this comes in a size M.",
            },
            next: "wait",
          },
        ],
      },
      wait: {
        id: "wait",
        aiLine: { zh: "有,请稍等。", pinyin: "Yǒu, qǐng shāo děng.", ko: "네, 잠시만요.", en: "Yes, one moment please." },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "given" }],
      },
      given: {
        id: "given",
        aiLine: { zh: "给您,这是M码。", pinyin: "Gěi nín, zhè shì M mǎ.", ko: "여기요, M사이즈예요.", en: "Here you go, this is a size M." },
        choices: [
          { id: "color", line: { zh: "还有别的颜色吗?", pinyin: "Hái yǒu bié de yánsè ma?", ko: "다른 색상도 있어요?", en: "Does it come in other colors?" }, next: "colorAns" },
          { id: "price", line: { zh: "这件多少钱?", pinyin: "Zhè jiàn duōshao qián?", ko: "이거 얼마예요?", en: "How much is this?" }, next: "priceAns" },
        ],
      },
      colorAns: {
        id: "colorAns",
        aiLine: { zh: "有,还有黑色和白色。", pinyin: "Yǒu, hái yǒu hēisè hé báisè.", ko: "네, 검정색이랑 흰색도 있어요.", en: "Yes, we also have it in black and white." },
        choices: [{ id: "trying", line: { zh: "谢谢,我先试试看。", pinyin: "Xièxie, wǒ xiān shìshi kàn.", ko: "감사합니다, 일단 입어볼게요.", en: "Thanks, I'll try it on first." }, next: "closing" }],
      },
      priceAns: {
        id: "priceAns",
        aiLine: { zh: "这件是一百五十块。", pinyin: "Zhè jiàn shì yìbǎi wǔshí kuài.", ko: "이거 150위안이에요.", en: "This one is 150 yuan." },
        choices: [{ id: "trying", line: { zh: "谢谢,我先试试看。", pinyin: "Xièxie, wǒ xiān shìshi kàn.", ko: "감사합니다, 일단 입어볼게요.", en: "Thanks, I'll try it on first." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好的,试衣间在那边。", pinyin: "Hǎo de, shìyījiān zài nàbiān.", ko: "네, 탈의실은 저쪽이에요.", en: "Sure, the fitting room is over there." },
        choices: [],
      },
    },
  },
  {
    slug: "try-on-clothes",
    icon: UserCheck,
    ko: { title: "옷 입어보기 요청하기" },
    en: { title: "Asking to Try On Clothes" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["allowed"], ["fitQ"], ["fitAnsA", "fitAnsB"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "ask", line: { zh: "我可以试穿一下吗?", pinyin: "Wǒ kěyǐ shìchuān yíxià ma?", ko: "이거 입어봐도 될까요?", en: "Could I try this on?" }, next: "allowed" }],
      },
      allowed: {
        id: "allowed",
        aiLine: {
          zh: "当然可以,试衣间在那边。",
          pinyin: "Dāngrán kěyǐ, shìyījiān zài nàbiān.",
          ko: "그럼요, 탈의실은 저쪽이에요.",
          en: "Of course, the fitting room is over there.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "fitQ" }],
      },
      fitQ: {
        id: "fitQ",
        aiLine: { zh: "大小合适吗?", pinyin: "Dàxiǎo héshì ma?", ko: "사이즈 맞으세요?", en: "Does it fit all right?" },
        choices: [
          { id: "perfect", line: { zh: "挺合适的。", pinyin: "Tǐng héshì de.", ko: "딱 맞아요.", en: "It fits perfectly." }, next: "fitAnsA" },
          { id: "big", line: { zh: "有点大。", pinyin: "Yǒudiǎn dà.", ko: "조금 커요.", en: "It's a bit big." }, next: "fitAnsB" },
        ],
      },
      fitAnsA: {
        id: "fitAnsA",
        aiLine: { zh: "太好了,很适合您。", pinyin: "Tài hǎo le, hěn shìhé nín.", ko: "잘됐네요, 정말 잘 어울리세요.", en: "Wonderful, it really suits you." },
        choices: [{ id: "thanks2", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "closing" }],
      },
      fitAnsB: {
        id: "fitAnsB",
        aiLine: { zh: "那我给您换小一号的。", pinyin: "Nà wǒ gěi nín huàn xiǎo yí hào de.", ko: "그럼 한 사이즈 작은 걸로 바꿔드릴게요.", en: "Then let me get you a size smaller." },
        choices: [{ id: "thanks2", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "不客气,请慢慢挑。", pinyin: "Bú kèqi, qǐng mànmàn tiāo.", ko: "아니에요, 천천히 골라보세요.", en: "You're welcome, take your time looking around." },
        choices: [],
      },
    },
  },
  {
    slug: "haggling",
    icon: HandCoins,
    ko: { title: "가격 흥정하기" },
    en: { title: "Haggling Over Price" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["price"], ["noBudge"], ["dealA", "dealB"], ["give"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "ask", line: { zh: "老板,这个多少钱?", pinyin: "Lǎobǎn, zhège duōshao qián?", ko: "사장님, 이거 얼마예요?", en: "How much is this?" }, next: "price" }],
      },
      price: {
        id: "price",
        aiLine: { zh: "这个四十块。", pinyin: "Zhège sìshí kuài.", ko: "이거 40위안이에요.", en: "This one's 40 yuan." },
        choices: [
          {
            id: "cheaper",
            line: { zh: "老板,这个可以便宜一点吗?", pinyin: "Lǎobǎn, zhège kěyǐ piányi yìdiǎn ma?", ko: "사장님, 이거 좀 싸게 해주실 수 있어요?", en: "Could you give me a bit of a discount on this?" },
            next: "noBudge",
          },
        ],
      },
      noBudge: {
        id: "noBudge",
        aiLine: { zh: "这个已经很便宜了。", pinyin: "Zhège yǐjīng hěn piányi le.", ko: "이거 이미 많이 싼 거예요.", en: "This is already very cheap." },
        choices: [
          { id: "thirty", line: { zh: "那三十块可以吗?", pinyin: "Nà sānshí kuài kěyǐ ma?", ko: "그럼 30위안 되나요?", en: "Would 30 yuan work, then?" }, next: "dealA" },
          { id: "two", line: { zh: "我买两个,便宜点吧。", pinyin: "Wǒ mǎi liǎng ge, piányi diǎn ba.", ko: "두 개 살 테니 좀 깎아주세요.", en: "I'll buy two, so give me a discount." }, next: "dealB" },
        ],
      },
      dealA: {
        id: "dealA",
        aiLine: {
          zh: "好吧,给你便宜五块,三十五块。",
          pinyin: "Hǎo ba, gěi nǐ piányi wǔ kuài, sānshíwǔ kuài.",
          ko: "알겠어요, 5위안 깎아서 35위안에 드릴게요.",
          en: "All right, I'll knock off 5 yuan — 35 yuan.",
        },
        choices: [{ id: "deal", line: { zh: "谢谢老板,那就这样吧。", pinyin: "Xièxie lǎobǎn, nà jiù zhèyàng ba.", ko: "감사합니다 사장님, 그럼 그렇게 할게요.", en: "Thanks, let's do that then." }, next: "give" }],
      },
      dealB: {
        id: "dealB",
        aiLine: {
          zh: "好吧,两个一共给你算七十块。",
          pinyin: "Hǎo ba, liǎng ge yígòng gěi nǐ suàn qīshí kuài.",
          ko: "알겠어요, 두 개 합쳐서 70위안에 드릴게요.",
          en: "All right, 70 yuan for both together.",
        },
        choices: [{ id: "deal", line: { zh: "谢谢老板,那就这样吧。", pinyin: "Xièxie lǎobǎn, nà jiù zhèyàng ba.", ko: "감사합니다 사장님, 그럼 그렇게 할게요.", en: "Thanks, let's do that then." }, next: "give" }],
      },
      give: {
        id: "give",
        aiLine: { zh: "好嘞,给你。", pinyin: "Hǎo lei, gěi nǐ.", ko: "네, 여기요.", en: "Here you go." },
        choices: [{ id: "pay", line: { zh: "好,给你钱。", pinyin: "Hǎo, gěi nǐ qián.", ko: "네, 여기 돈이요.", en: "Okay, here's your money." }, next: "end" }],
      },
    },
  },
  {
    slug: "receipt-payment",
    icon: Receipt,
    ko: { title: "계산하고 영수증 받기" },
    en: { title: "Paying and Getting a Receipt" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["anythingElse"], ["total"], ["payQ"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "buy", line: { zh: "我要买这两件。", pinyin: "Wǒ yào mǎi zhè liǎng jiàn.", ko: "이 두 개 살게요.", en: "I'll take these two." }, next: "anythingElse" }],
      },
      anythingElse: {
        id: "anythingElse",
        aiLine: {
          zh: "好的,请问还需要别的吗?",
          pinyin: "Hǎo de, qǐngwèn hái xūyào bié de ma?",
          ko: "네, 더 필요한 거 있으세요?",
          en: "Sure, anything else you need?",
        },
        choices: [{ id: "no", line: { zh: "不用了,谢谢。", pinyin: "Búyòng le, xièxie.", ko: "괜찮아요, 감사합니다.", en: "That's all, thanks." }, next: "total" }],
      },
      total: {
        id: "total",
        aiLine: { zh: "一共八十五块。", pinyin: "Yígòng bāshíwǔ kuài.", ko: "전부 85위안이에요.", en: "That's 85 yuan in total." },
        choices: [{ id: "receipt", line: { zh: "可以开发票吗?", pinyin: "Kěyǐ kāi fāpiào ma?", ko: "영수증 될까요?", en: "Could I get a receipt?" }, next: "payQ" }],
      },
      payQ: {
        id: "payQ",
        aiLine: { zh: "可以,请稍等。", pinyin: "Kěyǐ, qǐng shāo děng.", ko: "네, 잠시만요.", en: "Sure, one moment please." },
        choices: [
          { id: "card", line: { zh: "可以刷卡吗?", pinyin: "Kěyǐ shuākǎ ma?", ko: "카드 되나요?", en: "Can I pay by card?" }, next: "closing" },
          { id: "qr", line: { zh: "可以扫码支付吗?", pinyin: "Kěyǐ sǎomǎ zhīfù ma?", ko: "QR코드 결제 되나요?", en: "Can I pay by QR code?" }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "可以,没问题。这是您的发票,谢谢光临。",
          pinyin: "Kěyǐ, méi wèntí. Zhè shì nín de fāpiào, xièxie guānglín.",
          ko: "네, 가능해요. 여기 영수증이요, 감사합니다.",
          en: "Sure, no problem. Here's your receipt, thank you for shopping with us.",
        },
        choices: [{ id: "bye", line: { zh: "谢谢,再见。", pinyin: "Xièxie, zàijiàn.", ko: "감사합니다, 안녕히 계세요.", en: "Thank you, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "refund-exchange",
    icon: Undo2,
    ko: { title: "환불·교환 요청하기" },
    en: { title: "Requesting a Refund or Exchange" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["whyQ"], ["receiptQ"], ["refundOrExchangeQ"], ["refundAns", "exchangeAns"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "return", line: { zh: "你好,这件衣服我要退了。", pinyin: "Nǐ hǎo, zhè jiàn yīfu wǒ yào tuì le.", ko: "안녕하세요, 이 옷 환불하려고요.", en: "Hi, I'd like to return this." }, next: "whyQ" },
        ],
      },
      whyQ: {
        id: "whyQ",
        aiLine: { zh: "您为什么要退呢?", pinyin: "Nín wèishénme yào tuì ne?", ko: "왜 환불하려고 하세요?", en: "May I ask why you're returning it?" },
        choices: [
          { id: "size", line: { zh: "尺寸不合适。", pinyin: "Chǐcùn bù héshì.", ko: "사이즈가 안 맞아요.", en: "The size doesn't fit." }, next: "receiptQ" },
          { id: "color", line: { zh: "颜色和图片不一样。", pinyin: "Yánsè hé túpiàn bù yíyàng.", ko: "색깔이 사진이랑 달라요.", en: "The color is different from the picture." }, next: "receiptQ" },
        ],
      },
      receiptQ: {
        id: "receiptQ",
        aiLine: { zh: "好的,您有购物小票吗?", pinyin: "Hǎo de, nín yǒu gòuwù xiǎopiào ma?", ko: "네, 영수증 있으세요?", en: "Sure, do you have the receipt?" },
        choices: [{ id: "here", line: { zh: "有,给你。", pinyin: "Yǒu, gěi nǐ.", ko: "네, 여기요.", en: "Yes, here you go." }, next: "refundOrExchangeQ" }],
      },
      refundOrExchangeQ: {
        id: "refundOrExchangeQ",
        aiLine: {
          zh: "好,请问您要退款还是换衣服?",
          pinyin: "Hǎo, qǐngwèn nín yào tuìkuǎn háishì huàn yīfu?",
          ko: "네, 환불 원하세요, 교환 원하세요?",
          en: "Got it — would you like a refund or an exchange?",
        },
        choices: [
          { id: "refund", line: { zh: "我想退款。", pinyin: "Wǒ xiǎng tuìkuǎn.", ko: "환불하고 싶어요.", en: "I'd like a refund." }, next: "refundAns" },
          { id: "exchange", line: { zh: "我想换一件大一号的。", pinyin: "Wǒ xiǎng huàn yí jiàn dà yí hào de.", ko: "한 사이즈 큰 걸로 교환하고 싶어요.", en: "I'd like to exchange it for a size larger." }, next: "exchangeAns" },
        ],
      },
      refundAns: {
        id: "refundAns",
        aiLine: {
          zh: "好的,退款的话,会退回到您支付的卡里。",
          pinyin: "Hǎo de, tuìkuǎn dehuà, huì tuìhuí dào nín zhīfù de kǎ lǐ.",
          ko: "네, 환불하시면 결제하신 카드로 돌아갈 거예요.",
          en: "Sure, if you'd like a refund, it'll go back to the card you paid with.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
      exchangeAns: {
        id: "exchangeAns",
        aiLine: {
          zh: "好的,我帮您换一件大一号的。",
          pinyin: "Hǎo de, wǒ bāng nín huàn yí jiàn dà yí hào de.",
          ko: "네, 한 사이즈 큰 걸로 바꿔드릴게요.",
          en: "Sure, I'll get you one a size larger.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "convenience-store",
    icon: ShoppingBag,
    ko: { title: "편의점에서 물건 사기" },
    en: { title: "Buying Things at a Convenience Store" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["waterQ"], ["buy"], ["total"], ["payOk"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "price", line: { zh: "你好,这个多少钱?", pinyin: "Nǐ hǎo, zhège duōshao qián?", ko: "안녕하세요, 이거 얼마예요?", en: "Hi, how much is this?" }, next: "waterQ" }],
      },
      waterQ: {
        id: "waterQ",
        aiLine: { zh: "五块五。", pinyin: "Wǔ kuài wǔ.", ko: "5.5위안이에요.", en: "5.5 yuan." },
        choices: [{ id: "water", line: { zh: "那这瓶水呢?", pinyin: "Nà zhè píng shuǐ ne?", ko: "그럼 이 물은요?", en: "What about this bottle of water?" }, next: "buy" }],
      },
      buy: {
        id: "buy",
        aiLine: { zh: "两块。", pinyin: "Liǎng kuài.", ko: "2위안이에요.", en: "2 yuan." },
        choices: [{ id: "these", line: { zh: "好,我买这两个。", pinyin: "Hǎo, wǒ mǎi zhè liǎng ge.", ko: "네, 이 두 개 살게요.", en: "Okay, I'll take these two." }, next: "total" }],
      },
      total: {
        id: "total",
        aiLine: { zh: "一共七块五。", pinyin: "Yígòng qī kuài wǔ.", ko: "전부 7.5위안이에요.", en: "That's 7.5 yuan in total." },
        choices: [{ id: "qr", line: { zh: "可以扫码支付吗?", pinyin: "Kěyǐ sǎomǎ zhīfù ma?", ko: "QR코드 결제 되나요?", en: "Can I pay by QR code?" }, next: "payOk" }],
      },
      payOk: {
        id: "payOk",
        aiLine: { zh: "可以。", pinyin: "Kěyǐ.", ko: "그럼요.", en: "Sure." },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "谢谢光临。", pinyin: "Xièxie guānglín.", ko: "감사합니다, 또 오세요.", en: "Thanks for coming." },
        choices: [],
      },
    },
  },
  {
    slug: "supermarket-location",
    icon: Store,
    ko: { title: "마트에서 물건 위치 물어보기" },
    en: { title: "Asking Where Items Are in a Supermarket" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["bread"], ["eggs"], ["thanksHelp"], ["anyMore"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "milk", line: { zh: "不好意思,请问牛奶在哪里?", pinyin: "Bù hǎoyìsi, qǐngwèn niúnǎi zài nǎlǐ?", ko: "실례합니다, 우유는 어디 있어요?", en: "Excuse me, where's the milk?" }, next: "bread" },
        ],
      },
      bread: {
        id: "bread",
        aiLine: { zh: "在三号货架。", pinyin: "Zài sān hào huòjià.", ko: "3번 진열대에 있어요.", en: "On aisle 3." },
        choices: [{ id: "breadQ", line: { zh: "那面包呢?", pinyin: "Nà miànbāo ne?", ko: "그럼 빵은요?", en: "What about bread?" }, next: "eggs" }],
      },
      eggs: {
        id: "eggs",
        aiLine: { zh: "就在牛奶旁边。", pinyin: "Jiù zài niúnǎi pángbiān.", ko: "우유 바로 옆에 있어요.", en: "Right next to the milk." },
        choices: [{ id: "eggsQ", line: { zh: "鸡蛋在哪里?", pinyin: "Jīdàn zài nǎlǐ?", ko: "계란은 어디 있어요?", en: "Where are the eggs?" }, next: "thanksHelp" }],
      },
      thanksHelp: {
        id: "thanksHelp",
        aiLine: { zh: "在冷藏区,五号货架。", pinyin: "Zài lěngcángqū, wǔ hào huòjià.", ko: "냉장 코너, 5번 진열대에 있어요.", en: "In the refrigerated section, aisle 5." },
        choices: [
          {
            id: "bighelp",
            line: { zh: "谢谢你,帮了我大忙。", pinyin: "Xièxie nǐ, bāng le wǒ dà máng.", ko: "감사합니다, 큰 도움이 됐어요.", en: "Thank you, you've been a huge help." },
            next: "anyMore",
          },
        ],
      },
      anyMore: {
        id: "anyMore",
        aiLine: {
          zh: "不客气,还需要别的帮助吗?",
          pinyin: "Bú kèqi, hái xūyào bié de bāngzhù ma?",
          ko: "아니에요, 더 도와드릴 거 있으세요?",
          en: "You're welcome, anything else I can help with?",
        },
        choices: [{ id: "no", line: { zh: "没有了,谢谢。", pinyin: "Méiyǒu le, xièxie.", ko: "없어요, 감사합니다.", en: "No, that's all, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好的,祝您购物愉快。", pinyin: "Hǎo de, zhù nín gòuwù yúkuài.", ko: "네, 즐거운 쇼핑 되세요.", en: "Great, happy shopping." },
        choices: [],
      },
    },
  },
  {
    slug: "souvenir",
    icon: Star,
    ko: { title: "기념품 고르기" },
    en: { title: "Choosing a Souvenir" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["recommend"], ["priceAns", "otherAns"], ["howMany"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "您好,您要买什么纪念品?", pinyin: "Nín hǎo, nín yào mǎi shénme jìniànpǐn?", ko: "안녕하세요, 어떤 기념품 사시려고요?", en: "Hello, what kind of souvenir are you looking for?" },
        choices: [
          {
            id: "forFriend",
            line: { zh: "有什么适合送朋友的吗?", pinyin: "Yǒu shénme shìhé sòng péngyou de ma?", ko: "친구한테 선물할 만한 거 있어요?", en: "Is there anything good to give a friend?" },
            next: "recommend",
          },
        ],
      },
      recommend: {
        id: "recommend",
        aiLine: { zh: "这个茶杯很受欢迎。", pinyin: "Zhège chábēi hěn shòu huānyíng.", ko: "이 찻잔이 인기 많아요.", en: "This teacup is very popular." },
        choices: [
          { id: "price", line: { zh: "这个多少钱?", pinyin: "Zhège duōshao qián?", ko: "이거 얼마예요?", en: "How much is this?" }, next: "priceAns" },
          { id: "other", line: { zh: "还有别的可以选的吗?", pinyin: "Hái yǒu bié de kěyǐ xuǎn de ma?", ko: "다른 선택지도 있어요?", en: "Are there other options?" }, next: "otherAns" },
        ],
      },
      priceAns: {
        id: "priceAns",
        aiLine: { zh: "三十五块一个。", pinyin: "Sānshíwǔ kuài yí ge.", ko: "하나에 35위안이에요.", en: "35 yuan each." },
        choices: [{ id: "takeit", line: { zh: "好,我要这个茶杯。", pinyin: "Hǎo, wǒ yào zhège chábēi.", ko: "네, 이 찻잔 주세요.", en: "Okay, I'll take this teacup." }, next: "howMany" }],
      },
      otherAns: {
        id: "otherAns",
        aiLine: { zh: "也有丝巾和明信片。", pinyin: "Yě yǒu sījīn hé míngxìnpiàn.", ko: "스카프랑 엽서도 있어요.", en: "We also have scarves and postcards." },
        choices: [{ id: "takeit", line: { zh: "好,我要这个茶杯。", pinyin: "Hǎo, wǒ yào zhège chábēi.", ko: "네, 이 찻잔 주세요.", en: "Okay, I'll take this teacup." }, next: "howMany" }],
      },
      howMany: {
        id: "howMany",
        aiLine: { zh: "好的,要几个?", pinyin: "Hǎo de, yào jǐ ge?", ko: "네, 몇 개 드릴까요?", en: "Sure, how many would you like?" },
        choices: [{ id: "two", line: { zh: "两个就够了。", pinyin: "Liǎng ge jiù gòu le.", ko: "두 개면 충분해요.", en: "Two will be enough." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好,我帮您包起来。", pinyin: "Hǎo, wǒ bāng nín bāo qǐlái.", ko: "네, 포장해 드릴게요.", en: "Okay, I'll wrap those up for you." },
        choices: [],
      },
    },
  },
  {
    slug: "gift-wrapping",
    icon: Gift,
    ko: { title: "선물 포장 요청하기" },
    en: { title: "Asking for Gift Wrapping" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["forWhom"], ["colorQ"], ["cardQ"], ["done"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "wrap", line: { zh: "可以帮我包装一下吗?", pinyin: "Kěyǐ bāng wǒ bāozhuāng yíxià ma?", ko: "포장 좀 해주실 수 있어요?", en: "Could you gift-wrap this for me?" }, next: "forWhom" },
        ],
      },
      forWhom: {
        id: "forWhom",
        aiLine: { zh: "可以,是送人的吗?", pinyin: "Kěyǐ, shì sòng rén de ma?", ko: "그럼요, 선물이세요?", en: "Sure, is it a gift?" },
        choices: [
          {
            id: "birthday",
            line: { zh: "是的,是给朋友的生日礼物。", pinyin: "Shì de, shì gěi péngyou de shēngrì lǐwù.", ko: "네, 친구 생일 선물이에요.", en: "Yes, it's a birthday gift for a friend." },
            next: "colorQ",
          },
        ],
      },
      colorQ: {
        id: "colorQ",
        aiLine: {
          zh: "好的,想要什么颜色的包装纸?",
          pinyin: "Hǎo de, xiǎng yào shénme yánsè de bāozhuāngzhǐ?",
          ko: "네, 어떤 색깔 포장지로 하시겠어요?",
          en: "Got it, what color wrapping paper would you like?",
        },
        choices: [
          { id: "pink", line: { zh: "粉色的吧。", pinyin: "Fěnsè de ba.", ko: "핑크색으로요.", en: "Pink, please." }, next: "cardQ" },
          { id: "blue", line: { zh: "蓝色的吧。", pinyin: "Lánsè de ba.", ko: "파란색으로요.", en: "Blue, please." }, next: "cardQ" },
        ],
      },
      cardQ: {
        id: "cardQ",
        aiLine: { zh: "好的,卡片需要吗?", pinyin: "Hǎo de, kǎpiàn xūyào ma?", ko: "네, 카드 필요하세요?", en: "Sure, would you like a card too?" },
        choices: [{ id: "yes", line: { zh: "好啊,来一张吧。", pinyin: "Hǎo a, lái yì zhāng ba.", ko: "네, 하나 주세요.", en: "Sure, I'll take one." }, next: "done" }],
      },
      done: {
        id: "done",
        aiLine: { zh: "好了,给您。", pinyin: "Hǎo le, gěi nín.", ko: "다 됐어요, 여기요.", en: "All done, here you go." },
        choices: [{ id: "lovely", line: { zh: "谢谢,很好看。", pinyin: "Xièxie, hěn hǎokàn.", ko: "감사합니다, 예쁘네요.", en: "Thank you, it looks lovely." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "希望您的朋友会喜欢。", pinyin: "Xīwàng nín de péngyou huì xǐhuan.", ko: "친구분이 좋아하시길 바랄게요.", en: "I hope your friend likes it." },
        choices: [{ id: "sure", line: { zh: "一定会的,谢谢。", pinyin: "Yídìng huì de, xièxie.", ko: "분명 좋아할 거예요, 감사합니다.", en: "I'm sure they will, thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "online-pickup",
    icon: Truck,
    ko: { title: "매장에서 온라인 주문 픽업하기" },
    en: { title: "Picking Up an Online Order In-Store" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["orderNum"], ["verify"], ["confirm"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "pickup",
            line: { zh: "你好,我来取网上订的东西。", pinyin: "Nǐ hǎo, wǒ lái qǔ wǎngshàng dìng de dōngxi.", ko: "안녕하세요, 온라인으로 주문한 물건 찾으러 왔어요.", en: "Hi, I'm here to pick up my online order." },
            next: "orderNum",
          },
        ],
      },
      orderNum: {
        id: "orderNum",
        aiLine: {
          zh: "好的,请问您的订单号是多少?",
          pinyin: "Hǎo de, qǐngwèn nín de dìngdān hào shì duōshao?",
          ko: "네, 주문 번호가 어떻게 되세요?",
          en: "Sure, what's your order number?",
        },
        choices: [{ id: "number", line: { zh: "是12345。", pinyin: "Shì yī èr sān sì wǔ.", ko: "12345예요.", en: "It's 12345." }, next: "verify" }],
      },
      verify: {
        id: "verify",
        aiLine: {
          zh: "请问,可以看一下您的手机吗?我需要核对一下。",
          pinyin: "Qǐngwèn, kěyǐ kàn yíxià nín de shǒujī ma? Wǒ xūyào héduì yíxià.",
          ko: "휴대폰 좀 보여주실 수 있어요? 확인이 필요해서요.",
          en: "Could I take a look at your phone? I just need to verify it.",
        },
        choices: [{ id: "here", line: { zh: "好的,这里。", pinyin: "Hǎo de, zhèlǐ.", ko: "네, 여기요.", en: "Sure, here." }, next: "confirm" }],
      },
      confirm: {
        id: "confirm",
        aiLine: {
          zh: "好的,请稍等,我去拿。给您,请确认一下东西对不对。",
          pinyin: "Hǎo de, qǐng shāo děng, wǒ qù ná. Gěi nín, qǐng quèrèn yíxià dōngxi duì bú duì.",
          ko: "네, 잠시만요, 가져올게요. 여기요, 물건 맞는지 확인해 보세요.",
          en: "Great, one moment, I'll go get it. Here you go, please check that everything's correct.",
        },
        choices: [
          {
            id: "correct",
            line: {
              zh: "没问题,都对。谢谢,辛苦了。",
              pinyin: "Méi wèntí, dōu duì. Xièxie, xīnkǔ le.",
              ko: "문제없어요, 다 맞아요. 감사합니다, 수고하셨어요.",
              en: "No problem, it's all correct. Thanks, appreciate the help.",
            },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "不客气,欢迎再来。", pinyin: "Bú kèqi, huānyíng zài lái.", ko: "아니에요, 또 오세요.", en: "You're welcome, come again." },
        choices: [],
      },
    },
  },
];
