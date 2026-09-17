/**
 * Not linked from the public site yet. Redirects to /login when there is no
 * Supabase session, or when Supabase isn't configured at all.
 */
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLocation("/login");
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setLocation("/login");
        return;
      }
      setEmail(data.session.user.email ?? null);
      setChecked(true);
    });
  }, [setLocation]);

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setLocation("/login");
  };

  if (!checked) {
    return null;
  }

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
            "안내: 레벨 테스트, 학습 현황 같은 기능은 아직 연결되지 않았어요. 지금은 로그인 상태 확인만 됩니다.",
            "Note: level test and progress tracking aren't connected yet. This only confirms your login works."
          )}
        </p>
      </div>

      <main className="practice-index-main" style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "var(--ink)", fontSize: 15, marginBottom: 20 }}>
          {t("로그인 계정: ", "Logged in as: ")}
          <strong>{email}</strong>
        </p>
        <button type="button" className="button button-solid" onClick={handleLogout}>
          {t("로그아웃", "Log out")}
        </button>
      </main>
    </div>
  );
}
