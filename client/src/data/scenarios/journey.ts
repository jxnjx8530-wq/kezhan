/**
 * 여정채 (Journey Wing) — transit & lodging scenarios, transcribed from the
 * reviewed final script. Where the source shows two consecutive turns from
 * the same speaker (no reply from the other side in between), the lines are
 * combined into a single bubble rather than inventing a filler line.
 */
import { Bus, Car, DoorOpen, Hotel, MapPinned, MessageSquareWarning, PlaneTakeoff, Route, Signpost, Ticket } from "lucide-react";

import { makeStepIndex, type ScenarioData } from "./types";

export const journeyScenarios: ScenarioData[] = [
  {
    slug: "taxi",
    icon: MapPinned,
    ko: { title: "택시 타고 목적지 말하기" },
    en: { title: "Taking a Taxi and Giving a Destination" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["timeA", "timeB"], ["arrive"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "你好,去哪儿?", pinyin: "Nǐ hǎo, qù nǎr?", ko: "안녕하세요, 어디로 가세요?", en: "Hi, where to?" },
        choices: [
          {
            id: "airport",
            line: {
              zh: "我要去机场,到机场需要多长时间?",
              pinyin: "Wǒ yào qù jīchǎng, dào jīchǎng xūyào duō cháng shíjiān?",
              ko: "공항으로 가주세요, 공항까지 얼마나 걸려요?",
              en: "To the airport, please — how long does it take?",
            },
            next: "timeA",
          },
          {
            id: "station",
            line: {
              zh: "我要去火车站,到火车站需要多长时间?",
              pinyin: "Wǒ yào qù huǒchēzhàn, dào huǒchēzhàn xūyào duō cháng shíjiān?",
              ko: "기차역으로 가주세요, 기차역까지 얼마나 걸려요?",
              en: "To the train station, please — how long does it take?",
            },
            next: "timeB",
          },
        ],
      },
      timeA: {
        id: "timeA",
        aiLine: { zh: "大概需要二十分钟。", pinyin: "Dàgài xūyào èrshí fēnzhōng.", ko: "대략 20분 정도 걸려요.", en: "About 20 minutes." },
        choices: [
          {
            id: "window",
            line: { zh: "可以开一下窗户吗?", pinyin: "Kěyǐ kāi yíxià chuānghu ma?", ko: "창문 좀 열어도 될까요?", en: "Could I open the window a bit?" },
            next: "arrive",
          },
        ],
      },
      timeB: {
        id: "timeB",
        aiLine: { zh: "大概需要十分钟。", pinyin: "Dàgài xūyào shí fēnzhōng.", ko: "대략 10분 정도 걸려요.", en: "About 10 minutes." },
        choices: [
          {
            id: "window",
            line: { zh: "可以开一下窗户吗?", pinyin: "Kěyǐ kāi yíxià chuānghu ma?", ko: "창문 좀 열어도 될까요?", en: "Could I open the window a bit?" },
            next: "arrive",
          },
        ],
      },
      arrive: {
        id: "arrive",
        aiLine: {
          zh: "可以。到了,一共三十块。",
          pinyin: "Kěyǐ. Dào le, yígòng sānshí kuài.",
          ko: "그럼요. 다 왔어요, 전부 30위안이에요.",
          en: "Sure. Here we are, that's 30 yuan in total.",
        },
        choices: [
          {
            id: "pay",
            line: {
              zh: "好的,给你。谢谢,再见。",
              pinyin: "Hǎo de, gěi nǐ. Xièxie, zàijiàn.",
              ko: "네, 여기 있어요. 감사합니다, 안녕히 가세요.",
              en: "Sure, here you go. Thanks, bye.",
            },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "再见。", pinyin: "Zàijiàn.", ko: "안녕히 가세요.", en: "Bye." },
        choices: [],
      },
    },
  },
  {
    slug: "train-ticket",
    icon: Ticket,
    ko: { title: "기차역에서 표 사기" },
    en: { title: "Buying a Train Ticket at the Station" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["nextTrain"], ["seatQ"], ["pay"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: { zh: "您好,请问去哪儿?", pinyin: "Nín hǎo, qǐngwèn qù nǎr?", ko: "안녕하세요, 어디로 가세요?", en: "Hello, where are you headed?" },
        choices: [
          {
            id: "shanghai",
            line: {
              zh: "我要去上海,最近的一班车是几点?",
              pinyin: "Wǒ yào qù Shànghǎi, zuìjìn de yì bān chē shì jǐ diǎn?",
              ko: "상하이요, 가장 가까운 기차가 몇 시예요?",
              en: "Shanghai, please — when's the next train?",
            },
            next: "nextTrain",
          },
          {
            id: "beijing",
            line: {
              zh: "我要去北京,最近的一班车是几点?",
              pinyin: "Wǒ yào qù Běijīng, zuìjìn de yì bān chē shì jǐ diǎn?",
              ko: "베이징이요, 가장 가까운 기차가 몇 시예요?",
              en: "Beijing, please — when's the next train?",
            },
            next: "nextTrain",
          },
        ],
      },
      nextTrain: {
        id: "nextTrain",
        aiLine: { zh: "下午三点。", pinyin: "Xiàwǔ sān diǎn.", ko: "오후 3시요.", en: "3 p.m." },
        choices: [
          {
            id: "buyTwo",
            line: {
              zh: "好的,下午三点,买两张。",
              pinyin: "Hǎo de, xiàwǔ sān diǎn, mǎi liǎng zhāng.",
              ko: "네, 오후 3시로 두 장 주세요.",
              en: "Great, I'll take two tickets for the 3 p.m. train.",
            },
            next: "seatQ",
          },
        ],
      },
      seatQ: {
        id: "seatQ",
        aiLine: {
          zh: "要二等座还是一等座?",
          pinyin: "Yào èr děng zuò háishì yī děng zuò?",
          ko: "이등석으로 드릴까요, 일등석으로 드릴까요?",
          en: "Second class or first class?",
        },
        choices: [
          { id: "second", line: { zh: "二等座。", pinyin: "Èr děng zuò.", ko: "이등석이요.", en: "Second class." }, next: "pay" },
          { id: "first", line: { zh: "一等座。", pinyin: "Yī děng zuò.", ko: "일등석이요.", en: "First class." }, next: "pay" },
        ],
      },
      pay: {
        id: "pay",
        aiLine: { zh: "一共两百块。", pinyin: "Yígòng liǎngbǎi kuài.", ko: "전부 200위안이에요.", en: "That's 200 yuan in total." },
        choices: [
          { id: "givemoney", line: { zh: "好的,给你。", pinyin: "Hǎo de, gěi nǐ.", ko: "네, 여기 있어요.", en: "Sure, here you go." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "谢谢,祝你旅途愉快。",
          pinyin: "Xièxie, zhù nǐ lǚtú yúkuài.",
          ko: "감사합니다, 즐거운 여행 되세요.",
          en: "Thank you, have a great trip.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢,再见。", pinyin: "Xièxie, zàijiàn.", ko: "감사합니다, 안녕히 계세요.", en: "Thank you, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "airport-checkin",
    icon: PlaneTakeoff,
    ko: { title: "공항에서 체크인하기" },
    en: { title: "Checking In at the Airport" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["bags"], ["seat"], ["boarding"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: {
          zh: "您好,请出示护照和机票。",
          pinyin: "Nín hǎo, qǐng chūshì hùzhào hé jīpiào.",
          ko: "안녕하세요, 여권과 항공권 보여주세요.",
          en: "Hello, may I see your passport and ticket?",
        },
        choices: [{ id: "give", line: { zh: "好的,给你。", pinyin: "Hǎo de, gěi nǐ.", ko: "네, 여기 있어요.", en: "Sure, here you go." }, next: "bags" }],
      },
      bags: {
        id: "bags",
        aiLine: {
          zh: "有几件行李需要托运?",
          pinyin: "Yǒu jǐ jiàn xíngli xūyào tuōyùn?",
          ko: "부칠 짐이 몇 개세요?",
          en: "How many bags will you be checking?",
        },
        choices: [
          { id: "one", line: { zh: "一件。", pinyin: "Yí jiàn.", ko: "한 개요.", en: "One bag." }, next: "seat" },
          { id: "two", line: { zh: "两件。", pinyin: "Liǎng jiàn.", ko: "두 개요.", en: "Two bags." }, next: "seat" },
        ],
      },
      seat: {
        id: "seat",
        aiLine: {
          zh: "您要靠窗的还是靠走道的座位?",
          pinyin: "Nín yào kào chuāng de háishì kào zǒudào de zuòwèi?",
          ko: "창가로 드릴까요, 통로로 드릴까요?",
          en: "Window seat or aisle seat?",
        },
        choices: [
          { id: "window", line: { zh: "靠窗的。", pinyin: "Kào chuāng de.", ko: "창가요.", en: "Window seat." }, next: "boarding" },
          { id: "aisle", line: { zh: "靠走道。", pinyin: "Kào zǒudào.", ko: "통로요.", en: "Aisle seat." }, next: "boarding" },
        ],
      },
      boarding: {
        id: "boarding",
        aiLine: {
          zh: "好的,这是您的登机牌。",
          pinyin: "Hǎo de, zhè shì nín de dēngjīpái.",
          ko: "네, 여기 탑승권입니다.",
          en: "Here's your boarding pass.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "祝您旅途愉快。", pinyin: "Zhù nín lǚtú yúkuài.", ko: "즐거운 여행 되세요.", en: "Have a great trip." },
        choices: [{ id: "bye", line: { zh: "谢谢,再见。", pinyin: "Xièxie, zàijiàn.", ko: "감사합니다, 안녕히 계세요.", en: "Thank you, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "subway-transfer",
    icon: Route,
    ko: { title: "지하철 노선·환승 물어보기" },
    en: { title: "Asking About Subway Lines & Transfers" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["route"], ["stops"], ["closing2", "repeat"], ["closing2b"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "ask",
            line: {
              zh: "不好意思,请问一下,去动物园要怎么坐地铁?",
              pinyin: "Bù hǎoyìsi, qǐngwèn yíxià, qù dòngwùyuán yào zěnme zuò dìtiě?",
              ko: "실례합니다, 여쭤볼게요, 동물원 가려면 지하철 어떻게 타야 해요?",
              en: "Excuse me, could I ask — how do I get to the zoo by subway?",
            },
            next: "route",
          },
        ],
      },
      route: {
        id: "route",
        aiLine: {
          zh: "先坐二号线,在人民广场再换乘一号线。",
          pinyin: "Xiān zuò èr hào xiàn, zài Rénmín Guǎngchǎng zài huànchéng yī hào xiàn.",
          ko: "먼저 2호선 타시고, 런민광장에서 다시 1호선으로 환승하세요.",
          en: "Take Line 2 first, then transfer to Line 1 at People's Square.",
        },
        choices: [{ id: "howmany", line: { zh: "要坐几站?", pinyin: "Yào zuò jǐ zhàn?", ko: "몇 정거장 가야 해요?", en: "How many stops is that?" }, next: "stops" }],
      },
      stops: {
        id: "stops",
        aiLine: { zh: "大概五站。", pinyin: "Dàgài wǔ zhàn.", ko: "대략 5정거장이요.", en: "About five stops." },
        choices: [
          { id: "gotit", line: { zh: "谢谢,我知道了。", pinyin: "Xièxie, wǒ zhīdào le.", ko: "감사합니다, 알겠어요.", en: "Thanks, got it." }, next: "closing2" },
          {
            id: "again",
            line: { zh: "可以再说一次吗?", pinyin: "Kěyǐ zài shuō yí cì ma?", ko: "다시 한 번 말씀해주실 수 있어요?", en: "Could you say that again?" },
            next: "repeat",
          },
        ],
      },
      repeat: {
        id: "repeat",
        aiLine: {
          zh: "好,先坐二号线再换一号线。",
          pinyin: "Hǎo, xiān zuò èr hào xiàn zài huàn yī hào xiàn.",
          ko: "네, 먼저 2호선 타고 다시 1호선으로 갈아타세요.",
          en: "Sure, take Line 2 first, then switch to Line 1.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢您。", pinyin: "Xièxie nín.", ko: "감사합니다.", en: "Thank you." }, next: "closing2" }],
      },
      closing2: {
        id: "closing2",
        aiLine: { zh: "不客气。", pinyin: "Bú kèqi.", ko: "아니에요.", en: "You're welcome." },
        choices: [],
      },
    },
  },
  {
    slug: "bus-stop",
    icon: Bus,
    ko: { title: "버스 정류장 위치 물어보기" },
    en: { title: "Asking Where the Bus Stop Is" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["whichBus"], ["howOften"], ["closing"], ["closing2"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "ask",
            line: {
              zh: "不好意思,请问公交车站在哪儿?",
              pinyin: "Bù hǎoyìsi, qǐngwèn gōngjiāo chēzhàn zài nǎr?",
              ko: "실례합니다, 버스 정류장이 어디예요?",
              en: "Excuse me, where's the bus stop?",
            },
            next: "whichBus",
          },
        ],
      },
      whichBus: {
        id: "whichBus",
        aiLine: {
          zh: "就在前面,往前走两分钟。",
          pinyin: "Jiù zài qiánmiàn, wǎng qián zǒu liǎng fēnzhōng.",
          ko: "바로 앞이에요, 2분만 걸어가시면 돼요.",
          en: "It's right up ahead, about a two-minute walk.",
        },
        choices: [
          {
            id: "which",
            line: { zh: "几路车能到火车站?", pinyin: "Jǐ lù chē néng dào huǒchēzhàn?", ko: "몇 번 버스가 기차역 가요?", en: "Which bus goes to the train station?" },
            next: "howOften",
          },
        ],
      },
      howOften: {
        id: "howOften",
        aiLine: { zh: "15路可以到。", pinyin: "Shíwǔ lù kěyǐ dào.", ko: "15번 버스가 가요.", en: "Bus 15 goes there." },
        choices: [
          {
            id: "often",
            line: { zh: "大概多久有一班?", pinyin: "Dàgài duō jiǔ yǒu yì bān?", ko: "대략 얼마 만에 한 대씩 와요?", en: "About how often does it come?" },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "大概十分钟一班。", pinyin: "Dàgài shí fēnzhōng yì bān.", ko: "대략 10분에 한 대씩 와요.", en: "About every 10 minutes." },
        choices: [{ id: "thanks", line: { zh: "谢谢你。", pinyin: "Xièxie nǐ.", ko: "감사합니다.", en: "Thank you." }, next: "closing2" }],
      },
      closing2: {
        id: "closing2",
        aiLine: { zh: "不客气,慢走。", pinyin: "Bú kèqi, màn zǒu.", ko: "아니에요, 조심히 가세요.", en: "You're welcome, take care." },
        choices: [],
      },
    },
  },
  {
    slug: "hotel-checkin",
    icon: Hotel,
    ko: { title: "호텔 체크인하기" },
    en: { title: "Checking Into a Hotel" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["passport"], ["breakfast"], ["keycard"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: {
          zh: "您好,请问您有预订吗?",
          pinyin: "Nín hǎo, qǐngwèn nín yǒu yùdìng ma?",
          ko: "안녕하세요, 예약하셨나요?",
          en: "Hello, do you have a reservation?",
        },
        choices: [{ id: "yes", line: { zh: "有,我叫OO。", pinyin: "Yǒu, wǒ jiào OO.", ko: "네, 저는 OO예요.", en: "Yes, my name is OO." }, next: "passport" }],
      },
      passport: {
        id: "passport",
        aiLine: {
          zh: "请出示一下您的护照。",
          pinyin: "Qǐng chūshì yíxià nín de hùzhào.",
          ko: "여권 좀 보여주시겠어요?",
          en: "Could I see your passport, please?",
        },
        choices: [{ id: "give", line: { zh: "好的,给您。", pinyin: "Hǎo de, gěi nín.", ko: "네, 여기 있어요.", en: "Sure, here you go." }, next: "breakfast" }],
      },
      breakfast: {
        id: "breakfast",
        aiLine: {
          zh: "早餐是七点到十点,您可以去吃。",
          pinyin: "Zǎocān shì qī diǎn dào shí diǎn, nín kěyǐ qù chī.",
          ko: "조식은 7시부터 10시까지예요, 가서 드시면 돼요.",
          en: "Breakfast is from 7 to 10, feel free to head down.",
        },
        choices: [{ id: "ok", line: { zh: "好的,谢谢。", pinyin: "Hǎo de, xièxie.", ko: "네, 감사합니다.", en: "Great, thank you." }, next: "keycard" }],
      },
      keycard: {
        id: "keycard",
        aiLine: {
          zh: "这是您的房卡,三零八房间。",
          pinyin: "Zhè shì nín de fángkǎ, sān líng bā fángjiān.",
          ko: "여기 카드키예요, 308호실입니다.",
          en: "Here's your key card, room 308.",
        },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "祝您入住愉快。", pinyin: "Zhù nín rùzhù yúkuài.", ko: "편안한 숙박 되세요.", en: "Enjoy your stay." },
        choices: [{ id: "bye", line: { zh: "谢谢,再见。", pinyin: "Xièxie, zàijiàn.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "hotel-checkout",
    icon: DoorOpen,
    ko: { title: "호텔 체크아웃하기" },
    en: { title: "Checking Out of a Hotel" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["usedItems"], ["closing"], ["farewell"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "checkout",
            line: {
              zh: "你好,我想退房,我是三零八房间。",
              pinyin: "Nǐ hǎo, wǒ xiǎng tuìfáng, wǒ shì sān líng bā fángjiān.",
              ko: "안녕하세요, 체크아웃하려고요, 308호실이에요.",
              en: "Hi, I'd like to check out, I'm in room 308.",
            },
            next: "usedItems",
          },
        ],
      },
      usedItems: {
        id: "usedItems",
        aiLine: {
          zh: "好的,请稍等。您有没有使用房间里的东西?",
          pinyin: "Hǎo de, qǐng shāo děng. Nín yǒu méiyǒu shǐyòng fángjiān lǐ de dōngxi?",
          ko: "네, 잠시만요. 방에 있는 물건 사용하셨어요?",
          en: "Sure, one moment please. Did you use anything from the room?",
        },
        choices: [
          { id: "no", line: { zh: "没有。", pinyin: "Méiyǒu.", ko: "안 썼어요.", en: "No, I didn't." }, next: "closing" },
          { id: "water", line: { zh: "喝了一瓶水。", pinyin: "Hē le yì píng shuǐ.", ko: "물 한 병 마셨어요.", en: "I drank a bottle of water." }, next: "closing" },
        ],
      },
      closing: {
        id: "closing",
        aiLine: { zh: "好的,没有问题。", pinyin: "Hǎo de, méiyǒu wèntí.", ko: "네, 문제없습니다.", en: "All right, no problem." },
        choices: [{ id: "thanks", line: { zh: "谢谢。", pinyin: "Xièxie.", ko: "감사합니다.", en: "Thank you." }, next: "farewell" }],
      },
      farewell: {
        id: "farewell",
        aiLine: { zh: "欢迎您再次光临。", pinyin: "Huānyíng nín zàicì guānglín.", ko: "또 방문해 주세요.", en: "We hope to see you again." },
        choices: [{ id: "bye", line: { zh: "好,再见。", pinyin: "Hǎo, zàijiàn.", ko: "네, 안녕히 계세요.", en: "Okay, goodbye." }, next: "end" }],
      },
    },
  },
  {
    slug: "hotel-room-issue",
    icon: MessageSquareWarning,
    ko: { title: "호텔 방에 문제 생겨서 요청하기" },
    en: { title: "Reporting a Problem in Your Hotel Room" },
    totalSteps: 4,
    stepIndex: makeStepIndex([["start"], ["roomNum"], ["password"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "wifi",
            line: {
              zh: "你好,我房间的Wi-Fi连不上。",
              pinyin: "Nǐ hǎo, wǒ fángjiān de Wi-Fi lián bú shàng.",
              ko: "안녕하세요, 제 방 와이파이가 연결이 안 돼요.",
              en: "Hi, the Wi-Fi in my room won't connect.",
            },
            next: "roomNum",
          },
        ],
      },
      roomNum: {
        id: "roomNum",
        aiLine: {
          zh: "不好意思,我马上帮您看看。请问您的房间是多少号?",
          pinyin: "Bù hǎoyìsi, wǒ mǎshàng bāng nín kànkan. Qǐngwèn nín de fángjiān shì duōshao hào?",
          ko: "죄송합니다, 바로 확인해 드릴게요. 방 번호가 어떻게 되세요?",
          en: "I'm sorry about that, I'll take a look right away. What's your room number?",
        },
        choices: [{ id: "num", line: { zh: "三零八。", pinyin: "Sān líng bā.", ko: "308호요.", en: "308." }, next: "password" }],
      },
      password: {
        id: "password",
        aiLine: {
          zh: "好的,Wi-Fi密码是fangjian308,您再试一下。",
          pinyin: "Hǎo de, Wi-Fi mìmǎ shì fangjian308, nín zài shì yíxià.",
          ko: "네, 와이파이 비밀번호는 fangjian308이에요, 다시 시도해보세요.",
          en: "Sure, the Wi-Fi password is fangjian308 — please try again.",
        },
        choices: [
          {
            id: "retry",
            line: {
              zh: "好,我再试试。可以了,谢谢。",
              pinyin: "Hǎo, wǒ zài shìshi. Kěyǐ le, xièxie.",
              ko: "네, 다시 해볼게요. 됐어요, 감사합니다.",
              en: "Okay, let me try again. It's working now, thank you.",
            },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "不客气,还有什么问题,可以随时联系我们。",
          pinyin: "Bú kèqi, hái yǒu shénme wèntí, kěyǐ suíshí liánxì wǒmen.",
          ko: "아니에요, 또 문제 있으면 언제든 연락 주세요.",
          en: "You're welcome — if anything else comes up, feel free to contact us anytime.",
        },
        choices: [],
      },
    },
  },
  {
    slug: "car-rental",
    icon: Car,
    ko: { title: "렌터카 빌리기" },
    en: { title: "Renting a Car" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["days"], ["insurance"], ["license"], ["closing"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "rent",
            line: { zh: "你好,我想租一辆车。", pinyin: "Nǐ hǎo, wǒ xiǎng zū yí liàng chē.", ko: "안녕하세요, 차 한 대 빌리고 싶어요.", en: "Hi, I'd like to rent a car." },
            next: "days",
          },
        ],
      },
      days: {
        id: "days",
        aiLine: { zh: "好的,您想租几天?", pinyin: "Hǎo de, nín xiǎng zū jǐ tiān?", ko: "네, 며칠 빌리실 거예요?", en: "Sure, how many days would you like it for?" },
        choices: [
          { id: "three", line: { zh: "三天。", pinyin: "Sān tiān.", ko: "3일이요.", en: "Three days." }, next: "insurance" },
          { id: "week", line: { zh: "一个星期。", pinyin: "Yí ge xīngqī.", ko: "일주일이요.", en: "A week." }, next: "insurance" },
        ],
      },
      insurance: {
        id: "insurance",
        aiLine: {
          zh: "好的,您需要买保险吗?",
          pinyin: "Hǎo de, nín xūyào mǎi bǎoxiǎn ma?",
          ko: "네, 보험 드시겠어요?",
          en: "Got it — would you like to add insurance?",
        },
        choices: [{ id: "yes", line: { zh: "需要,谢谢。", pinyin: "Xūyào, xièxie.", ko: "네, 들게요, 감사합니다.", en: "Yes, please." }, next: "license" }],
      },
      license: {
        id: "license",
        aiLine: {
          zh: "请出示一下您的驾照。",
          pinyin: "Qǐng chūshì yíxià nín de jiàzhào.",
          ko: "운전면허증 좀 보여주시겠어요?",
          en: "Could I see your driver's license?",
        },
        choices: [{ id: "here", line: { zh: "这里。", pinyin: "Zhèlǐ.", ko: "여기요.", en: "Here you go." }, next: "closing" }],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "好的,手续都办好了。祝您一路平安。",
          pinyin: "Hǎo de, shǒuxù dōu bàn hǎo le. Zhù nín yílù píng'ān.",
          ko: "네, 수속 다 됐어요. 가시는 길 평안하세요.",
          en: "Great, everything's all set. Safe travels.",
        },
        choices: [{ id: "bye", line: { zh: "谢谢,再见。", pinyin: "Xièxie, zàijiàn.", ko: "감사합니다.", en: "Thank you." }, next: "end" }],
      },
    },
  },
  {
    slug: "lost-directions",
    icon: Signpost,
    ko: { title: "길 잃었을 때 길 묻기" },
    en: { title: "Asking a Passerby for Directions When Lost" },
    totalSteps: 5,
    stepIndex: makeStepIndex([["start"], ["howLong"], ["nearby"], ["closing"], ["closing2"]]),
    dialogue: {
      start: {
        id: "start",
        aiLine: null,
        choices: [
          {
            id: "ask",
            line: {
              zh: "不好意思,请问地铁站怎么走?",
              pinyin: "Bù hǎoyìsi, qǐngwèn dìtiězhàn zěnme zǒu?",
              ko: "실례합니다, 지하철역 어떻게 가요?",
              en: "Excuse me, how do I get to the subway station?",
            },
            next: "howLong",
          },
        ],
      },
      howLong: {
        id: "howLong",
        aiLine: {
          zh: "一直往前走,过了红绿灯就到了。",
          pinyin: "Yìzhí wǎng qián zǒu, guò le hónglǜdēng jiù dào le.",
          ko: "쭉 앞으로 가시면, 신호등 지나면 바로예요.",
          en: "Just keep going straight — once you pass the traffic light, you're there.",
        },
        choices: [
          {
            id: "howlong",
            line: { zh: "大概要走多长时间?", pinyin: "Dàgài yào zǒu duō cháng shíjiān?", ko: "대략 얼마나 걸어야 해요?", en: "About how long is the walk?" },
            next: "nearby",
          },
        ],
      },
      nearby: {
        id: "nearby",
        aiLine: { zh: "大概五分钟左右。", pinyin: "Dàgài wǔ fēnzhōng zuǒyòu.", ko: "대략 5분 정도요.", en: "About five minutes or so." },
        choices: [
          {
            id: "store",
            line: { zh: "那儿附近有便利店吗?", pinyin: "Nàr fùjìn yǒu biànlìdiàn ma?", ko: "그쪽 근처에 편의점 있어요?", en: "Is there a convenience store around there?" },
            next: "closing",
          },
        ],
      },
      closing: {
        id: "closing",
        aiLine: {
          zh: "有,就在地铁站旁边。",
          pinyin: "Yǒu, jiù zài dìtiězhàn pángbiān.",
          ko: "네, 지하철역 바로 옆에 있어요.",
          en: "Yes, right next to the subway station.",
        },
        choices: [
          {
            id: "thanks",
            line: { zh: "谢谢你,帮了我大忙。", pinyin: "Xièxie nǐ, bāng le wǒ dà máng.", ko: "감사합니다, 큰 도움이 됐어요.", en: "Thank you, you've been a huge help." },
            next: "closing2",
          },
        ],
      },
      closing2: {
        id: "closing2",
        aiLine: { zh: "不客气。", pinyin: "Bú kèqi.", ko: "아니에요.", en: "You're welcome." },
        choices: [],
      },
    },
  },
];
