/**
 * Design philosophy — 언어의 결: contemporary editorial learning space with a warm paper ground,
 * ink conversation canvases, restrained dialogue-burgundy actions, and an asymmetric note rail.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bike,
  BookOpenCheck,
  BrainCircuit,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardList,
  Coffee,
  Compass,
  CookingPot,
  DoorOpen,
  Dumbbell,
  FileText,
  Flame,
  Gift,
  HandCoins,
  HandHeart,
  Headphones,
  Hotel,
  KeyRound,
  Landmark,
  Lock,
  MapPinned,
  Menu,
  MessageCircleMore,
  MessageSquareWarning,
  MessagesSquare,
  PackageOpen,
  PackageSearch,
  Phone,
  PlaneTakeoff,
  Quote,
  Receipt,
  RotateCcw,
  Route,
  Scale,
  Scissors,
  ShoppingBag,
  Signpost,
  Sparkles,
  Star,
  Stethoscope,
  Shirt,
  Store,
  Ticket,
  Truck,
  Undo2,
  UserRound,
  Wine,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

import { WaitlistDialog } from "@/components/WaitlistDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitLead } from "@/lib/api";

const HERO_IMAGE = "/images/hero-editorial.jpg";
const CAFE_IMAGE = "/images/cafe-scene.jpg";
const STORY_IMAGE = "/images/story-archive.jpg";
const BRAND_MARK = "/brand-mark.svg";

const navItems = [
  { href: "#about", ko: "커짠 소개", en: "About KEZHAN" },
  { href: "#practice", ko: "학습 방식", en: "How It Works" },
  { href: "#expressions", ko: "현지 표현", en: "Local Phrases" },
  { href: "#how", ko: "이용 안내", en: "Getting Started" },
  { href: "#faq", ko: "자주 묻는 질문", en: "FAQ" },
];

const scenarioThemes = [
  {
    key: "gourmet",
    ko: { name: "미식채", tag: "식사" },
    en: { name: "Gourmet Wing", tag: "Dining" },
    scenarios: [
      {
        icon: Coffee,
        ko: { title: "카페 주문", desc: "첫 주문을 자연스럽게 이어가기" },
        en: { title: "Ordering at a Cafe", desc: "Carry your first order naturally" },
      },
      {
        icon: MessageCircleMore,
        ko: { title: "식당 문제제기", desc: "불편한 상황을 부드럽게 설명하기" },
        en: { title: "Restaurant Complaint", desc: "Explain an issue gently" },
      },
      {
        icon: ClipboardList,
        ko: { title: "메뉴 추천 요청", desc: "직원에게 메뉴를 추천해달라고 요청하기" },
        en: { title: "Asking for a Recommendation", desc: "Ask staff to recommend a dish" },
      },
      {
        icon: Bike,
        ko: { title: "배달 음식 주문", desc: "전화나 앱으로 배달을 주문하기" },
        en: { title: "Ordering Delivery", desc: "Order delivery by phone or app" },
      },
      {
        icon: Flame,
        ko: { title: "알레르기·맵기 조절", desc: "못 먹는 음식과 맵기를 미리 말하기" },
        en: { title: "Allergies & Spice Level", desc: "State what you can't eat and how spicy, in advance" },
      },
      {
        icon: Receipt,
        ko: { title: "계산·나눠내기", desc: "계산 방식을 정하고 요청하기" },
        en: { title: "Paying & Splitting the Bill", desc: "Decide and request how to pay" },
      },
      {
        icon: PackageOpen,
        ko: { title: "포장 요청", desc: "남은 음식을 포장해달라고 말하기" },
        en: { title: "Asking for a To-Go Box", desc: "Ask to pack up the leftovers" },
      },
      {
        icon: Wine,
        ko: { title: "술자리 건배", desc: "건배와 술자리 예의를 표현하기" },
        en: { title: "A Toast at the Table", desc: "Express a toast and drinking manners" },
      },
      {
        icon: CookingPot,
        recent: true,
        ko: { title: "길거리 음식 구매", desc: "노점에서 간단히 주문하기" },
        en: { title: "Buying Street Food", desc: "Order simply at a street stall" },
      },
      {
        icon: CalendarClock,
        recent: true,
        ko: { title: "예약 확인·변경", desc: "식당 예약을 확인하고 바꾸기" },
        en: { title: "Confirming a Reservation", desc: "Check and change a restaurant booking" },
      },
    ],
  },
  {
    key: "journey",
    ko: { name: "여정채", tag: "교통·숙박" },
    en: { name: "Journey Wing", tag: "Transit & Stay" },
    scenarios: [
      {
        icon: MapPinned,
        ko: { title: "택시 목적지", desc: "목적지와 경로를 또렷하게 전하기" },
        en: { title: "Taxi Destination", desc: "State your destination and route clearly" },
      },
      {
        icon: Hotel,
        ko: { title: "호텔 체크인", desc: "도착부터 요청까지 침착하게 말하기" },
        en: { title: "Hotel Check-in", desc: "Speak calmly from arrival to requests" },
      },
      {
        icon: Signpost,
        ko: { title: "길 묻기", desc: "방향과 거리를 물어보기" },
        en: { title: "Asking for Directions", desc: "Ask about direction and distance" },
      },
      {
        icon: Ticket,
        ko: { title: "기차·버스표 구매", desc: "표를 사고 좌석을 확인하기" },
        en: { title: "Buying Train/Bus Tickets", desc: "Buy a ticket and confirm your seat" },
      },
      {
        icon: PlaneTakeoff,
        ko: { title: "공항 체크인", desc: "탑승 수속과 수하물을 안내받기" },
        en: { title: "Airport Check-in", desc: "Get guided through boarding and baggage" },
      },
      {
        icon: DoorOpen,
        ko: { title: "호텔 체크아웃", desc: "정산과 짐 보관을 요청하기" },
        en: { title: "Hotel Check-out", desc: "Request billing and luggage storage" },
      },
      {
        icon: MessageSquareWarning,
        ko: { title: "방 컴플레인", desc: "객실 문제를 정중히 알리기" },
        en: { title: "Room Complaint", desc: "Politely report a room issue" },
      },
      {
        icon: Bike,
        ko: { title: "렌터카·공유자전거", desc: "이용 방법을 물어보기" },
        en: { title: "Rental Car & Bike-share", desc: "Ask how to use the service" },
      },
      {
        icon: Route,
        recent: true,
        ko: { title: "환승·경유 안내", desc: "환승 방법을 확인하기" },
        en: { title: "Transfers & Layovers", desc: "Confirm how to transfer" },
      },
      {
        icon: PackageSearch,
        recent: true,
        ko: { title: "분실물 문의", desc: "잃어버린 물건을 찾기" },
        en: { title: "Lost & Found", desc: "Track down something you lost" },
      },
    ],
  },
  {
    key: "market",
    ko: { name: "상점채", tag: "쇼핑" },
    en: { name: "Market Wing", tag: "Shopping" },
    scenarios: [
      {
        icon: ShoppingBag,
        ko: { title: "쇼핑", desc: "가격과 옵션을 자연스럽게 묻기" },
        en: { title: "Shopping", desc: "Ask about price and options naturally" },
      },
      {
        icon: Shirt,
        ko: { title: "사이즈·색상 요청", desc: "원하는 사이즈나 색상을 찾기" },
        en: { title: "Size & Color Requests", desc: "Find the size or color you want" },
      },
      {
        icon: Undo2,
        ko: { title: "시착·환불 문의", desc: "입어보거나 교환·환불을 요청하기" },
        en: { title: "Trying On & Refunds", desc: "Try something on or request an exchange" },
      },
      {
        icon: HandCoins,
        ko: { title: "흥정하기", desc: "가격을 정중하게 흥정하기" },
        en: { title: "Bargaining", desc: "Negotiate a price politely" },
      },
      {
        icon: Gift,
        ko: { title: "면세·포장 요청", desc: "면세 절차와 선물 포장을 요청하기" },
        en: { title: "Tax-Free & Gift Wrap", desc: "Ask about duty-free steps and gift wrapping" },
      },
      {
        icon: Star,
        ko: { title: "기념품 추천 요청", desc: "현지에서 추천하는 기념품을 물어보기" },
        en: { title: "Souvenir Recommendations", desc: "Ask what locals recommend" },
      },
      {
        icon: Truck,
        ko: { title: "온라인 주문·배송 문의", desc: "배송 상태를 확인하기" },
        en: { title: "Online Orders & Shipping", desc: "Check on a delivery status" },
      },
      {
        icon: Receipt,
        ko: { title: "영수증·교환 규정", desc: "영수증과 교환 조건을 확인하기" },
        en: { title: "Receipts & Return Policy", desc: "Confirm the receipt and return terms" },
      },
      {
        icon: Scale,
        recent: true,
        ko: { title: "시장에서 무게 재기", desc: "시장에서 수량과 무게를 말하기" },
        en: { title: "Weighing Goods at a Market", desc: "State quantity and weight at a market" },
      },
      {
        icon: Store,
        recent: true,
        ko: { title: "매장 위치 문의", desc: "찾는 매장이나 코너를 물어보기" },
        en: { title: "Finding a Store", desc: "Ask where a shop or section is" },
      },
    ],
  },
  {
    key: "village",
    ko: { name: "마을채", tag: "생활·건강" },
    en: { name: "Village Wing", tag: "Daily Life & Health" },
    scenarios: [
      {
        icon: UserRound,
        ko: { title: "자기소개", desc: "나를 자연스럽게 소개하기" },
        en: { title: "Introducing Yourself", desc: "Introduce yourself naturally" },
      },
      {
        icon: Phone,
        ko: { title: "전화 예약", desc: "필요한 용건을 정확히 전하기" },
        en: { title: "Booking by Phone", desc: "State exactly what you need" },
      },
      {
        icon: MessagesSquare,
        ko: { title: "가벼운 잡담", desc: "일상적인 대화를 이어가기" },
        en: { title: "Small Talk", desc: "Keep an everyday conversation going" },
      },
      {
        icon: AlertTriangle,
        ko: { title: "긴급 상황", desc: "도움이 필요할 때 침착하게 말하기" },
        en: { title: "Emergencies", desc: "Speak calmly when you need help" },
      },
      {
        icon: Stethoscope,
        ko: { title: "병원·약국 이용", desc: "증상을 설명하고 약을 요청하기" },
        en: { title: "Clinic & Pharmacy", desc: "Describe symptoms and ask for medicine" },
      },
      {
        icon: Landmark,
        ko: { title: "은행·환전", desc: "환전이나 계좌 관련 용무 보기" },
        en: { title: "Bank & Currency Exchange", desc: "Handle exchange or account matters" },
      },
      {
        icon: KeyRound,
        ko: { title: "부동산·집 구하기", desc: "집을 구하거나 계약 조건을 묻기" },
        en: { title: "Finding Housing", desc: "Look for a place or ask about lease terms" },
      },
      {
        icon: HandHeart,
        ko: { title: "이웃과 인사", desc: "이웃과 가볍게 인사 나누기" },
        en: { title: "Greeting Neighbors", desc: "Exchange a light greeting with a neighbor" },
      },
      {
        icon: Scissors,
        recent: true,
        ko: { title: "미용실·이발소", desc: "원하는 스타일을 설명하기" },
        en: { title: "Hair Salon & Barber", desc: "Describe the style you want" },
      },
      {
        icon: Dumbbell,
        recent: true,
        ko: { title: "헬스장·취미 등록", desc: "등록 방법과 이용 규칙을 묻기" },
        en: { title: "Gym & Hobby Sign-up", desc: "Ask how to register and the rules" },
      },
    ],
  },
  {
    key: "secret",
    ko: { name: "비밀채", tag: "확장 예정" },
    en: { name: "Secret Wing", tag: "Coming Soon" },
    locked: true,
    scenarios: [],
  },
];

const comparisons = [
  {
    icon: "☕",
    situation: { ko: "카페 주문", en: "Ordering coffee" },
    textbook: "我要一杯咖啡。",
    textbookPinyin: "Wǒ yào yī bēi kāfēi.",
    local: "来一杯咖啡吧。",
    localPinyin: "Lái yī bēi kāfēi ba.",
    note: {
      ko: "‘要’보다 ‘来’를 쓰고, ‘吧’로 말끝을 부드럽게 만듭니다.",
      en: "Use ‘来’ instead of ‘要’, and soften the ending with ‘吧’.",
    },
  },
  {
    icon: "🥢",
    situation: { ko: "식당 문제", en: "A restaurant issue" },
    textbook: "服务员，我的菜不对。",
    textbookPinyin: "Fúwùyuán, wǒ de cài bú duì.",
    local: "服务员，你好，我的菜点错了。",
    localPinyin: "Fúwùyuán, nǐ hǎo, wǒ de cài diǎn cuò le.",
    note: {
      ko: "인사말과 ‘点错了’ 같은 완곡한 표현을 함께 씁니다.",
      en: "Pair a greeting with a softer phrase like ‘点错了’.",
    },
  },
  {
    icon: "🚕",
    situation: { ko: "택시 목적지", en: "A taxi destination" },
    textbook: "我想去人民广场。",
    textbookPinyin: "Wǒ xiǎng qù rénmín guǎngchǎng.",
    local: "师傅，我是要去人民广场。能走那条路吗？",
    localPinyin: "Shīfu, wǒ shì yào qù rénmín guǎngchǎng. Néng zǒu nà tiáo lù ma?",
    note: {
      ko: "‘师傅’ 호칭을 더하고, 경로 요청까지 대화를 확장합니다.",
      en: "Add the term ‘师傅’, and extend the exchange to include the route.",
    },
  },
];

const researchCards = [
  {
    value: "226",
    ko: "표현 괴리를 다룬 언어교육 연구 표본",
    en: "Study sample on the expression gap",
  },
  {
    value: "162",
    ko: "말하기 불안을 살핀 학습자 연구 표본",
    en: "Study sample on learner speaking anxiety",
  },
  {
    value: "69",
    ko: "VR 기반 회화 훈련 관련 연구 표본",
    en: "Study sample on VR-based conversation training",
  },
  {
    value: "39",
    ko: "AI 음성 데이터 기반 평가 연구 표본",
    en: "Study sample on AI voice-data assessment",
  },
];

const researchSources = [
  {
    year: "2013",
    ko: { source: "국내 언어교육 연구", focus: "교재 표현과 현지 표현 사이의 거리" },
    en: {
      source: "Domestic language-education research",
      focus: "The distance between textbook and local expressions",
    },
  },
  {
    year: "2017",
    ko: { source: "SAGE Journals", focus: "말하기 불안과 의사소통 의지의 관계" },
    en: {
      source: "SAGE Journals",
      focus: "The relationship between speaking anxiety and willingness to communicate",
    },
  },
  {
    year: "2022",
    ko: { source: "한국교원대학교", focus: "VR 학습 환경의 몰입 경험" },
    en: {
      source: "Korea National University of Education",
      focus: "Immersive experience in VR learning environments",
    },
  },
  {
    year: "2025",
    ko: { source: "AI Hub", focus: "한국인 중국어 학습자 음성 데이터 기반 자동평가" },
    en: {
      source: "AI Hub",
      focus: "Automated assessment based on voice data from Korean learners of Chinese",
    },
  },
];

const steps = [
  {
    no: "01",
    icon: Sparkles,
    ko: { title: "가입하기", text: "간단한 정보로 학습 공간을 엽니다." },
    en: { title: "Sign Up", text: "Open your learning space with a few details." },
  },
  {
    no: "02",
    icon: Compass,
    ko: { title: "레벨 테스트", text: "짧은 대화로 현재 말하기 수준을 확인합니다." },
    en: { title: "Level Test", text: "Check your current speaking level in a short chat." },
  },
  {
    no: "03",
    icon: BookOpenCheck,
    ko: { title: "시나리오 선택", text: "오늘 필요한 실제 상황을 골라봅니다." },
    en: { title: "Pick a Scenario", text: "Choose the real situation you need today." },
  },
  {
    no: "04",
    icon: Headphones,
    ko: { title: "AI와 대화 연습", text: "부담 없이 여러 번 말해볼 수 있습니다." },
    en: { title: "Practice with AI", text: "Speak it out as many times as you like, no pressure." },
  },
  {
    no: "05",
    icon: FileText,
    ko: { title: "피드백 리포트", text: "상황에 맞는 다음 연습 지점을 확인합니다." },
    en: { title: "Feedback Report", text: "See what to practice next for that situation." },
  },
];

const cycleSteps = [
  {
    no: "①",
    icon: Compass,
    ko: { title: "오늘의 상황 정하기", text: "지금 나에게 필요한 대화 하나를 골라 시작합니다." },
    en: { title: "Pick Today's Situation", text: "Start by choosing one conversation you need right now." },
  },
  {
    no: "②",
    icon: Headphones,
    ko: { title: "AI와 대화하기", text: "부담 없이 여러 번 실제처럼 말해봅니다." },
    en: { title: "Talk with AI", text: "Speak it out, realistically, as many times as you need." },
  },
  {
    no: "③",
    icon: BrainCircuit,
    ko: { title: "피드백 확인하기", text: "발음·표현·현지 말투에서 다듬을 지점을 짚어줍니다." },
    en: { title: "Check Feedback", text: "See what to refine in pronunciation, phrasing, and local tone." },
  },
  {
    no: "④",
    icon: RotateCcw,
    ko: { title: "약한 지점 다시 연습하기", text: "짚어준 부분만 짧게, 다시 소리 내어 말해봅니다." },
    en: { title: "Redo the Weak Spot", text: "Say just the flagged part out loud again, briefly." },
  },
];

const faqs = [
  {
    ko: {
      q: "교과서 중국어랑 커짠이 배우는 중국어는 무엇이 다른가요?",
      a: "커짠은 교과서 문장 대신 카페·식당·택시 같은 실제 상황에서 현지인이 자주 사용하는 표현을 중심으로 연습합니다.",
    },
    en: {
      q: "How is the Chinese I learn on KEZHAN different from textbook Chinese?",
      a: "Instead of textbook sentences, KEZHAN focuses on expressions locals actually use in real situations — cafes, restaurants, taxis, and more.",
    },
  },
  {
    ko: {
      q: "AI가 발음을 정확하게 평가해주나요?",
      a: "AI는 발음·어휘·문법·유창성·상황 적합성·현지 표현 사용도를 바탕으로 피드백을 제공합니다. 절대적인 채점이라기보다, 부족한 부분을 스스로 확인하고 연습하는 도구로 활용해주세요.",
    },
    en: {
      q: "Does the AI accurately evaluate my pronunciation?",
      a: "The AI gives feedback based on pronunciation, vocabulary, grammar, fluency, situational fit, and use of local expressions. Think of it less as an absolute grade and more as a tool for spotting and practicing what needs work.",
    },
  },
  {
    ko: {
      q: "중국어를 하나도 모르는 왕초보도 가능한가요?",
      a: "레벨 테스트로 현재 실력을 먼저 확인하므로 학습 경험이 많지 않아도 본인 수준에 맞춰 시작할 수 있습니다. 다만 문법을 처음부터 체계적으로 배우고 싶다면 기초 문법 학습을 병행하시길 권합니다.",
    },
    en: {
      q: "Can complete beginners use it?",
      a: "The level test checks where you stand first, so you can start at your own level even with little experience. That said, if you want to learn grammar systematically from scratch, we recommend pairing this with a basic grammar course.",
    },
  },
  {
    ko: {
      q: "어떤 상황을 연습할 수 있나요?",
      a: "카페 주문, 식당 문제 상황, 택시 목적지 안내, 호텔 체크인, 쇼핑 등 다양한 실전 상황을 준비하고 있습니다.",
    },
    en: {
      q: "What situations can I practice?",
      a: "We're preparing a wide range of real-world situations — ordering at a cafe, handling a restaurant issue, giving a taxi destination, hotel check-in, shopping, and more.",
    },
  },
  {
    ko: {
      q: "여행이나 출장 갈 때 필요한 회화도 연습할 수 있나요?",
      a: "택시·호텔·쇼핑 등 여행과 출장에서 자주 마주치는 상황을 담아, 출국 전에 미리 대화를 연습할 수 있도록 구성했습니다.",
    },
    en: {
      q: "Can I practice conversations I'd need for travel or business trips?",
      a: "We've built in situations you'll often run into while traveling or on business — taxis, hotels, shopping — so you can practice before you even leave.",
    },
  },
  {
    ko: {
      q: "화상수업이나 전화중국어와는 무엇이 다른가요?",
      a: "화상·전화 중국어가 정해진 시간에 사람 강사와 연결되는 방식이라면, 커짠은 원하는 시간에 AI와 반복 연습하는 방식입니다.",
    },
    en: {
      q: "How is this different from video or phone Chinese lessons?",
      a: "Video and phone lessons connect you with a human teacher at a set time. KEZHAN lets you repeat practice with AI whenever you want.",
    },
  },
  {
    ko: {
      q: "무료로 먼저 체험해볼 수 있나요?",
      a: "네. 정식 요금제를 공개하기 전, 무료 체험으로 커짠의 학습 방식을 먼저 경험할 수 있도록 준비하고 있습니다.",
    },
    en: {
      q: "Can I try it for free first?",
      a: "Yes. Before we launch official pricing, we're setting up a free trial so you can experience how KEZHAN works first.",
    },
  },
  {
    ko: {
      q: "요금제는 어떻게 되나요?",
      a: "정식 요금제는 준비 중이며, 확정되는 대로 안내드리겠습니다.",
    },
    en: {
      q: "What will pricing look like?",
      a: "Official pricing is still being worked out — we'll let you know as soon as it's finalized.",
    },
  },
];

const goodFitList = [
  {
    ko: "문법과 기본 표현은 알지만 실전에서 말이 잘 안 나오는 학습자",
    en: "A learner who knows grammar and basic expressions but struggles to speak in real situations",
  },
  {
    ko: "교과서 중국어와 현지 표현의 차이가 궁금한 학습자",
    en: "Curious about the gap between textbook Chinese and how locals actually speak",
  },
  {
    ko: "중국 여행·출장 전 실전 대화를 미리 연습하고 싶은 분",
    en: "Preparing for travel or business in China and want to practice real conversations beforehand",
  },
  {
    ko: "사람 앞에서 말하기에 부담을 느껴 AI와 먼저 연습해보고 싶은 분",
    en: "Feel pressure speaking in front of a person and want to practice with AI first",
  },
  {
    ko: "정해진 시간표 없이 스스로 반복 연습하고 싶은 분",
    en: "Want to repeat practice on your own schedule, with no fixed timetable",
  },
];

const otherFitList = [
  {
    ko: {
      strong: "문법을 처음부터 체계적으로 배우고 싶다면",
      rest: "기초 문법 강의와 병행하는 것이 도움이 될 수 있습니다.",
    },
    en: {
      strong: "If you want to learn grammar systematically from the start,",
      rest: "pairing this with a basic grammar course may help.",
    },
  },
  {
    ko: {
      strong: "HSK 등 공인 시험 대비가 목적이라면",
      rest: "커짠은 시험 대비보다 실전 회화에 초점을 둡니다.",
    },
    en: {
      strong: "If your goal is an official exam like the HSK,",
      rest: "KEZHAN focuses on real conversation rather than exam prep.",
    },
  },
  {
    ko: {
      strong: "정기적인 대면·화상 수업을 원한다면",
      rest: "사람 강사와의 수업 방식이 더 적합할 수 있습니다.",
    },
    en: {
      strong: "If you want regular in-person or video classes,",
      rest: "a human-teacher format may suit you better.",
    },
  },
  {
    ko: {
      strong: "인터넷이나 음성 인식 환경이 불안정하다면",
      rest: "이용에 제약이 있을 수 있습니다.",
    },
    en: {
      strong: "If your internet or voice-recognition environment is unstable,",
      rest: "you may run into some limitations.",
    },
  },
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionIntro({
  index,
  eyebrow,
  title,
  text,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  text?: string;
}) {
  return (
    <div className="section-intro">
      <div className="section-rail">
        <div className="section-index">{index}</div>
        <img className="section-seal" src={BRAND_MARK} alt="" />
      </div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {text && <p className="section-description">{text}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const { lang, toggleLang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState<"trial" | "diagnostic">("trial");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [openTheme, setOpenTheme] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTrial = () => {
    setWaitlistSource("trial");
    setWaitlistOpen(true);
  };

  const handleDiagnostic = () => {
    setWaitlistSource("diagnostic");
    setWaitlistOpen(true);
  };

  const handleContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);

    setContactSubmitting(true);
    try {
      await submitLead({
        type: "contact",
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        inquiryType: String(data.get("inquiryType") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      setContactSubmitted(true);
      form.reset();
    } catch {
      toast(t("문의 접수에 실패했습니다.", "Failed to send your message."), {
        description: t("잠시 후 다시 시도해주세요.", "Please try again in a moment."),
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  const reveal = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.ko.q,
      acceptedAnswer: { "@type": "Answer", text: faq.ko.a },
    })),
  };

  const dialogTheme = openTheme !== null ? scenarioThemes[openTheme] : null;
  const recentScenarios = scenarioThemes.flatMap(theme =>
    theme.locked
      ? []
      : theme.scenarios
          .filter(scenario => scenario.recent)
          .map(scenario => ({ ...scenario, theme }))
  );

  return (
    <div className="site-shell">
      <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a
          className="brand"
          href="#top"
          aria-label={t("커짠 첫 화면으로 이동", "Go to KEZHAN home")}
          onClick={() => setMenuOpen(false)}
        >
          <img className="brand-mark" src={BRAND_MARK} alt="" />
          <span className="brand-wordmark">KEZHAN</span>
          <span className="brand-korean">커짠</span>
        </a>
        <nav className="desktop-nav" aria-label={t("주요 메뉴", "Main menu")}>
          {navItems.map(item => (
            <a key={item.href} href={item.href}>
              {t(item.ko, item.en)}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLang}
          aria-label={t("영어로 보기", "View in Korean")}
        >
          {lang === "ko" ? "EN" : "KO"}
        </button>
        <button className="header-cta" onClick={handleTrial}>
          {t("무료 체험", "Free Trial")}
        </button>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(open => !open)}
          aria-label={t("메뉴 열기", "Open menu")}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              aria-label={t("모바일 주요 메뉴", "Mobile menu")}
            >
              {navItems.map(item => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  {t(item.ko, item.en)}
                  <ArrowRight size={17} />
                </a>
              ))}
              <button
                type="button"
                className="mobile-lang-toggle"
                onClick={toggleLang}
              >
                {lang === "ko" ? "View in English" : "한국어로 보기"}
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleTrial();
                }}
              >
                {t("무료 체험 알림 받기", "Notify Me for Free Trial")}
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-image-layer" style={{ backgroundImage: `url(${HERO_IMAGE})` }} />
          <div className="hero-grain" />
          <div className="hero-content page-frame">
            <motion.div {...reveal} className="hero-copy">
              <div className="hero-note">
                <span>01</span> REAL-LIFE CHINESE, AT YOUR PACE
              </div>
              <h1 id="hero-heading">
                {lang === "ko" ? (
                  <>
                    중국어를 배웠는데,
                    <br />
                    <em>왜 실제 말하기가</em>
                    <br />
                    어려울까요?
                  </>
                ) : (
                  <>
                    You studied Chinese,
                    <br />
                    <em>so why is speaking</em>
                    <br />
                    still so hard?
                  </>
                )}
              </h1>
              <div className="hero-language-note">
                <img src={BRAND_MARK} alt="" />
                <div>
                  <span>CONVERSATION NOTE</span>
                  <strong>
                    {t(
                      "“오늘은 한 문장부터, 실제처럼.”",
                      "“Start today with one real sentence.”"
                    )}
                  </strong>
                </div>
                <i />
              </div>
              <p>
                {t(
                  "교과서 중국어를 넘어, 가상환경 기반 AI와 생활중국어 표현을 연습하는 중국어회화 플랫폼",
                  "Beyond textbook Chinese — practice real, everyday expressions with an AI conversation platform built on a virtual environment."
                )}
              </p>
              <div className="hero-actions">
                <button className="button button-solid" onClick={handleTrial}>
                  {t("AI 회화 무료 체험하기", "Try AI Conversation Free")} <ArrowDownRight size={18} />
                </button>
                <button className="button button-ghost" onClick={handleDiagnostic}>
                  {t("내 중국어 실력 진단받기", "Get My Chinese Level Test")} <ArrowRight size={18} />
                </button>
              </div>
              <small>
                {t(
                  "가볍게 시작해보고, 필요한 때 반복해보세요.",
                  "Start light, and repeat whenever you need to."
                )}
              </small>
            </motion.div>
            <motion.div
              {...reveal}
              transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.6 }}
              className="hero-side-note"
            >
              <span>{t("오늘의 대화", "Today's Line")}</span>
              <strong>“来一杯咖啡吧。”</strong>
              <p>Lái yī bēi kāfēi ba.</p>
            </motion.div>
          </div>
          <button
            className="hero-scroll"
            onClick={() => scrollTo("#about")}
            aria-label={t("커짠 소개로 이동", "Go to About KEZHAN")}
          >
            <span>SCROLL TO LISTEN</span>
            <ArrowDownRight size={18} />
          </button>
        </section>

        <section id="about" className="section problem-section">
          <div className="page-frame rail-layout">
            <motion.div {...reveal}>
              <SectionIntro
                index="02"
                eyebrow="WHY KEZHAN"
                title={
                  lang === "ko" ? (
                    <>
                      알고 있는 문장과,
                      <br />
                      입 밖으로 나오는
                      <br />
                      문장 사이.
                    </>
                  ) : (
                    <>
                      Between the sentence
                      <br />
                      you know
                      <br />
                      and the one you say.
                    </>
                  )
                }
              />
            </motion.div>
            <motion.div {...reveal} className="problem-content">
              <p className="lead-copy">
                {t(
                  "문법과 교과서 문장은 알지만, 실제 중국인과 대화하는 순간에는 배운 중국어가 자연스럽게 나오지 않을 때가 있습니다.",
                  "You know the grammar and textbook sentences, but the moment you're actually talking with a Chinese speaker, what you've learned doesn't always come out naturally."
                )}
              </p>
              <div className="problem-list">
                <article>
                  <span>01</span>
                  <h3>{t("교재 표현과 현지 표현의 괴리", "The gap between textbook and local speech")}</h3>
                  <p>
                    {t(
                      "상황에 꼭 맞는 어조와 말끝은, 암기한 한 문장보다 한 번 더 실제로 말해보며 익힐 수 있습니다.",
                      "The right tone for a situation comes less from memorizing one sentence than from actually saying it out loud, once more."
                    )}
                  </p>
                </article>
                <article>
                  <span>02</span>
                  <h3>{t("말하기 불안과 실전 기회의 부족", "Speaking anxiety and too few real chances")}</h3>
                  <p>
                    {t(
                      "사람 앞에서 바로 말하기 부담스러운 순간에도, AI와 먼저 대화를 꺼내볼 수 있습니다.",
                      "Even when speaking up in front of someone feels like too much, you can try the conversation with AI first."
                    )}
                  </p>
                </article>
                <article>
                  <span>03</span>
                  <h3>{t("내 실력을 가늠하기 어려움", "Hard to know where you actually stand")}</h3>
                  <p>
                    {t(
                      "현재 수준과 필요한 연습을 확인하고, 나에게 맞는 대화 상황부터 시작해볼 수 있습니다.",
                      "Check your current level and what you need to practice, then start with the conversation that fits you."
                    )}
                  </p>
                </article>
              </div>
              <p className="margin-note">
                {t(
                  "말을 잘하기 위한 첫 단계는, 말해보는 경험을 만드는 일입니다.",
                  "The first step to speaking well is simply creating the experience of speaking."
                )}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="section story-section">
          <div className="page-frame story-grid">
            <motion.div {...reveal} className="story-visual-wrap">
              <img
                src={STORY_IMAGE}
                alt={t(
                  "언어 교육 현장 경험을 상징하는 노트와 아카이브 오브제",
                  "A notebook and archival objects symbolizing hands-on language teaching experience"
                )}
                className="story-visual"
              />
              <div className="story-stamp">
                SINCE
                <br />
                <b>2004</b>
              </div>
            </motion.div>
            <motion.div {...reveal} className="story-copy">
              <SectionIntro
                index="03"
                eyebrow="OUR STORY"
                title={
                  lang === "ko" ? (
                    <>
                      20여 년의 현장 경험에서,
                      <br />한 가지 질문이 시작됐습니다.
                    </>
                  ) : (
                    <>
                      From 20-plus years in the field,
                      <br />
                      one question began.
                    </>
                  )
                }
              />
              <blockquote>
                {t(
                  "“왜 중국어를 오래 공부해도 중국 현지에서는 말이 잘 나오지 않을까?”",
                  "“Why doesn't the Chinese come out, even after studying it for so long, once you're actually in China?”"
                )}
              </blockquote>
              <p>
                {t(
                  "중국에서 나고 자라 현지 대학까지 마친 창립자는 2004년 한국에서 중국어 강사로 시작했습니다. 통역사와 중국 현지 유치원 강사로 오랜 시간을 보내며, 학습자가 현실의 대화 앞에서 잠시 멈추는 순간을 반복해서 마주했습니다.",
                  "Born and raised in China through university, our founder started teaching Chinese in Korea in 2004. Across years as an interpreter and a kindergarten teacher in China, they kept meeting the same moment — a learner pausing right in front of a real conversation."
                )}
              </p>
              <p>
                {t(
                  "커짠은 그 간격을 줄이기 위해, 오늘 바로 마주칠 수 있는 상황을 대화로 연습하는 곳입니다.",
                  "KEZHAN exists to close that gap — a place to practice, as conversation, the situations you could run into today."
                )}
              </p>
              <button className="text-link" onClick={() => scrollTo("#practice")}>
                {t("어떤 대화를 연습하는지 보기", "See what conversations you'll practice")} <ArrowRight size={17} />
              </button>
            </motion.div>
          </div>
        </section>

        <section id="practice" className="section practice-section">
          <div className="page-frame">
            <motion.div {...reveal} className="practice-head">
              <SectionIntro
                index="04"
                eyebrow="PRACTICE IN CONTEXT"
                title={
                  lang === "ko" ? (
                    <>
                      외우는 중국어가 아니라,
                      <br />
                      대화하는 중국어.
                    </>
                  ) : (
                    <>
                      Not Chinese you memorize —
                      <br />
                      Chinese you actually speak.
                    </>
                  )
                }
                text={t(
                  "커짠의 핵심은 AI와 나누는 실전 대화입니다. 일상에서 실제로 마주할 수 있는 장면을 그대로 재현합니다.",
                  "At the heart of KEZHAN is real conversation with AI. We recreate scenes you could genuinely run into in everyday life."
                )}
              />
              <div className="practice-quote">
                <span>{t("AI 피드백", "AI Feedback")}</span>
                <p>
                  {t(
                    "“그 상황에서는 이렇게 말하면 더 자연스러워요.”",
                    "“In that situation, saying it this way sounds more natural.”"
                  )}
                </p>
              </div>
            </motion.div>
            <div className="scenario-layout">
              <motion.figure {...reveal} className="scenario-feature">
                <img
                  src={CAFE_IMAGE}
                  alt={t(
                    "카페에서 AI와 중국어 주문 회화를 연습하는 장면",
                    "A scene practicing a Chinese cafe order with AI"
                  )}
                />
                <figcaption>
                  <span>SCENE 01</span>
                  <strong>{t("카페에서 주문하기", "Ordering at a Cafe")}</strong>
                  <small>
                    {t(
                      "단어 하나가 아니라, 주문을 이어가는 흐름을 연습합니다.",
                      "Not just one word — practice the flow of carrying an order through."
                    )}
                  </small>
                </figcaption>
              </motion.figure>
              <motion.div {...reveal} className="scenario-list">
                <div className="theme-tabs">
                  {scenarioThemes.map((theme, index) => (
                    <button
                      key={theme.key}
                      className={`theme-tab ${theme.locked ? "locked" : ""}`}
                      onClick={() => setOpenTheme(index)}
                    >
                      {theme.locked && <Lock size={12} />}
                      <span className="theme-tab-name">{t(theme.ko.name, theme.en.name)}</span>
                      <span className="theme-tab-tag">{t(theme.ko.tag, theme.en.tag)}</span>
                      {!theme.locked && (
                        <ArrowUpRight size={12} className="theme-tab-open-icon" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="recent-scenarios-head">
                  <span>
                    <Sparkles size={12} />
                    {t("최근 업데이트", "Recently Added")}
                  </span>
                  <p>
                    {t(
                      "채를 클릭하면 전체 목록이 새 창에서 열립니다.",
                      "Click a wing to open its full list in a new window."
                    )}
                  </p>
                </div>
                <div className="scenario-rows">
                  {recentScenarios.map((scenario, index) => {
                    const Icon = scenario.icon;
                    return (
                      <button
                        key={`${scenario.theme.key}-${scenario.ko.title}`}
                        className="scenario-row"
                        onClick={handleTrial}
                      >
                        <span className="scenario-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon size={20} />
                        <span>
                          <strong>{t(scenario.ko.title, scenario.en.title)}</strong>
                          <small>
                            {t(scenario.theme.ko.name, scenario.theme.en.name)} ·{" "}
                            {t(scenario.ko.desc, scenario.en.desc)}
                          </small>
                        </span>
                        <ArrowRight size={19} />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            <motion.div {...reveal} className="feedback-panel">
              <div className="feedback-panel-icon">
                <BrainCircuit size={30} />
              </div>
              <div>
                <p className="eyebrow">AFTER THE CONVERSATION</p>
                <h3>
                  {t(
                    "대화가 끝나면, 그 장면 안에서 다시 봅니다.",
                    "When the conversation ends, you revisit it in the same scene."
                  )}
                </h3>
              </div>
              <p>
                {t(
                  "카페에서 주문하는 대화를 마치면 AI가 발음이 자연스러웠는지, 상황에 맞는 표현을 썼는지, 현지인이 쓰는 말투에 가까웠는지를 짚어줍니다. 딱딱한 채점표가 아니라 다음에 무엇을 더 연습하면 좋을지 알려주는 방식입니다.",
                  "After you finish ordering at the cafe, AI points out whether your pronunciation sounded natural, whether you used situation-appropriate expressions, and how close you came to a local's tone. It's not a rigid scorecard — it tells you what to practice next."
                )}
              </p>
            </motion.div>
          </div>
        </section>

        <section id="expressions" className="section expression-section">
          <div className="page-frame">
            <motion.div {...reveal}>
              <SectionIntro
                index="05"
                eyebrow="TEXTBOOK / LOCAL"
                title={
                  lang === "ko" ? (
                    <>
                      한 문장이,
                      <br />
                      현지의 말투가 되기까지.
                    </>
                  ) : (
                    <>
                      How one sentence
                      <br />
                      becomes local speech.
                    </>
                  )
                }
                text={t(
                  "같은 상황에서도 실제 대화는 조금 더 부드럽고, 조금 더 구체적입니다.",
                  "Even in the same situation, real conversation is a little softer, a little more specific."
                )}
              />
            </motion.div>
            <motion.div {...reveal} className="expression-table-wrap">
              <div className="expression-table">
                <div className="expression-head expression-row">
                  <span>{t("상황", "Situation")}</span>
                  <span>{t("교과서 표현", "Textbook Phrase")}</span>
                  <span>{t("현지 표현", "Local Phrase")}</span>
                  <span>{t("대화의 결", "The Nuance")}</span>
                </div>
                {comparisons.map(row => (
                  <div className="expression-row" key={row.situation.ko}>
                    <div className="situation">
                      <span>{row.icon}</span>
                      {t(row.situation.ko, row.situation.en)}
                    </div>
                    <div className="chinese-line">
                      <strong>{row.textbook}</strong>
                      <small>{row.textbookPinyin}</small>
                    </div>
                    <div className="chinese-line local-line">
                      <strong>{row.local}</strong>
                      <small>{row.localPinyin}</small>
                    </div>
                    <p>{t(row.note.ko, row.note.en)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <p className="source-note">
              {t(
                "예문은 실제 사용 맥락을 이해하기 위한 학습 예시입니다. 지역과 상대, 상황에 따라 자연스러운 표현은 달라질 수 있습니다.",
                "These examples are for understanding real usage context. What sounds natural can vary by region, listener, and situation."
              )}
            </p>
          </div>
        </section>

        <section className="section evidence-section">
          <div className="page-frame rail-layout evidence-layout">
            <motion.div {...reveal}>
              <SectionIntro
                index="06"
                eyebrow="THE RESEARCH NOTE"
                title={
                  lang === "ko" ? (
                    <>
                      학습의 맥락을,
                      <br />더 오래 들여다봅니다.
                    </>
                  ) : (
                    <>
                      We look longer
                      <br />
                      at the context of learning.
                    </>
                  )
                }
              />
            </motion.div>
            <motion.div {...reveal}>
              <p className="lead-copy">
                {t(
                  "커짠은 교재와 실전 표현의 차이, 말하기 불안, 몰입형 회화 연습에 관한 언어교육 연구를 학습 설계의 참고점으로 삼습니다.",
                  "KEZHAN draws on language-education research into the gap between textbook and real speech, speaking anxiety, and immersive conversation practice to inform how we design learning."
                )}
              </p>
              <div className="research-cards">
                {researchCards.map(card => (
                  <div key={card.value}>
                    <strong>{card.value}</strong>
                    <span>{t("명", "")}</span>
                    <p>{t(card.ko, card.en)}</p>
                  </div>
                ))}
              </div>
              <div className="research-list">
                <div className="research-list-title">
                  <span>{t("학술적 배경 자료", "Academic Background")}</span>
                  <small>{t("발표 연도를 구분하여 표기합니다.", "Listed by year of publication.")}</small>
                </div>
                {researchSources.map(source => (
                  <div className="research-source" key={source.year + source.ko.source}>
                    <time>{source.year}</time>
                    <strong>{t(source.ko.source, source.en.source)}</strong>
                    <p>{t(source.ko.focus, source.en.focus)}</p>
                  </div>
                ))}
              </div>
              <div className="evidence-disclaimer">
                <span>NOTE</span>
                <p>
                  {t(
                    "커짠의 자체 학습 데이터와 성장 지표는 실제 수집 및 검토가 완료되는 대로 투명하게 안내할 예정입니다. 임의의 효과 수치는 사용하지 않습니다.",
                    "KEZHAN's own learning data and progress metrics will be shared transparently once they're actually collected and reviewed. We don't use made-up effectiveness numbers."
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section voices-section">
          <div className="page-frame voices-layout">
            <motion.div {...reveal} className="voices-heading">
              <SectionIntro
                index="07"
                eyebrow="THE MOMENT BEFORE SPEAKING"
                title={
                  lang === "ko" ? (
                    <>
                      학습 현장에서
                      <br />
                      자주 들은 말들.
                    </>
                  ) : (
                    <>
                      Words we've heard
                      <br />
                      often, in the field.
                    </>
                  )
                }
              />
              <p>
                {t(
                  "다음 문장은 고객 후기나 성과 보장이 아니라, 회화 학습자가 실제 대화 앞에서 겪는 망설임을 설명하기 위한 예시입니다.",
                  "These lines aren't customer testimonials or a promise of results — they're examples of the hesitation learners feel right before real conversation."
                )}
              </p>
            </motion.div>
            <motion.div {...reveal} className="voice-cards">
              <figure>
                <Quote size={25} />
                <blockquote>
                  {t(
                    "“문장이 완벽해서도 아니고, 그냥 입 밖으로 안 나와요. 머릿속에서는 아는데 말하려고 하면 멈칫하게 돼요.”",
                    "“It's not that the sentence isn't perfect — it just won't come out. I know it in my head, but the moment I try to speak, I freeze.”"
                  )}
                </blockquote>
                <figcaption>{t("— 말하기 전의 망설임", "— The hesitation before speaking")}</figcaption>
              </figure>
              <figure>
                <Quote size={25} />
                <blockquote>
                  {t(
                    "“교과서에는 ‘对不起’를 쓰는데, 실제로는 ‘不好意思’를 더 자주 쓰더라고요. 처음에 당황했어요.”",
                    "“The textbook uses ‘对不起’, but in real life people say ‘不好意思’ much more often. It threw me off at first.”"
                  )}
                </blockquote>
                <figcaption>{t("— 표현의 온도 차이", "— The difference in tone")}</figcaption>
              </figure>
            </motion.div>
          </div>
        </section>

        <section id="how" className="section how-section">
          <div className="page-frame">
            <motion.div {...reveal} className="how-intro">
              <SectionIntro
                index="08"
                eyebrow="HOW IT WORKS"
                title={
                  lang === "ko" ? (
                    <>
                      다섯 단계로,
                      <br />
                      오늘의 대화를 시작합니다.
                    </>
                  ) : (
                    <>
                      In five steps,
                      <br />
                      start today's conversation.
                    </>
                  )
                }
                text={t(
                  "정답을 빨리 찾기보다, 내 속도로 실제 말을 꺼내보는 과정입니다.",
                  "Less about finding the right answer fast, more about speaking up at your own pace."
                )}
              />
            </motion.div>
            <div className="steps-track">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    {...reveal}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: 0.45 }}
                    className="step"
                    key={step.no}
                  >
                    <span className="step-no">{step.no}</span>
                    <div className="step-icon">
                      <Icon size={24} />
                    </div>
                    <h3>{t(step.ko.title, step.en.title)}</h3>
                    <p>{t(step.ko.text, step.en.text)}</p>
                    {index < steps.length - 1 && <i className="step-line" />}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section cycle-section">
          <div className="page-frame">
            <motion.div {...reveal}>
              <SectionIntro
                index="09"
                eyebrow="THE LEARNING LOOP"
                title={
                  lang === "ko" ? (
                    <>
                      한 번의 대화로 끝나지 않고,
                      <br />
                      계속 도는 학습 주기.
                    </>
                  ) : (
                    <>
                      It doesn't end with one talk —
                      <br />
                      it's a loop that keeps turning.
                    </>
                  )
                }
                text={t(
                  "정해진 커리큘럼을 순서대로 따라가는 대신, 짧은 대화와 피드백을 반복하며 자연스럽게 실력이 쌓이는 학습 주기를 만듭니다.",
                  "Instead of following a fixed curriculum in order, we build a loop of short conversations and feedback that lets skill build up naturally."
                )}
              />
            </motion.div>
            <div className="cycle-track">
              {cycleSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.article
                    {...reveal}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: 0.45 }}
                    className="cycle-node"
                    key={step.ko.title}
                  >
                    <span className="cycle-no">{step.no}</span>
                    <div className="cycle-icon">
                      <Icon size={21} />
                    </div>
                    <h3>{t(step.ko.title, step.en.title)}</h3>
                    <p>{t(step.ko.text, step.en.text)}</p>
                  </motion.article>
                );
              })}
            </div>
            <motion.div {...reveal} className="cycle-repeat">
              <RotateCcw size={17} />
              <span>
                {lang === "ko" ? (
                  <>
                    이 흐름은 다시 <b>① 오늘의 상황 정하기</b>로 이어집니다. 하루 한 번, 며칠에
                    걸쳐 반복하는 것이 커짠의 학습 방식입니다.
                  </>
                ) : (
                  <>
                    This flow loops back to <b>① Pick Today's Situation</b>. Repeating it once a
                    day, over several days, is how KEZHAN learning works.
                  </>
                )}
              </span>
            </motion.div>
          </div>
        </section>

        <section className="cta-section">
          <div className="page-frame cta-inner">
            <motion.div {...reveal}>
              <p className="eyebrow">START WHERE YOU ARE</p>
              <h2>
                {lang === "ko" ? (
                  <>
                    머릿속 중국어를,
                    <br />
                    <em>오늘의 한 문장</em>으로 꺼내보세요.
                  </>
                ) : (
                  <>
                    Turn the Chinese in your head
                    <br />
                    into <em>today's one sentence</em>.
                  </>
                )}
              </h2>
              <p>
                {t(
                  "정식 요금제는 준비 중입니다. 지금은 무료 체험 소식과 이용 안내를 먼저 받아보세요.",
                  "Our official pricing is still being finalized. For now, get the free trial news and usage guide first."
                )}
              </p>
            </motion.div>
            <motion.div {...reveal} className="cta-actions">
              <span className="cta-stamp">
                <img src={BRAND_MARK} alt="" />
                SPEAKING STARTS HERE
              </span>
              <button className="button button-light" onClick={handleTrial}>
                {t("무료체험 시작하기", "Start Free Trial")} <ArrowDownRight size={18} />
              </button>
              <button className="button button-line-light" onClick={() => scrollTo("#contact")}>
                {t("요금 및 제휴 문의하기", "Ask About Pricing & Partnerships")} <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </section>

        <section id="faq" className="section faq-section">
          <div className="page-frame faq-layout">
            <motion.div {...reveal} className="faq-intro">
              <SectionIntro
                index="10"
                eyebrow="FAQ"
                title={t(
                  "궁금한 점을 먼저 정리했습니다.",
                  "We've answered the common questions first."
                )}
              />
              <p>
                {t(
                  "서비스 형태와 상세 연락처는 확정되는 대로 안내를 업데이트하겠습니다.",
                  "We'll update this once the service details and contact information are finalized."
                )}
              </p>
            </motion.div>
            <motion.div {...reveal} className="faq-list">
              {faqs.map((faq, index) => (
                <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={faq.ko.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>
                      <em>Q{String(index + 1).padStart(2, "0")}</em>
                      {t(faq.ko.q, faq.en.q)}
                    </span>
                    <ChevronDown size={20} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p>{t(faq.ko.a, faq.en.a)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section fit-section">
          <div className="page-frame">
            <motion.div {...reveal}>
              <SectionIntro
                index="11"
                eyebrow="A GOOD FIT, HONESTLY"
                title={
                  lang === "ko" ? (
                    <>
                      커짠이 잘 맞는 순간과,
                      <br />
                      다른 도움이 더 필요한 순간.
                    </>
                  ) : (
                    <>
                      When KEZHAN fits well,
                      <br />
                      and when you'll need something else.
                    </>
                  )
                }
                text={t(
                  "학습 목적이 다르면 가장 좋은 방법도 달라집니다. 나에게 맞는 방식을 선택할 수 있도록 분명히 안내합니다.",
                  "The best method depends on your learning goal. We want to be clear so you can choose what actually fits you."
                )}
              />
            </motion.div>
            <div className="fit-grid">
              <motion.article {...reveal} className="fit-card good-fit">
                <div className="fit-card-title">
                  <Check size={22} />
                  <h3>{t("이런 분께 추천드려요", "We'd recommend KEZHAN if you're...")}</h3>
                </div>
                <ul>
                  {goodFitList.map(item => (
                    <li key={item.ko}>{t(item.ko, item.en)}</li>
                  ))}
                </ul>
              </motion.article>
              <motion.article {...reveal} className="fit-card other-fit">
                <div className="fit-card-title">
                  <span>△</span>
                  <h3>{t("다음과 같은 경우엔 참고해주세요", "Worth knowing before you start:")}</h3>
                </div>
                <ul>
                  {otherFitList.map(item => (
                    <li key={item.ko.strong}>
                      <strong>{t(item.ko.strong, item.en.strong)}</strong>{" "}
                      {t(item.ko.rest, item.en.rest)}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="page-frame contact-grid">
            <motion.div {...reveal} className="contact-copy">
              <SectionIntro
                index="12"
                eyebrow="CONTACT"
                title={
                  lang === "ko" ? (
                    <>
                      함께 이야기할 준비가 되면,
                      <br />
                      메시지를 남겨주세요.
                    </>
                  ) : (
                    <>
                      When you're ready to talk,
                      <br />
                      leave us a message.
                    </>
                  )
                }
              />
              <p>
                {t(
                  "일반 문의부터 제휴, 학원·기업 도입, 요금 관련 질문까지 남겨주실 수 있습니다.",
                  "From general questions to partnerships, institutional adoption, or pricing — feel free to reach out."
                )}
              </p>
              <div className="contact-aside">
                <span>CONTACT NOTE</span>
                <p>
                  {t(
                    "이메일·전화·카카오톡 등 직접 연락처는 서비스 형태와 함께 확정되는 대로 추가될 예정입니다.",
                    "Direct contact details — email, phone, KakaoTalk — will be added once the service format is finalized."
                  )}
                </p>
              </div>
            </motion.div>
            {contactSubmitted ? (
              <motion.div {...reveal} className="contact-form contact-success">
                <Check size={28} />
                <h3>{t("문의가 접수되었습니다.", "Your message has been received.")}</h3>
                <p>
                  {t(
                    "남겨주신 이메일로 순서대로 답변드리겠습니다.",
                    "We'll reply to the email you left, in order."
                  )}
                </p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => setContactSubmitted(false)}
                >
                  {t("다른 문의 남기기", "Send another message")} <ArrowRight size={17} />
                </button>
              </motion.div>
            ) : (
              <motion.form {...reveal} onSubmit={handleContact} className="contact-form">
                <label>
                  {t("이름", "Name")}
                  <input
                    name="name"
                    required
                    placeholder={t("성함을 입력해주세요", "Enter your name")}
                  />
                </label>
                <label>
                  {t("이메일", "Email")}
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={t("답변 받을 이메일", "Email for our reply")}
                  />
                </label>
                <label>
                  {t("문의 유형", "Inquiry Type")}
                  <select name="inquiryType" defaultValue={t("일반 문의", "General Inquiry")}>
                    <option>{t("일반 문의", "General Inquiry")}</option>
                    <option>{t("제휴 문의", "Partnership Inquiry")}</option>
                    <option>{t("학원·기업용 도입 문의", "Institutional/Business Adoption")}</option>
                    <option>{t("요금 관련 문의", "Pricing Inquiry")}</option>
                  </select>
                </label>
                <label>
                  {t("문의 내용", "Message")}
                  <textarea
                    name="message"
                    required
                    placeholder={t("궁금한 내용을 편하게 적어주세요", "Tell us what's on your mind")}
                    rows={4}
                  />
                </label>
                <button
                  className="button button-solid form-submit"
                  type="submit"
                  disabled={contactSubmitting}
                >
                  {contactSubmitting ? (
                    t("접수 중...", "Submitting...")
                  ) : (
                    <>
                      {t("문의 남기기", "Send Message")} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </div>
        </section>
      </main>

      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} source={waitlistSource} />

      <Dialog open={openTheme !== null} onOpenChange={open => !open && setOpenTheme(null)}>
        <DialogContent className="sm:max-w-[560px]">
          {dialogTheme && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {t(dialogTheme.ko.name, dialogTheme.en.name)}
                  <span className="theme-tab-tag" style={{ marginLeft: 8 }}>
                    {t(dialogTheme.ko.tag, dialogTheme.en.tag)}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {dialogTheme.locked
                    ? t(
                        "이 채는 아직 준비 중입니다.",
                        "This wing hasn't opened yet."
                      )
                    : t(
                        `총 ${dialogTheme.scenarios.length}개의 대화 상황이 있습니다.`,
                        `${dialogTheme.scenarios.length} conversation situations, and counting.`
                      )}
                </DialogDescription>
              </DialogHeader>
              {dialogTheme.locked ? (
                <div className="scenario-dialog-locked">
                  <Lock size={22} />
                  <div>
                    <strong>{t("다음 채는 준비 중입니다.", "The next wing is on its way.")}</strong>
                    <p>
                      {t(
                        "커짠이 다루는 상황이 늘어날 때마다, 새 채가 하나씩 열립니다.",
                        "As KEZHAN covers more situations, a new wing opens one at a time."
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="scenario-dialog-list">
                  {dialogTheme.scenarios.map((scenario, index) => {
                    const Icon = scenario.icon;
                    return (
                      <button
                        key={scenario.ko.title}
                        className="scenario-dialog-row"
                        onClick={() => {
                          setOpenTheme(null);
                          handleTrial();
                        }}
                      >
                        <span className="scenario-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon size={19} />
                        <span>
                          <strong>{t(scenario.ko.title, scenario.en.title)}</strong>
                          <small>{t(scenario.ko.desc, scenario.en.desc)}</small>
                        </span>
                        <ArrowRight size={17} />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="site-footer">
        <div className="page-frame footer-inner">
          <a className="brand footer-brand" href="#top">
            <img className="brand-mark" src={BRAND_MARK} alt="" />
            <span className="brand-wordmark">KEZHAN</span>
            <span className="brand-korean">커짠</span>
          </a>
          <p>
            {t(
              "교과서 중국어를 넘어, 가상환경 기반 AI와 생활중국어 표현을 연습하는 중국어회화 플랫폼",
              "Beyond textbook Chinese — practice real, everyday expressions with an AI conversation platform built on a virtual environment."
            )}
          </p>
          <span>© {new Date().getFullYear()} KEZHAN. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
