/**
 * 마을채 (Village Wing) — daily life & health scenarios, transcribed from the
 * reviewed final script. See journey.ts for the note on combining
 * consecutive same-speaker turns instead of inventing filler lines.
 */
import { Dumbbell, FileText, HandHeart, KeyRound, Landmark, PackageSearch, Pill, Scissors, Stethoscope, WashingMachine } from "lucide-react";

import { makeStepIndex, type ScenarioData } from "./types";

export const villageScenarios: ScenarioData[] = [
  {
    slug: "pharmacy",
    icon: Pill,
    ko: { title: "약국에서 약 사기" },
    en: { title: "Buying Medicine at a Pharmacy" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["symptomQ"], ["effective"], ["sideEffect"], ["howToTake"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "ask", line: { zh: "你好,我想买感冒药。", pinyin: "Nǐ hǎo, wǒ xiǎng mǎi gǎnmào yào.", ko: "안녕하세요, 감기약 사고 싶어요.", en: "Hi, I'd like to buy some cold medicine." }, next: "symptomQ" },
        ],
      },
      symptomQ: {
        id: "symptomQ",
        aiLine: { zh: "您有什么症状吗?", pinyin: "Nín yǒu shénme zhèngzhuàng ma?", ko: "증상이 어떠세요?", en: "What symptoms do you have?" },
        choices: [
          { id: "cold", line: { zh: "流鼻涕,咳嗽。", pinyin: "Liú bítì, késou.", ko: "콧물 나고 기침해요.", en: "A runny nose and a cough." }, next: "effective" },
          { id: "throat", line: { zh: "喉咙痛。", pinyin: "Hóulóng tòng.", ko: "목이 아파요.", en: "A sore throat." }, next: "effective" },
        ],
      },
      effective: {
        id: "effective",
        aiLine: {
          zh: "好的,这个药对您的症状有效。",
          pinyin: "Hǎo de, zhège yào duì nín de zhèngzhuàng yǒuxiào.",
          ko: "네, 이 약이 그 증상에 잘 들어요.",
          en: "Okay, this medicine should work well for that.",
        },
        choices: [
          { id: "sideQ", line: { zh: "这个药有副作用吗?", pinyin: "Zhège yào yǒu fùzuòyòng ma?", ko: "이 약 부작용 있어요?", en: "Does this medicine have any side effects?" }, next: "sideEffect" },
        ],
      },
      sideEffect: {
        id: "sideEffect",
        aiLine: {
          zh: "可能会有点困,开车前不要吃。",
          pinyin: "Kěnéng huì yǒudiǎn kùn, kāichē qián bú yào chī.",
          ko: "좀 졸릴 수 있어요, 운전 전엔 드시지 마세요.",
          en: "It may make you a bit drowsy — don't take it before driving.",
        },
        choices: [
          {
            id: "howToTakeQ",
            line: { zh: "谢谢,这个药要怎么吃?", pinyin: "Xièxie, zhège yào yào zěnme chī?", ko: "감사합니다, 이 약은 어떻게 먹어요?", en: "Thanks, how should I take it?" },
            next: "howToTake",
          },
        ],
      },
      howToTake: {
        id: "howToTake",
        aiLine: {
          zh: "一天三次,一次一片,饭后吃。",
          pinyin: "Yì tiān sān cì, yí cì yí piàn, fàn hòu chī.",
          ko: "하루 세 번, 한 번에 한 알씩 식후에 드세요.",
          en: "Three times a day, one pill each time, after meals.",
        },
        choices: [{ id: "thanks", line: { zh: "好的,谢谢你。", pinyin: "Hǎo de, xièxie nǐ.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "不客气,祝您早日康复。",
          pinyin: "Bú kèqi, zhù nín zǎorì kāngfù.",
          ko: "아니에요, 빨리 쾌차하세요.",
          en: "You're welcome, hope you feel better soon.",
        },
        choices: [],
      },
    },
  },
  {
    slug: "clinic-checkin",
    icon: Stethoscope,
    ko: { title: "병원 접수하고 증상 설명하기" },
    en: { title: "Checking In at a Clinic and Describing Symptoms" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["whereQ"], ["otherSymptoms"], ["directTo"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [{ id: "checkin", line: { zh: "你好,我想挂号。", pinyin: "Nǐ hǎo, wǒ xiǎng guàhào.", ko: "안녕하세요, 접수하고 싶어요.", en: "Hi, I'd like to check in for an appointment." }, next: "whereQ" }],
      },
      whereQ: {
        id: "whereQ",
        aiLine: { zh: "请问哪里不舒服?", pinyin: "Qǐngwèn nǎlǐ bù shūfu?", ko: "어디가 불편하세요?", en: "What seems to be the problem?" },
        choices: [
          {
            id: "stomach",
            line: { zh: "我肚子疼,已经疼两天了。", pinyin: "Wǒ dùzi téng, yǐjīng téng liǎng tiān le.", ko: "배가 아파요, 아픈 지 벌써 이틀 됐어요.", en: "My stomach hurts, it's been hurting for two days now." },
            next: "otherSymptoms",
          },
        ],
      },
      otherSymptoms: {
        id: "otherSymptoms",
        aiLine: {
          zh: "除了肚子疼,还有别的症状吗?",
          pinyin: "Chúle dùzi téng, hái yǒu bié de zhèngzhuàng ma?",
          ko: "배 아픈 것 말고 다른 증상 있으세요?",
          en: "Besides the stomachache, any other symptoms?",
        },
        choices: [
          { id: "fever", line: { zh: "还有点发烧。", pinyin: "Hái yǒudiǎn fāshāo.", ko: "열도 좀 나요.", en: "I also have a bit of a fever." }, next: "directTo" },
          { id: "nothing", line: { zh: "没有别的了。", pinyin: "Méiyǒu bié de le.", ko: "다른 건 없어요.", en: "Nothing else." }, next: "directTo" },
        ],
      },
      directTo: {
        id: "directTo",
        aiLine: { zh: "好的,请去二楼内科。", pinyin: "Hǎo de, qǐng qù èr lóu nèikē.", ko: "네, 2층 내과로 가세요.", en: "Okay, please head to internal medicine on the second floor." },
        choices: [{ id: "thanks", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "不客气,请拿好这个号,叫到您的号时就可以进去。",
          pinyin: "Bú kèqi, qǐng ná hǎo zhège hào, jiào dào nín de hào shí jiù kěyǐ jìnqù.",
          ko: "아니에요, 이 번호표 챙기시고 번호가 불리면 들어가시면 돼요.",
          en: "You're welcome, please hold onto this number — you can go in once it's called.",
        },
        choices: [{ id: "thanks2", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "salon-booking",
    icon: Scissors,
    ko: { title: "미용실 예약하고 스타일 요청하기" },
    en: { title: "Booking a Salon Appointment and Requesting a Hairstyle" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["whenQ"], ["styleQ"], ["extraQ"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "book", line: { zh: "你好,我想预约剪头发。", pinyin: "Nǐ hǎo, wǒ xiǎng yùyuē jiǎn tóufa.", ko: "안녕하세요, 머리 자르는 거 예약하고 싶어요.", en: "Hi, I'd like to book a haircut." }, next: "whenQ" },
        ],
      },
      whenQ: {
        id: "whenQ",
        aiLine: { zh: "好的,您想什么时候来?", pinyin: "Hǎo de, nín xiǎng shénme shíhou lái?", ko: "네, 언제 오실 거예요?", en: "Sure, when would you like to come in?" },
        choices: [{ id: "saturday", line: { zh: "这周六下午。", pinyin: "Zhè zhōu liù xiàwǔ.", ko: "이번 주 토요일 오후요.", en: "This Saturday afternoon." }, next: "styleQ" }],
      },
      styleQ: {
        id: "styleQ",
        aiLine: { zh: "好,您想剪什么样的发型?", pinyin: "Hǎo, nín xiǎng jiǎn shénme yàng de fàxíng?", ko: "네, 어떤 스타일로 하고 싶으세요?", en: "Great, what style are you going for?" },
        choices: [
          { id: "short", line: { zh: "剪短一点就好。", pinyin: "Jiǎn duǎn yìdiǎn jiù hǎo.", ko: "조금 짧게만요.", en: "Just a little shorter is fine." }, next: "extraQ" },
          { id: "new", line: { zh: "我想换个新发型。", pinyin: "Wǒ xiǎng huàn ge xīn fàxíng.", ko: "새로운 스타일로 바꾸고 싶어요.", en: "I'd like a whole new style." }, next: "extraQ" },
        ],
      },
      extraQ: {
        id: "extraQ",
        aiLine: {
          zh: "好的,除了剪发,还需要染发或者烫发吗?",
          pinyin: "Hǎo de, chúle jiǎnfà, hái xūyào rǎnfà huòzhě tàngfà ma?",
          ko: "네, 커트 말고 염색이나 파마도 필요하세요?",
          en: "Got it — besides the cut, would you like coloring or a perm too?",
        },
        choices: [
          { id: "no", line: { zh: "不用了,谢谢。", pinyin: "Búyòng le, xièxie.", ko: "괜찮아요, 감사합니다.", en: "No thanks, just the cut." }, next: "closing" },
          { id: "color", line: { zh: "我也想染发。", pinyin: "Wǒ yě xiǎng rǎnfà.", ko: "염색도 하고 싶어요.", en: "I'd like to color it too." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好的,到时候见。", pinyin: "Hǎo de, dào shíhou jiàn.", ko: "네, 그때 뵐게요.", en: "Great, see you then." },
        choices: [{ id: "bye", line: { zh: "好的,谢谢,再见。", pinyin: "Hǎo de, xièxie, zàijiàn.", ko: "네, 감사합니다, 안녕히 계세요.", en: "Great, thank you, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "dry-cleaner",
    icon: WashingMachine,
    ko: { title: "세탁소에 옷 맡기기" },
    en: { title: "Dropping Off Clothes at the Dry Cleaner's" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["pickupQ"], ["price"], ["stain"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "clean", line: { zh: "你好,我想洗这件外套。", pinyin: "Nǐ hǎo, wǒ xiǎng xǐ zhè jiàn wàitào.", ko: "안녕하세요, 이 외투 세탁하고 싶어요.", en: "Hi, I'd like to have this coat cleaned." }, next: "pickupQ" },
        ],
      },
      pickupQ: {
        id: "pickupQ",
        aiLine: {
          zh: "好的,您打算什么时候来取?",
          pinyin: "Hǎo de, nín dǎsuàn shénme shíhou lái qǔ?",
          ko: "네, 언제 찾으러 오실 수 있어요?",
          en: "Sure, when would you like to pick it up?",
        },
        choices: [{ id: "dayafter", line: { zh: "后天可以吗?", pinyin: "Hòutiān kěyǐ ma?", ko: "모레 가능할까요?", en: "Would the day after tomorrow work?" }, next: "price" }],
      },
      price: {
        id: "price",
        aiLine: { zh: "可以,一共二十块。", pinyin: "Kěyǐ, yígòng èrshí kuài.", ko: "네, 전부 20위안이에요.", en: "Sure, that'll be 20 yuan." },
        choices: [
          {
            id: "stainQ",
            line: { zh: "这件外套上有个污渍,能洗掉吗?", pinyin: "Zhè jiàn wàitào shàng yǒu ge wūzì, néng xǐdiào ma?", ko: "이 외투에 얼룩이 있는데 지워질까요?", en: "There's a stain on this coat — can it come out?" },
            next: "stain",
          },
        ],
      },
      stain: {
        id: "stain",
        aiLine: {
          zh: "应该可以,我们会尽量处理。",
          pinyin: "Yīnggāi kěyǐ, wǒmen huì jǐnliàng chǔlǐ.",
          ko: "아마 될 거예요, 최대한 처리해 드릴게요.",
          en: "It should — we'll do our best with it.",
        },
        choices: [
          {
            id: "seeThen",
            line: { zh: "好,谢谢,那我后天来取。", pinyin: "Hǎo, xièxie, nà wǒ hòutiān lái qǔ.", ko: "네, 감사합니다, 그럼 모레 찾으러 올게요.", en: "Great, thanks, I'll come pick it up the day after tomorrow then." },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "好的,到时候给您发消息。好的,后天见。",
          pinyin: "Hǎo de, dào shíhou gěi nín fā xiāoxi. Hǎo de, hòutiān jiàn.",
          ko: "네, 그때 문자 드릴게요. 네, 모레 뵐게요.",
          en: "Sure, we'll send you a message when it's ready. All right, see you then.",
        },
        choices: [{ id: "bye", line: { zh: "好,再见。", pinyin: "Hǎo, zàijiàn.", ko: "네, 안녕히 계세요.", en: "Okay, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "bank-account",
    icon: Landmark,
    ko: { title: "은행에서 계좌 만들기" },
    en: { title: "Opening a Bank Account" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["passportQ"], ["form"], ["howFill"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "openAccount", line: { zh: "你好,我想开一个银行账户。", pinyin: "Nǐ hǎo, wǒ xiǎng kāi yí ge yínháng zhànghù.", ko: "안녕하세요, 계좌를 만들고 싶어요.", en: "Hi, I'd like to open a bank account." }, next: "passportQ" },
        ],
      },
      passportQ: {
        id: "passportQ",
        aiLine: {
          zh: "好的,请问您带护照了吗?",
          pinyin: "Hǎo de, qǐngwèn nín dài hùzhào le ma?",
          ko: "네, 여권 가져오셨어요?",
          en: "Sure, did you bring your passport?",
        },
        choices: [{ id: "yes", line: { zh: "带了,这里。", pinyin: "Dài le, zhèlǐ.", ko: "네, 여기요.", en: "Yes, here it is." }, next: "form" }],
      },
      form: {
        id: "form",
        aiLine: { zh: "好,请填一下这张表。", pinyin: "Hǎo, qǐng tián yíxià zhè zhāng biǎo.", ko: "네, 이 서류 좀 작성해 주세요.", en: "Great, please fill out this form." },
        choices: [
          { id: "howQ", line: { zh: "好的。这个要怎么填?", pinyin: "Hǎo de. Zhège yào zěnme tián?", ko: "네. 이건 어떻게 작성해요?", en: "Sure. How do I fill this part in?" }, next: "howFill" },
        ],
      },
      howFill: {
        id: "howFill",
        aiLine: {
          zh: "在这里写您的姓名和地址就可以。",
          pinyin: "Zài zhèlǐ xiě nín de xìngmíng hé dìzhǐ jiù kěyǐ.",
          ko: "여기에 성함이랑 주소만 쓰시면 돼요.",
          en: "Just write your name and address here.",
        },
        choices: [
          {
            id: "card",
            line: { zh: "我还需要办一张银行卡。", pinyin: "Wǒ hái xūyào bàn yì zhāng yínháng kǎ.", ko: "체크카드도 만들어야 해요.", en: "I'll also need a debit card." },
            next: "closing",
          },
          {
            id: "online",
            line: { zh: "可以开通网上银行吗?", pinyin: "Kěyǐ kāitōng wǎngshàng yínháng ma?", ko: "인터넷뱅킹도 개설 가능해요?", en: "Could you also set up online banking?" },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "可以,大概二十分钟就能办好。",
          pinyin: "Kěyǐ, dàgài èrshí fēnzhōng jiù néng bàn hǎo.",
          ko: "가능해요, 대략 20분이면 다 될 거예요.",
          en: "Sure, it should take about 20 minutes to sort out.",
        },
        choices: [{ id: "thanks", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Great, thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "real-estate",
    icon: KeyRound,
    ko: { title: "부동산에서 집 문의하기" },
    en: { title: "Asking About Apartments at a Real Estate Agency" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["sizeQ"], ["budgetQ"], ["findOk"], ["subwayQ"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "look",
            line: { zh: "你好,我想看一下附近的房子。", pinyin: "Nǐ hǎo, wǒ xiǎng kàn yíxià fùjìn de fángzi.", ko: "안녕하세요, 근처 집 좀 보고 싶어요.", en: "Hi, I'd like to look at some apartments nearby." },
            next: "sizeQ",
          },
        ],
      },
      sizeQ: {
        id: "sizeQ",
        aiLine: { zh: "好的,您要看多大的?", pinyin: "Hǎo de, nín yào kàn duō dà de?", ko: "네, 얼마나 큰 걸 보고 싶으세요?", en: "Sure, how big are you looking for?" },
        choices: [
          {
            id: "onebed",
            line: { zh: "一室一厅就够了。", pinyin: "Yí shì yì tīng jiù gòu le.", ko: "방 하나에 거실 하나면 충분해요.", en: "A one-bedroom with a living room is enough." },
            next: "budgetQ",
          },
        ],
      },
      budgetQ: {
        id: "budgetQ",
        aiLine: { zh: "好,预算大概有多少?", pinyin: "Hǎo, yùsuàn dàgài yǒu duōshao?", ko: "네, 예산은 대략 얼마나 되세요?", en: "Got it, what's your budget roughly?" },
        choices: [
          { id: "three", line: { zh: "三千左右。", pinyin: "Sānqiān zuǒyòu.", ko: "3천 위안 정도요.", en: "Around 3,000 yuan." }, next: "findOk" },
          { id: "four", line: { zh: "四千以内。", pinyin: "Sìqiān yǐnèi.", ko: "4천 위안 이내요.", en: "Under 4,000 yuan." }, next: "findOk" },
        ],
      },
      findOk: {
        id: "findOk",
        aiLine: { zh: "好,我给您找几个合适的。", pinyin: "Hǎo, wǒ gěi nín zhǎo jǐ ge héshì de.", ko: "네, 맞는 걸로 몇 개 찾아드릴게요.", en: "Okay, I'll find a few good matches for you." },
        choices: [
          { id: "subwayQ", line: { zh: "附近有地铁站吗?", pinyin: "Fùjìn yǒu dìtiězhàn ma?", ko: "근처에 지하철역 있어요?", en: "Is there a subway station nearby?" }, next: "subwayQ" },
        ],
      },
      subwayQ: {
        id: "subwayQ",
        aiLine: { zh: "有,走路大概五分钟。", pinyin: "Yǒu, zǒulù dàgài wǔ fēnzhōng.", ko: "네, 걸어서 대략 5분이요.", en: "Yes, about a five-minute walk." },
        choices: [
          {
            id: "whenSee",
            line: { zh: "太好了,那我什么时候可以去看房?", pinyin: "Tài hǎo le, nà wǒ shénme shíhou kěyǐ qù kànfáng?", ko: "잘됐네요, 그럼 언제 집 보러 갈 수 있어요?", en: "Great, when can I go see the place?" },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "明天下午都可以。", pinyin: "Míngtiān xiàwǔ dōu kěyǐ.", ko: "내일 오후 아무 때나 가능해요.", en: "Any time tomorrow afternoon works." },
        choices: [],
      },
    },
  },
  {
    slug: "gym-signup",
    icon: Dumbbell,
    ko: { title: "헬스장 등록하기" },
    en: { title: "Signing Up at a Gym" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["monthsQ"], ["trainerQ"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "signup", line: { zh: "你好,我想办张健身卡。", pinyin: "Nǐ hǎo, wǒ xiǎng bàn zhāng jiànshēn kǎ.", ko: "안녕하세요, 헬스장 회원권 등록하고 싶어요.", en: "Hi, I'd like to sign up for a gym membership." }, next: "monthsQ" },
        ],
      },
      monthsQ: {
        id: "monthsQ",
        aiLine: { zh: "好的,您想办几个月的?", pinyin: "Hǎo de, nín xiǎng bàn jǐ ge yuè de?", ko: "네, 몇 개월짜리로 하시겠어요?", en: "Sure, how many months would you like?" },
        choices: [
          { id: "three", line: { zh: "三个月。", pinyin: "Sān ge yuè.", ko: "3개월이요.", en: "Three months." }, next: "trainerQ" },
          { id: "year", line: { zh: "一年。", pinyin: "Yì nián.", ko: "1년이요.", en: "One year." }, next: "trainerQ" },
        ],
      },
      trainerQ: {
        id: "trainerQ",
        aiLine: { zh: "好的,需要请教练吗?", pinyin: "Hǎo de, xūyào qǐng jiàoliàn ma?", ko: "네, 트레이너 필요하세요?", en: "Got it — would you like a personal trainer?" },
        choices: [
          {
            id: "no",
            line: {
              zh: "不用了,谢谢,健身房几点开门?",
              pinyin: "Búyòng le, xièxie, jiànshēnfáng jǐ diǎn kāimén?",
              ko: "괜찮아요, 감사합니다, 헬스장은 몇 시에 열어요?",
              en: "No thanks — and what time does the gym open?",
            },
            next: "closing",
          },
          {
            id: "yes",
            line: {
              zh: "需要,我想请一位教练,健身房几点开门?",
              pinyin: "Xūyào, wǒ xiǎng qǐng yí wèi jiàoliàn, jiànshēnfáng jǐ diǎn kāimén?",
              ko: "네, 트레이너 한 분 부탁드려요, 헬스장은 몇 시에 열어요?",
              en: "Yes, I'd like to book a trainer — and what time does the gym open?",
            },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "早上六点开门,到晚上十一点。感谢您的加入,祝您健身愉快。",
          pinyin: "Zǎoshang liù diǎn kāimén, dào wǎnshang shíyī diǎn. Gǎnxiè nín de jiārù, zhù nín jiànshēn yúkuài.",
          ko: "아침 6시에 열어서 밤 11시까지예요. 가입해 주셔서 감사합니다, 즐거운 운동 되세요.",
          en: "It opens at 6 a.m. and stays open until 11 p.m. Thanks for joining, enjoy your workouts.",
        },
        choices: [{ id: "bye", line: { zh: "谢谢,再见。", pinyin: "Xièxie, zàijiàn.", ko: "감사합니다, 안녕히 계세요.", en: "Thank you, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "neighbor-greeting",
    icon: HandHeart,
    ko: { title: "동네 이웃과 인사·소통하기" },
    en: { title: "Greeting and Chatting with a Neighbor" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["welcome"], ["marketAns"], ["teaInvite"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "你好,你也住这栋楼吗?", pinyin: "Nǐ hǎo, nǐ yě zhù zhè dòng lóu ma?", ko: "안녕하세요, 이 건물에 사세요?", en: "Hi, do you live in this building too?" },
        choices: [
          { id: "movedIn", line: { zh: "是的,我刚搬来没多久。", pinyin: "Shì de, wǒ gāng bān lái méi duō jiǔ.", ko: "네, 이사온 지 얼마 안 됐어요.", en: "Yes, I just moved in not long ago." }, next: "welcome" },
        ],
      },
      welcome: {
        id: "welcome",
        aiLine: {
          zh: "欢迎欢迎,有什么需要可以找我。",
          pinyin: "Huānyíng huānyíng, yǒu shénme xūyào kěyǐ zhǎo wǒ.",
          ko: "환영해요, 필요한 거 있으면 저 찾아주세요.",
          en: "Welcome, welcome — let me know if you ever need anything.",
        },
        choices: [
          {
            id: "marketQ",
            line: {
              zh: "谢谢你,太好了。请问附近有超市吗?",
              pinyin: "Xièxie nǐ, tài hǎo le. Qǐngwèn fùjìn yǒu chāoshì ma?",
              ko: "감사합니다, 정말 좋네요. 혹시 근처에 마트 있어요?",
              en: "Thank you, that's really nice of you. Is there a supermarket nearby, by any chance?",
            },
            next: "marketAns",
          },
        ],
      },
      marketAns: {
        id: "marketAns",
        aiLine: { zh: "有,走路五分钟就到。", pinyin: "Yǒu, zǒulù wǔ fēnzhōng jiù dào.", ko: "네, 걸어서 5분이면 도착해요.", en: "Yes, it's about a five-minute walk." },
        choices: [
          {
            id: "thanksInfo",
            line: { zh: "太好了,谢谢你告诉我。", pinyin: "Tài hǎo le, xièxie nǐ gàosu wǒ.", ko: "잘됐네요, 알려주셔서 감사해요.", en: "Great, thanks for letting me know." },
            next: "teaInvite",
          },
        ],
      },
      teaInvite: {
        id: "teaInvite",
        aiLine: {
          zh: "不客气,以后有空一起喝杯茶吧。",
          pinyin: "Bú kèqi, yǐhòu yǒu kòng yìqǐ hē bēi chá ba.",
          ko: "아니에요, 나중에 시간 되면 같이 차 한잔해요.",
          en: "You're welcome — let's grab tea together sometime.",
        },
        choices: [{ id: "sure", line: { zh: "好啊,一定的。", pinyin: "Hǎo a, yídìng de.", ko: "좋아요, 꼭 그럴게요.", en: "Sure, I'd like that." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "那再见,有事随时找我。",
          pinyin: "Nà zàijiàn, yǒu shì suíshí zhǎo wǒ.",
          ko: "그럼 안녕히 가세요, 일 있으면 언제든 찾아주세요.",
          en: "Okay, bye — let me know anytime you need something.",
        },
        choices: [],
      },
    },
  },
  {
    slug: "lost-item",
    icon: PackageSearch,
    ko: { title: "분실물 신고하기" },
    en: { title: "Reporting a Lost Item" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["lookQ"], ["whereQ"], ["contactQ"], ["closing"], ["closing2"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          { id: "lost", line: { zh: "你好,我把钱包弄丢了。", pinyin: "Nǐ hǎo, wǒ bǎ qiánbāo nòngdiū le.", ko: "안녕하세요, 지갑을 잃어버렸어요.", en: "Hi, I've lost my wallet." }, next: "lookQ" },
        ],
      },
      lookQ: {
        id: "lookQ",
        aiLine: { zh: "请问是什么样子的?", pinyin: "Qǐngwèn shì shénme yàngzi de?", ko: "어떻게 생겼어요?", en: "What does it look like?" },
        choices: [
          {
            id: "describe",
            line: { zh: "黑色的,里面有身份证。", pinyin: "Hēisè de, lǐmiàn yǒu shēnfènzhèng.", ko: "검은색이고, 안에 신분증이 있어요.", en: "It's black, and my ID card is inside." },
            next: "whereQ",
          },
        ],
      },
      whereQ: {
        id: "whereQ",
        aiLine: { zh: "大概是在哪里弄丢的?", pinyin: "Dàgài shì zài nǎlǐ nòngdiū de?", ko: "대략 어디서 잃어버리셨어요?", en: "About where do you think you lost it?" },
        choices: [
          { id: "bus", line: { zh: "好像是在公交车上。", pinyin: "Hǎoxiàng shì zài gōngjiāochē shàng.", ko: "아마 버스에서 잃어버린 것 같아요.", en: "I think it was on the bus." }, next: "contactQ" },
        ],
      },
      contactQ: {
        id: "contactQ",
        aiLine: {
          zh: "好的,请留一下您的联系方式。",
          pinyin: "Hǎo de, qǐng liú yíxià nín de liánxì fāngshì.",
          ko: "네, 연락처 좀 남겨주시겠어요?",
          en: "Okay, could you leave your contact information?",
        },
        choices: [
          { id: "number", line: { zh: "这是我的电话号码。", pinyin: "Zhè shì wǒ de diànhuà hàomǎ.", ko: "이게 제 전화번호예요.", en: "This is my phone number." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "好,我们会先联系公交公司帮您查一下。",
          pinyin: "Hǎo, wǒmen huì xiān liánxì gōngjiāo gōngsī bāng nín chá yíxià.",
          ko: "네, 버스 회사에 먼저 연락해서 확인해 드릴게요.",
          en: "Okay, we'll contact the bus company first to check for you.",
        },
        choices: [
          { id: "thanks", line: { zh: "谢谢你,麻烦你了。", pinyin: "Xièxie nǐ, máfan nǐ le.", ko: "감사합니다, 번거롭게 해드렸네요.", en: "Thank you, sorry for the trouble." }, next: "closing2" },
        ],
      },
      closing2: {
        id: "closing2",
        aiLine: {
          zh: "不客气,找到了就会马上联系您。",
          pinyin: "Bú kèqi, zhǎodào le jiù huì mǎshàng liánxì nín.",
          ko: "아니에요, 찾으면 바로 연락드릴게요.",
          en: "You're welcome, we'll contact you right away if it turns up.",
        },
        choices: [],
      },
    },
  },
  {
    slug: "government-office",
    icon: FileText,
    ko: { title: "공공기관에서 서류 문의하기" },
    en: { title: "Asking About Paperwork at a Government Office" },
    totalSteps: 6,
    stepIndex: makeStepIndex([["start"], ["docsQ"], ["form"], ["timeQ"], ["pickupQ"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "ask",
            line: { zh: "你好,我想问一下怎么办居住证。", pinyin: "Nǐ hǎo, wǒ xiǎng wèn yíxià zěnme bàn jūzhùzhèng.", ko: "안녕하세요, 거주증은 어떻게 만드는지 여쭤보고 싶어요.", en: "Hi, I'd like to ask how to apply for a residence permit." },
            next: "docsQ",
          },
        ],
      },
      docsQ: {
        id: "docsQ",
        aiLine: {
          zh: "您需要带护照和租房合同。",
          pinyin: "Nín xūyào dài hùzhào hé zūfáng hétong.",
          ko: "여권이랑 임대 계약서 가져오셔야 해요.",
          en: "You'll need to bring your passport and lease agreement.",
        },
        choices: [{ id: "brought", line: { zh: "我都带了,在这里。", pinyin: "Wǒ dōu dài le, zài zhèlǐ.", ko: "다 가져왔어요, 여기 있어요.", en: "I brought both, here they are." }, next: "form" }],
      },
      form: {
        id: "form",
        aiLine: {
          zh: "好的,请先填一下这张申请表。",
          pinyin: "Hǎo de, qǐng xiān tián yíxià zhè zhāng shēnqǐngbiǎo.",
          ko: "네, 먼저 이 신청서 좀 작성해 주세요.",
          en: "Great, please fill out this application form first.",
        },
        choices: [{ id: "todayQ", line: { zh: "今天就可以办吗?", pinyin: "Jīntiān jiù kěyǐ bàn ma?", ko: "오늘 바로 처리 가능할까요?", en: "Can this be processed today?" }, next: "timeQ" }],
      },
      timeQ: {
        id: "timeQ",
        aiLine: { zh: "可以,大概需要半个小时。", pinyin: "Kěyǐ, dàgài xūyào bàn ge xiǎoshí.", ko: "네, 대략 30분 정도 걸려요.", en: "Yes, it should take about 30 minutes." },
        choices: [
          {
            id: "pickup",
            line: { zh: "办好以后可以直接拿走吗?", pinyin: "Bàn hǎo yǐhòu kěyǐ zhíjiē ná zǒu ma?", ko: "다 처리되면 바로 가져갈 수 있어요?", en: "Can I take it with me as soon as it's done?" },
            next: "pickupQ",
          },
        ],
      },
      pickupQ: {
        id: "pickupQ",
        aiLine: { zh: "可以,我们会叫您的名字。", pinyin: "Kěyǐ, wǒmen huì jiào nín de míngzi.", ko: "네, 성함 불러드릴게요.", en: "Yes, we'll call your name." },
        choices: [{ id: "thanks", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Okay, thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "不客气,请稍等一下。", pinyin: "Bú kèqi, qǐng shāo děng yíxià.", ko: "아니에요, 잠시만 기다려 주세요.", en: "You're welcome, please wait just a moment." },
        choices: [],
      },
    },
  },
];
