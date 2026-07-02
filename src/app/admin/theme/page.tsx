"use client";

import { useThemeStore, type ThemeMode } from "@/stores/themeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const modeOptions: { value: ThemeMode; labelKey: string }[] = [
  { value: "dark", labelKey: "theme.dark" },
  { value: "system", labelKey: "theme.system" },
];

export default function ThemeAdmin() {
  const { t } = useTranslation("admin");
  const { theme, mode, setMode, setTheme, resetTheme } = useThemeStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
          {t("theme.title")}
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={resetTheme}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" /> {t("theme.reset")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("theme.colors")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Color */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground dark:text-muted-foreground w-32">
                {t("theme.primaryColor")}
              </label>
              <div className="flex gap-2 flex-1">
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ primaryColor: e.target.value })}
                  className="flex-1"
                />
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) =>
                    setTheme({ primaryColor: e.target.value })
                  }
                  className="w-10 h-10 rounded cursor-pointer border"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground dark:text-muted-foreground w-32">
                {t("theme.accentColor")}
              </label>
              <div className="flex gap-2 flex-1">
                <Input
                  value={theme.accentColor}
                  onChange={(e) => setTheme({ accentColor: e.target.value })}
                  className="flex-1"
                />
                <input
                  type="color"
                  value={theme.accentColor}
                  onChange={(e) =>
                    setTheme({ accentColor: e.target.value })
                  }
                  className="w-10 h-10 rounded cursor-pointer border"
                />
              </div>
            </div>

            {/* Background Color */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground dark:text-muted-foreground w-32">
                {t("theme.bgColor")}
              </label>
              <div className="flex gap-2 flex-1">
                <Input
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    setTheme({ backgroundColor: e.target.value })
                  }
                  className="flex-1"
                />
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) =>
                    setTheme({ backgroundColor: e.target.value })
                  }
                  className="w-10 h-10 rounded cursor-pointer border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("theme.branding")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground dark:text-muted-foreground mb-1 block">
                {t("theme.logoText")}
              </label>
              <Input
                value={theme.logoText}
                onChange={(e) => setTheme({ logoText: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-muted-foreground mb-1 block">
                {t("theme.fontFamily")}
              </label>
              <Input
                value={theme.fontFamily}
                onChange={(e) => setTheme({ fontFamily: e.target.value })}
                placeholder="system-ui, sans-serif"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-muted-foreground mb-1 block">
                {t("theme.borderRadius")}
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="range"
                  min="0"
                  max="32"
                  value={String(theme.borderRadius)}
                  onChange={(e) =>
                    setTheme({ borderRadius: Number(e.target.value) })
                  }
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground dark:text-muted-foreground w-10">
                  {theme.borderRadius}px
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("theme.display")}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground dark:text-muted-foreground/60">
                {t("theme.darkMode")}
              </p>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                {t("theme.darkModeDesc")}
              </p>
            </div>
            <div className="flex gap-1 bg-secondary dark:bg-muted rounded-lg p-1">
              {modeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMode(opt.value)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mode === opt.value
                      ? "bg-card dark:bg-secondary text-foreground dark:text-foreground shadow-sm"
                      : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-muted-foreground/60"
                  }`}
                >
                  {opt.value === "dark" ? "🌙" : "💻"}{" "}
                  {opt.labelKey}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
