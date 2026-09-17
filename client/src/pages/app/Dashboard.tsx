/**
 * Scaffold only: no backend wired up yet. Not linked from the public site —
 * this exists so the real-product pages have a home to grow into, separate
 * from the marketing site's pages/ folder.
 */
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <Link href="/" className="chat-back">
          <ArrowLeft size={18} />
          <span>{t("홈으로", "Home")}</span>
        </Link>
        <div className="chat-title">
          <span>{t("대시보드", "Dashboard")}</span>
        </div>
        <span className="chat-progress" />
      </header>

      <div className="chat-note">
        <p>
          {t(
            "프로토타입 안내: 로그인 후 보게 될 화면의 자리표시자입니다. 레벨 테스트, 학습 현황 등은 아직 연결되지 않았어요.",
            "Prototype note: this is a placeholder for the post-login screen. Level test and progress tracking aren't connected yet."
          )}
        </p>
      </div>
    </div>
  );
}
