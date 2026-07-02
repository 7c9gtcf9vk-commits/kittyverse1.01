import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import zhCommon from "@/locales/zh-CN/common.json";
import zhHome from "@/locales/zh-CN/home.json";
import zhAdmin from "@/locales/zh-CN/admin.json";
import enCommon from "@/locales/en-US/common.json";
import enHome from "@/locales/en-US/home.json";
import enAdmin from "@/locales/en-US/admin.json";

export const defaultNS = "common";
export const fallbackLng = "zh-CN";
export const supportedLngs = ["zh-CN", "en-US"] as const;
export type SupportedLocale = (typeof supportedLngs)[number];

export const resources = {
  "zh-CN": {
    common: zhCommon,
    home: zhHome,
    admin: zhAdmin,
  },
  "en-US": {
    common: enCommon,
    home: enHome,
    admin: enAdmin,
  },
} as const;

export function createI18nInstance(lng?: string) {
  const instance = i18n.createInstance();

  instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: lng || undefined,
      fallbackLng,
      supportedLngs: [...supportedLngs],
      defaultNS,
      ns: ["common", "home", "admin"],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "kittyverse-lang",
        caches: ["localStorage"],
      },
    });

  return instance;
}

export default i18n;
