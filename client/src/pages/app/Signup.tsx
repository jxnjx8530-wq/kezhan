/**
 * Not linked from the public site yet. Uses Supabase auth once
 * VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are configured; falls back to
 * a "not configured" toast so the page doesn't crash before then.
 */
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

export default function Signup() {
  const { lang } = useLanguage();
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      toast(t("아직 준비 중이에요", "Still under construction"), {
        description: t(
          "Supabase 연결이 아직 설정되지 않았어요.",
          "Supabase isn't connected yet."
        ),
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setSubmitting(false);
    if (error) {
      toast(t("가입 실패", "Signup failed"), { description: error.message });
      return;
    }
    toast(t("가입 완료!", "Account created!"), {
      description: t("이메일로 온 확인 링크를 눌러주세요.", "Check your email to confirm your account."),
    });
    setLocation("/login");
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
            "안내: 실제 계정을 만듭니다. 아직 홈페이지 메뉴에는 연결되어 있지 않은 개발 중인 화면이에요.",
            "Note: this creates a real account. Not yet linked from the site's main menu — this page is still under development."
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
          <button type="submit" className="button button-solid form-submit" disabled={submitting}>
            {submitting ? t("가입하는 중...", "Signing up...") : t("가입하기", "Sign up")}
          </button>
        </form>
      </main>
    </div>
  );
}
