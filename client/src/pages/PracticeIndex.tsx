/**
 * Prototype-only listing of every scripted conversation scenario, grouped by
 * theme. Not linked from the main site nav yet — this is a working index for
 * browsing the practice prototypes directly, not a finished feature.
 */
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

import { useLanguage } from "@/contexts/LanguageContext";
import { scenarioThemes } from "@/data/scenarios";

export default function PracticeIndex() {
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
          <span>{t("대화 연습 시나리오", "Conversation Practice Scenarios")}</span>
        </div>
        <span className="chat-progress" />
      </header>

      <div className="chat-note">
        <p>
          {t(
            "프로토타입 안내: 아직 다듬는 중인 목록입니다. 각 시나리오는 실제 상황에서 참고할 수 있는 예시 대화이며, 반드시 그대로 말해야 하는 정답은 아닙니다.",
            "Prototype note: this list is still a work in progress. Each scenario is example dialogue you can reference for the real situation — not a required script."
          )}
        </p>
      </div>

      <main className="practice-index-main">
        {scenarioThemes.map(theme => (
          <section key={theme.key} className="practice-index-theme">
            <h2>{t(theme.ko.name, theme.en.name)}</h2>
            <div className="practice-index-grid">
              {theme.scenarios.map(scenario => {
                const Icon = scenario.icon;
                return (
                  <Link key={scenario.slug} href={`/practice/${scenario.slug}`} className="practice-index-card">
                    <Icon size={18} />
                    <span>{t(scenario.ko.title, scenario.en.title)}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
