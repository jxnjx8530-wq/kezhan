import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "ko" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "kezhan-lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "ko";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ko" || stored === "en") return stored;
  } catch {
    /* localStorage unavailable */
  }
  return "ko";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* localStorage unavailable */
    }
  }, [lang]);

  const setLang = (next: Lang) => setLangState(next);
  const toggleLang = () => setLangState(prev => (prev === "ko" ? "en" : "ko"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
