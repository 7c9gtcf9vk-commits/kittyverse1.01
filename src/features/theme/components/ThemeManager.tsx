"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";

export default function ThemeManager() {
  const { theme, setTheme, resetTheme } = useThemeStore();
  const [local, setLocal] = useState({ ...theme });

  const handleSave = () => setTheme(local);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            resetTheme();
            setLocal({
              primaryColor: "#A8D8EA",
              accentColor: "#FFB7C5",
              backgroundColor: "#FFFFFF",
              logoText: "KittyVerse",
              fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
              borderRadius: 12,
            });
          }}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Colors</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {(["primaryColor", "accentColor", "backgroundColor"] as const).map((key) => (
              <div key={key}>
                <label className="text-sm font-medium text-foreground capitalize">
                  {key.replace("Color", " Color")}
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={local[key]}
                    onChange={(e) => setLocal({ ...local, [key]: e.target.value })}
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={local[key]}
                    onChange={(e) => setLocal({ ...local, [key]: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Text & Layout</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Logo Text</label>
              <Input
                value={local.logoText}
                onChange={(e) => setLocal({ ...local, logoText: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Font Family</label>
              <Input
                value={local.fontFamily}
                onChange={(e) => setLocal({ ...local, fontFamily: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Border Radius: {local.borderRadius}px
              </label>
              <input
                type="range"
                min={0}
                max={32}
                value={local.borderRadius}
                onChange={(e) =>
                  setLocal({ ...local, borderRadius: Number(e.target.value) })
                }
                className="w-full mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          Save Theme Settings
        </Button>
      </div>
    </div>
  );
}
