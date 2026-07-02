"use client";

import { useEffect, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { createI18nInstance, type SupportedLocale } from "@/lib/i18n";
import type { i18n as I18nType } from "i18next";

function getInitialLocale(): SupportedLocale {
  if (typeof window === "undefined") return "zh-CN";
  const stored = localStorage.getItem("kittyverse-lang");
  if (stored === "zh-CN" || stored === "en-US") return stored;
  const nav = navigator.language;
  if (nav.startsWith("zh")) return "zh-CN";
  if (nav.startsWith("en")) return "en-US";
  return "zh-CN";
}

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [i18n, setI18n] = useState<I18nType | null>(null);

  useEffect(() => {
    const locale = getInitialLocale();
    const instance = createI18nInstance(locale);
    setI18n(instance);
  }, []);

  if (!i18n) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-card">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
