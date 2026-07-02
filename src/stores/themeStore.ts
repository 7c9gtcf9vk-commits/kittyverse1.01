import { create } from "zustand";

export type ThemeMode = "dark" | "system";

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  logoText: string;
  fontFamily: string;
  borderRadius: number;
}

interface ThemeStore {
  theme: ThemeConfig;
  mode: ThemeMode;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  setMode: (mode: ThemeMode) => void;
  cycleMode: () => void;
  resetTheme: () => void;
}

const THEME_MODE_KEY = "kittyverse-theme-mode";

const defaultTheme: ThemeConfig = {
  primaryColor: "#A8D8EA",
  accentColor: "#FFB7C5",
  backgroundColor: "#FFFFFF",
  logoText: "KittyVerse",
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
  borderRadius: 12,
};

function loadMode(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    if (stored === "dark") return "dark";
  } catch {}
  return "system";
}

function persistMode(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_MODE_KEY, mode);
  } catch {}
}

const cycleOrder: ThemeMode[] = ["dark", "system"];

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: defaultTheme,
  mode: loadMode(),
  setTheme: (updates) =>
    set((state) => ({
      theme: { ...state.theme, ...updates },
    })),
  setMode: (mode) => {
    persistMode(mode);
    set({ mode });
  },
  cycleMode: () =>
    set((state) => {
      const idx = cycleOrder.indexOf(state.mode);
      const next = cycleOrder[(idx + 1) % cycleOrder.length];
      persistMode(next);
      return { mode: next };
    }),
  resetTheme: () => set({ theme: defaultTheme }),
}));
