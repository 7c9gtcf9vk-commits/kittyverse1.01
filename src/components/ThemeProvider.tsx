"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/stores/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const mqRef = useRef<MediaQueryList | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (isDark: boolean) => {
      if (isDark) root.classList.add("dark");
      else root.classList.remove("dark");
    };

    if (mode === "dark") {
      apply(true);
    } else {
      // system — follow OS preference
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);

      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener("change", handler);
      mqRef.current = mq;
      return () => {
        mq.removeEventListener("change", handler);
      };
    }
  }, [mode]);

  return <>{children}</>;
}
