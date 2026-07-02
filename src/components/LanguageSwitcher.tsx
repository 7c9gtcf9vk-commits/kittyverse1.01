"use client";

import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language;
  const nextLang = currentLang === "zh-CN" ? "en-US" : "zh-CN";

  const toggleLanguage = () => {
    i18n.changeLanguage(nextLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("kittyverse-lang", nextLang);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
      aria-label={`Switch to ${nextLang === "zh-CN" ? "中文" : "English"}`}
      title={`Switch to ${nextLang === "zh-CN" ? "中文" : "English"}`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{currentLang === "zh-CN" ? "EN" : "中文"}</span>
    </button>
  );
}
