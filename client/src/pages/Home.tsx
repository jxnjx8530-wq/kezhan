/**
 * Design philosophy — 언어의 결: contemporary editorial learning space with a warm paper ground,
 * ink conversation canvases, restrained dialogue-burgundy actions, and an asymmetric note rail.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  Check,
  ChevronDown,
  Coffee,
  Compass,
  FileText,
  Headphones,
  Hotel,
  MapPinned,
  Menu,
  MessageCircleMore,
  Quote,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const HERO_IMAGE = "/manus-storage/kezhan-hero-editorial_b4cc81fc.jpg";
const CAFE_IMAGE = "/manus-storage/kezhan-cafe-reference_686de322.png";
const STORY_IMAGE = "/manus-storage/kezhan-street-reference_3742581c.jpg";
const BRAND_MARK = "/manus-storage/kezhan-mark_48dba87b.png";

const navItems = [
  { label: "커짠 소개", href: "#about" },
  { label: "학습 방식", href: "#practice" },
  { label: "현지 표현", href: "#expressions" },
  { label: "이용 안내", href: "#how" },
  { label: "자주 묻는 질문", href: "#faq" },
];

const scenarios = [
  { icon: Coffee, title: "카페 주문", desc: "첫 주문을 자연스럽게 이어가기" },
  { icon: MessageCircleMore, title: "식당 문제제기", desc: "불편한 상황을 부드럽게 설명하기" },
  { icon: MapPinned, title: "택시 목적지", desc: "목적지와 경로를 또렷하게 전하기" },
  { icon: Hotel, title: "호텔 체크인", desc: "도착부터 요청까지 침착하게 말하기" },
  { icon: ShoppingBag, title: "쇼핑", desc: "가격과 옵션을 자연스럽게 묻기" },
];

const moreScenarios = ["길 묻기", "자기소개", "전화 예약", "가벼운 잡담", "긴급 상황"];

const comparisons = [
  {
    situation: "카페 주문",
    icon: "☕",
    textbook: "我要一杯咖啡。",
    textbookPinyin: "Wǒ yào yī bēi kāfēi.",
    local: "来一杯咖啡吧。",
    localPinyin: "Lái yī bēi kāfēi ba.",
    note: "‘要’보다 ‘来’를 쓰고, ‘吧’로 말끝을 부드럽게 만듭니다.",
  },
  {
    situation: "식당 문제",
    icon: "🥢",
    textbook: "服务员，我的菜不对。",
    textbookPinyin: "Fúwùyuán, wǒ de cài bú duì.",
    local: "服务员，你好，我的菜点错了。",
    localPinyin: "Fúwùyuán, nǐ hǎo, wǒ de cài diǎn cuò le.",
    note: "인사말과 ‘点错了’ 같은 완곡한 표현을 함께 씁니다.",
  },
  {
    situation: "택시 목적지",
    icon: "🚕",
    textbook: "我想去人民广场。",
    textbookPinyin: "Wǒ xiǎng qù rénmín guǎngchǎng.",
    local: "师傅，我是要去人民广场。能走那条路吗？",
    localPinyin: "Shīfu, wǒ shì yào qù rénmín guǎngchǎng. Néng zǒu nà tiáo lù ma?",
    note: "‘师傅’ 호칭을 더하고, 경로 요청까지 대화를 확장합니다.",
  },
];

const researchCards = [
  { value: "226", label: "표현 괴리를 다룬 언어교육 연구 표본" },
  { value: "162", label: "말하기 불안을 살핀 학습자 연구 표본" },
  { value: "69", label: "VR 기반 회화 훈련 관련 연구 표본" },
  { value: "39", label: "AI 음성 데이터 기반 평가 연구 표본" },
];

const researchSources = [
  { year: "2013", source: "국내 언어교육 연구", focus: "교재 표현과 현지 표현 사이의 거리" },
  { year: "2017", source: "SAGE Journals", focus: "말하기 불안과 의사소통 의지의 관계" },
  { year: "2022", source: "한국교원대학교", focus: "VR 학습 환경의 몰입 경험" },
  { year: "2025", source: "AI Hub", focus: "한국인 중국어 학습자 음성 데이터 기반 자동평가" },
];

const steps = [
  { no: "01", title: "가입하기", text: "간단한 정보로 학습 공간을 엽니다.", icon: Sparkles },
  { no: "02", title: "레벨 테스트", text: "짧은 대화로 현재 말하기 수준을 확인합니다.", icon: Compass },
  { no: "03", title: "시나리오 선택", text: "오늘 필요한 실제 상황을 골라봅니다.", icon: BookOpenCheck },
  { no: "04", title: "AI와 대화 연습", text: "부담 없이 여러 번 말해볼 수 있습니다.", icon: Headphones },
  { no: "05", title: "피드백 리포트", text: "상황에 맞는 다음 연습 지점을 확인합니다.", icon: FileText },
];

const faqs = [
  {
    q: "교과서 중국어랑 커짠이 배우는 중국어는 무엇이 다른가요?",
    a: "커짠은 교과서 문장 대신 카페·식당·택시 같은 실제 상황에서 현지인이 자주 사용하는 표현을 중심으로 연습합니다.",
  },
  {
    q: "AI가 발음을 정확하게 평가해주나요?",
    a: "AI는 발음·어휘·문법·유창성·상황 적합성·현지 표현 사용도를 바탕으로 피드백을 제공합니다. 절대적인 채점이라기보다, 부족한 부분을 스스로 확인하고 연습하는 도구로 활용해주세요.",
  },
  {
    q: "중국어를 하나도 모르는 왕초보도 가능한가요?",
    a: "레벨 테스트로 현재 실력을 먼저 확인하므로 학습 경험이 많지 않아도 본인 수준에 맞춰 시작할 수 있습니다. 다만 문법을 처음부터 체계적으로 배우고 싶다면 기초 문법 학습을 병행하시길 권합니다.",
  },
  {
    q: "어떤 상황을 연습할 수 있나요?",
    a: "카페 주문, 식당 문제 상황, 택시 목적지 안내, 호텔 체크인, 쇼핑 등 총 10가지 실전 상황을 준비하고 있습니다.",
  },
  {
    q: "여행이나 출장 갈 때 필요한 회화도 연습할 수 있나요?",
    a: "택시·호텔·쇼핑 등 여행과 출장에서 자주 마주치는 상황을 담아, 출국 전에 미리 대화를 연습할 수 있도록 구성했습니다.",
  },
  {
    q: "화상수업이나 전화중국어와는 무엇이 다른가요?",
    a: "화상·전화 중국어가 정해진 시간에 사람 강사와 연결되는 방식이라면, 커짠은 원하는 시간에 AI와 반복 연습하는 방식입니다.",
  },
  {
    q: "무료로 먼저 체험해볼 수 있나요?",
    a: "네. 정식 요금제를 공개하기 전, 무료 체험으로 커짠의 학습 방식을 먼저 경험할 수 있도록 준비하고 있습니다.",
  },
  {
    q: "요금제는 어떻게 되나요?",
    a: "정식 요금제는 준비 중이며, 확정되는 대로 안내드리겠습니다.",
  },
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionIntro({ index, eyebrow, title, text }: { index: string; eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-intro">
      <div className="section-rail"><div className="section-index">{index}</div><img className="section-seal" src={BRAND_MARK} alt="" /></div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {text && <p className="section-description">{text}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTrial = () => {
    toast("무료 체험은 준비 중입니다.", {
      description: "오픈 소식과 이용 안내는 문의를 통해 받아보실 수 있습니다.",
    });
  };

  const handleDiagnostic = () => {
    toast("중국어 실력 진단을 준비하고 있습니다.", {
      description: "현재는 문의를 남겨주시면 안내드리겠습니다.",
    });
  };

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast("문의 접수 기능을 준비하고 있습니다.", {
      description: "연락처 확정 후 이 페이지에서 바로 접수하실 수 있습니다.",
    });
  };

  const reveal = shouldReduceMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } };

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="커짠 첫 화면으로 이동" onClick={() => setMenuOpen(false)}>
          <img className="brand-mark" src={BRAND_MARK} alt="" />
          <span className="brand-wordmark">KEZHAN</span>
          <span className="brand-korean">커짠</span>
        </a>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <button className="header-cta" onClick={handleTrial}>무료 체험</button>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="메뉴 열기" aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }} aria-label="모바일 주요 메뉴">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}<ArrowRight size={17} /></a>
              ))}
              <button onClick={() => { setMenuOpen(false); handleTrial(); }}>무료 체험 알림 받기</button>
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
              <div className="hero-note"><span>01</span> REAL-LIFE CHINESE, AT YOUR PACE</div>
              <h1 id="hero-heading">중국어를 배웠는데,<br /><em>왜 실제 말하기가</em><br />어려울까요?</h1>
              <div className="hero-language-note"><img src={BRAND_MARK} alt="" /><div><span>CONVERSATION NOTE</span><strong>“오늘은 한 문장부터, 실제처럼.”</strong></div><i /></div>
              <p>교과서 중국어를 넘어, 생활중국어 표현을 AI와 연습하는 중국어회화 플랫폼</p>
              <div className="hero-actions">
                <button className="button button-solid" onClick={handleTrial}>AI 회화 무료 체험하기 <ArrowDownRight size={18} /></button>
                <button className="button button-ghost" onClick={handleDiagnostic}>내 중국어 실력 진단받기 <ArrowRight size={18} /></button>
              </div>
              <small>가볍게 시작해보고, 필요한 때 반복해보세요.</small>
            </motion.div>
            <motion.div {...reveal} transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.6 }} className="hero-side-note">
              <span>오늘의 대화</span>
              <strong>“来一杯咖啡吧。”</strong>
              <p>Lái yī bēi kāfēi ba.</p>
            </motion.div>
          </div>
          <button className="hero-scroll" onClick={() => scrollTo("#about")} aria-label="커짠 소개로 이동"><span>SCROLL TO LISTEN</span><ArrowDownRight size={18} /></button>
        </section>

        <section id="about" className="section problem-section">
          <div className="page-frame rail-layout">
            <motion.div {...reveal}>
              <SectionIntro index="02" eyebrow="WHY KEZHAN" title="알고 있는 문장과, 입 밖으로 나오는 문장 사이." />
            </motion.div>
            <motion.div {...reveal} className="problem-content">
              <p className="lead-copy">문법과 교과서 문장은 알지만, 실제 중국인과 대화하는 순간에는 배운 중국어가 자연스럽게 나오지 않을 때가 있습니다.</p>
              <div className="problem-list">
                <article><span>01</span><h3>교재 표현과 현지 표현의 괴리</h3><p>상황에 꼭 맞는 어조와 말끝은, 암기한 한 문장보다 한 번 더 실제로 말해보며 익힐 수 있습니다.</p></article>
                <article><span>02</span><h3>말하기 불안과 실전 기회의 부족</h3><p>사람 앞에서 바로 말하기 부담스러운 순간에도, AI와 먼저 대화를 꺼내볼 수 있습니다.</p></article>
                <article><span>03</span><h3>내 실력을 가늠하기 어려움</h3><p>현재 수준과 필요한 연습을 확인하고, 나에게 맞는 대화 상황부터 시작해볼 수 있습니다.</p></article>
              </div>
              <p className="margin-note">말을 잘하기 위한 첫 단계는, 말해보는 경험을 만드는 일입니다.</p>
            </motion.div>
          </div>
        </section>

        <section className="section story-section">
          <div className="page-frame story-grid">
            <motion.div {...reveal} className="story-visual-wrap">
              <img src={STORY_IMAGE} alt="언어 교육 현장 경험을 상징하는 노트와 아카이브 오브제" className="story-visual" />
              <div className="story-stamp">SINCE<br /><b>2004</b></div>
            </motion.div>
            <motion.div {...reveal} className="story-copy">
              <SectionIntro index="03" eyebrow="OUR STORY" title="20여 년의 현장 경험에서, 한 가지 질문이 시작됐습니다." />
              <blockquote>“왜 중국어를 오래 공부해도 중국 현지에서는 말이 잘 나오지 않을까?”</blockquote>
              <p>중국에서 나고 자라 현지 대학까지 마친 창립자는 2004년 한국에서 중국어 강사로 시작했습니다. 통역사와 중국 현지 유치원 강사로 오랜 시간을 보내며, 학습자가 현실의 대화 앞에서 잠시 멈추는 순간을 반복해서 마주했습니다.</p>
              <p>커짠은 그 간격을 줄이기 위해, 오늘 바로 마주칠 수 있는 상황을 대화로 연습하는 곳입니다.</p>
              <button className="text-link" onClick={() => scrollTo("#practice")}>어떤 대화를 연습하는지 보기 <ArrowRight size={17} /></button>
            </motion.div>
          </div>
        </section>

        <section id="practice" className="section practice-section">
          <div className="page-frame">
            <motion.div {...reveal} className="practice-head">
              <SectionIntro index="04" eyebrow="PRACTICE IN CONTEXT" title="외우는 중국어가 아니라, 대화하는 중국어." text="커짠의 핵심은 AI와 나누는 실전 대화입니다. 일상에서 실제로 마주할 수 있는 장면을 그대로 재현합니다." />
              <div className="practice-quote"><span>AI 피드백</span><p>“그 상황에서는 이렇게 말하면 더 자연스러워요.”</p></div>
            </motion.div>
            <div className="scenario-layout">
              <motion.figure {...reveal} className="scenario-feature">
                <img src={CAFE_IMAGE} alt="카페에서 AI와 중국어 주문 회화를 연습하는 장면" />
                <figcaption><span>SCENE 01</span><strong>카페에서 주문하기</strong><small>단어 하나가 아니라, 주문을 이어가는 흐름을 연습합니다.</small></figcaption>
              </motion.figure>
              <motion.div {...reveal} className="scenario-list">
                {scenarios.map((scenario, index) => {
                  const Icon = scenario.icon;
                  return <button key={scenario.title} className="scenario-row" onClick={handleTrial}><span className="scenario-number">0{index + 1}</span><Icon size={20} /><span><strong>{scenario.title}</strong><small>{scenario.desc}</small></span><ArrowRight size={19} /></button>;
                })}
                <div className="more-scenarios">{moreScenarios.map((item) => <span key={item}>{item}</span>)}</div>
              </motion.div>
            </div>
            <motion.div {...reveal} className="feedback-panel">
              <div className="feedback-panel-icon"><BrainCircuit size={30} /></div>
              <div><p className="eyebrow">AFTER THE CONVERSATION</p><h3>대화가 끝나면, 그 장면 안에서 다시 봅니다.</h3></div>
              <p>카페에서 주문하는 대화를 마치면 AI가 발음이 자연스러웠는지, 상황에 맞는 표현을 썼는지, 현지인이 쓰는 말투에 가까웠는지를 짚어줍니다. 딱딱한 채점표가 아니라 다음에 무엇을 더 연습하면 좋을지 알려주는 방식입니다.</p>
            </motion.div>
          </div>
        </section>

        <section id="expressions" className="section expression-section">
          <div className="page-frame">
            <motion.div {...reveal}>
              <SectionIntro index="05" eyebrow="TEXTBOOK / LOCAL" title="한 문장이, 현지의 말투가 되기까지." text="같은 상황에서도 실제 대화는 조금 더 부드럽고, 조금 더 구체적입니다." />
            </motion.div>
            <motion.div {...reveal} className="expression-table-wrap">
              <div className="expression-table">
                <div className="expression-head expression-row"><span>상황</span><span>교과서 표현</span><span>현지 표현</span><span>대화의 결</span></div>
                {comparisons.map((row) => <div className="expression-row" key={row.situation}>
                  <div className="situation"><span>{row.icon}</span>{row.situation}</div>
                  <div className="chinese-line"><strong>{row.textbook}</strong><small>{row.textbookPinyin}</small></div>
                  <div className="chinese-line local-line"><strong>{row.local}</strong><small>{row.localPinyin}</small></div>
                  <p>{row.note}</p>
                </div>)}
              </div>
            </motion.div>
            <p className="source-note">예문은 실제 사용 맥락을 이해하기 위한 학습 예시입니다. 지역과 상대, 상황에 따라 자연스러운 표현은 달라질 수 있습니다.</p>
          </div>
        </section>

        <section className="section evidence-section">
          <div className="page-frame rail-layout evidence-layout">
            <motion.div {...reveal}>
              <SectionIntro index="06" eyebrow="THE RESEARCH NOTE" title="학습의 맥락을, 더 오래 들여다봅니다." />
            </motion.div>
            <motion.div {...reveal}>
              <p className="lead-copy">커짠은 교재와 실전 표현의 차이, 말하기 불안, 몰입형 회화 연습에 관한 언어교육 연구를 학습 설계의 참고점으로 삼습니다.</p>
              <div className="research-cards">{researchCards.map((card) => <div key={card.value}><strong>{card.value}</strong><span>명</span><p>{card.label}</p></div>)}</div>
              <div className="research-list">
                <div className="research-list-title"><span>학술적 배경 자료</span><small>발표 연도를 구분하여 표기합니다.</small></div>
                {researchSources.map((source) => <div className="research-source" key={source.year + source.source}><time>{source.year}</time><strong>{source.source}</strong><p>{source.focus}</p></div>)}
              </div>
              <div className="evidence-disclaimer"><span>NOTE</span><p>커짠의 자체 학습 데이터와 성장 지표는 실제 수집 및 검토가 완료되는 대로 투명하게 안내할 예정입니다. 임의의 효과 수치는 사용하지 않습니다.</p></div>
            </motion.div>
          </div>
        </section>

        <section className="section voices-section">
          <div className="page-frame voices-layout">
            <motion.div {...reveal} className="voices-heading"><SectionIntro index="07" eyebrow="THE MOMENT BEFORE SPEAKING" title="학습 현장에서 자주 들은 말들." /><p>다음 문장은 고객 후기나 성과 보장이 아니라, 회화 학습자가 실제 대화 앞에서 겪는 망설임을 설명하기 위한 예시입니다.</p></motion.div>
            <motion.div {...reveal} className="voice-cards">
              <figure><Quote size={25} /><blockquote>“문장이 완벽해서도 아니고, 그냥 입 밖으로 안 나와요. 머릿속에서는 아는데 말하려고 하면 멈칫하게 돼요.”</blockquote><figcaption>— 말하기 전의 망설임</figcaption></figure>
              <figure><Quote size={25} /><blockquote>“교과서에는 ‘对不起’를 쓰는데, 실제로는 ‘不好意思’를 더 자주 쓰더라고요. 처음에 당황했어요.”</blockquote><figcaption>— 표현의 온도 차이</figcaption></figure>
            </motion.div>
          </div>
        </section>

        <section id="how" className="section how-section">
          <div className="page-frame">
            <motion.div {...reveal} className="how-intro"><SectionIntro index="08" eyebrow="HOW IT WORKS" title="다섯 단계로, 오늘의 대화를 시작합니다." text="정답을 빨리 찾기보다, 내 속도로 실제 말을 꺼내보는 과정입니다." /></motion.div>
            <div className="steps-track">
              {steps.map((step, index) => { const Icon = step.icon; return <motion.article {...reveal} transition={{ delay: shouldReduceMotion ? 0 : index * 0.06, duration: 0.45 }} className="step" key={step.no}><span className="step-no">{step.no}</span><div className="step-icon"><Icon size={24} /></div><h3>{step.title}</h3><p>{step.text}</p>{index < steps.length - 1 && <i className="step-line" />}</motion.article>; })}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="page-frame cta-inner">
            <motion.div {...reveal}><p className="eyebrow">START WHERE YOU ARE</p><h2>머릿속 중국어를,<br /><em>오늘의 한 문장</em>으로 꺼내보세요.</h2><p>정식 요금제는 준비 중입니다. 지금은 무료 체험 소식과 이용 안내를 먼저 받아보세요.</p></motion.div>
            <motion.div {...reveal} className="cta-actions"><span className="cta-stamp"><img src={BRAND_MARK} alt="" />SPEAKING STARTS HERE</span><button className="button button-light" onClick={handleTrial}>무료체험 시작하기 <ArrowDownRight size={18} /></button><button className="button button-line-light" onClick={() => scrollTo("#contact")}>요금 및 제휴 문의하기 <ArrowRight size={18} /></button></motion.div>
          </div>
        </section>

        <section id="faq" className="section faq-section">
          <div className="page-frame faq-layout">
            <motion.div {...reveal} className="faq-intro"><SectionIntro index="10" eyebrow="FAQ" title="궁금한 점을 먼저 정리했습니다." /><p>서비스 형태와 상세 연락처는 확정되는 대로 안내를 업데이트하겠습니다.</p></motion.div>
            <motion.div {...reveal} className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={faq.q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span><em>Q{String(index + 1).padStart(2, "0")}</em>{faq.q}</span><ChevronDown size={20} /></button><AnimatePresence initial={false}>{openFaq === index && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}><p>{faq.a}</p></motion.div>}</AnimatePresence></div>)}</motion.div>
          </div>
        </section>

        <section className="section fit-section">
          <div className="page-frame">
            <motion.div {...reveal}><SectionIntro index="11" eyebrow="A GOOD FIT, HONESTLY" title="커짠이 잘 맞는 순간과, 다른 도움이 더 필요한 순간." text="학습 목적이 다르면 가장 좋은 방법도 달라집니다. 나에게 맞는 방식을 선택할 수 있도록 분명히 안내합니다." /></motion.div>
            <div className="fit-grid">
              <motion.article {...reveal} className="fit-card good-fit"><div className="fit-card-title"><Check size={22} /><h3>이런 분께 추천드려요</h3></div><ul><li>문법과 기본 표현은 알지만 실전에서 말이 잘 안 나오는 학습자</li><li>교과서 중국어와 현지 표현의 차이가 궁금한 학습자</li><li>중국 여행·출장 전 실전 대화를 미리 연습하고 싶은 분</li><li>사람 앞에서 말하기에 부담을 느껴 AI와 먼저 연습해보고 싶은 분</li><li>정해진 시간표 없이 스스로 반복 연습하고 싶은 분</li></ul></motion.article>
              <motion.article {...reveal} className="fit-card other-fit"><div className="fit-card-title"><span>△</span><h3>다음과 같은 경우엔 참고해주세요</h3></div><ul><li><strong>문법을 처음부터 체계적으로 배우고 싶다면</strong> 기초 문법 강의와 병행하는 것이 도움이 될 수 있습니다.</li><li><strong>HSK 등 공인 시험 대비가 목적이라면</strong> 커짠은 시험 대비보다 실전 회화에 초점을 둡니다.</li><li><strong>정기적인 대면·화상 수업을 원한다면</strong> 사람 강사와의 수업 방식이 더 적합할 수 있습니다.</li><li><strong>인터넷이나 음성 인식 환경이 불안정하다면</strong> 이용에 제약이 있을 수 있습니다.</li></ul></motion.article>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="page-frame contact-grid">
            <motion.div {...reveal} className="contact-copy"><SectionIntro index="12" eyebrow="CONTACT" title="함께 이야기할 준비가 되면, 메시지를 남겨주세요." /><p>일반 문의부터 제휴, 학원·기업 도입, 요금 관련 질문까지 남겨주실 수 있습니다.</p><div className="contact-aside"><span>CONTACT NOTE</span><p>이메일·전화·카카오톡 등 직접 연락처는 서비스 형태와 함께 확정되는 대로 추가될 예정입니다.</p></div></motion.div>
            <motion.form {...reveal} onSubmit={handleContact} className="contact-form">
              <label>이름<input required placeholder="성함을 입력해주세요" /></label>
              <label>이메일<input type="email" required placeholder="답변 받을 이메일" /></label>
              <label>문의 유형<select defaultValue="일반 문의"><option>일반 문의</option><option>제휴 문의</option><option>학원·기업용 도입 문의</option><option>요금 관련 문의</option></select></label>
              <label>문의 내용<textarea required placeholder="궁금한 내용을 편하게 적어주세요" rows={4} /></label>
              <button className="button button-solid form-submit" type="submit">문의 남기기 <ArrowRight size={18} /></button>
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-frame footer-inner"><a className="brand footer-brand" href="#top"><img className="brand-mark" src={BRAND_MARK} alt="" /><span className="brand-wordmark">KEZHAN</span><span className="brand-korean">커짠</span></a><p>교과서 중국어를 넘어, 생활중국어 표현을 AI와 연습하는 중국어회화 플랫폼</p><span>© {new Date().getFullYear()} KEZHAN. All rights reserved.</span></div>
      </footer>
    </div>
  );
}
