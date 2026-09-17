/**
 * Scaffold only: no backend wired up yet. Not linked from the public site —
 * this exists so the real-product pages have a home to grow into, separate
 * from the marketing site's pages/ folder.
 */
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Signup() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast(t("아직 준비 중이에요", "Still under construction"), {
      description: t(
        "회원가입 기능은 다음 단계에서 실제로 연결할 예정이에요.",
        "Signup isn't wired to a real backend yet — that's the next step."
      ),
    });
  };

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <Link href="/" className="chat-back">
          <ArrowLeft size={18} />
          <span>{t("홈으로", "Home")}</span>
        </Link>
        <div className="chat-title">
          <span>{t("회원가입", "Sign up")}</span>
        </div>
        <span className="chat-progress" />
      </header>

      <div className="chat-note">
        <p>
          {t(
            "프로토타입 안내: 화면만 먼저 만든 단계입니다. 실제로 계정이 만들어지지는 않아요.",
            "Prototype note: this is a screen-only draft. No account is actually created yet."
          )}
        </p>
      </div>

      <main className="practice-index-main">
        <form className="contact-form" style={{ maxWidth: 420, margin: "0 auto", gridTemplateColumns: "1fr" }} onSubmit={handleSubmit}>
          <label>
            {t("이메일", "Email")}
            <input
              type="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder={t("you@example.com", "you@example.com")}
            />
          </label>
          <label>
            {t("비밀번호", "Password")}
            <input
              type="password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="********"
            />
          </label>
          <button type="submit" className="button button-solid form-submit">
            {t("가입하기", "Sign up")}
          </button>
        </form>
      </main>
    </div>
  );
}
