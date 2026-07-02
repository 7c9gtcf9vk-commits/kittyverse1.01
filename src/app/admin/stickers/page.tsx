"use client";

import { useStickerStore, type StickerConfig } from "@/stores/stickerStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StickersAdmin() {
  const { t } = useTranslation("admin");
  const { stickers, toggleSticker } = useStickerStore();

  const leftStickers = stickers.filter((s) => s.side === "left");
  const rightStickers = stickers.filter((s) => s.side === "right");

  const renderStickerRow = (sticker: StickerConfig) => (
    <div
      key={sticker.id}
      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-secondary transition-colors"
    >
      <div>
        <p className="font-medium text-foreground">{sticker.name}</p>
        <p className="text-xs text-muted-foreground">{sticker.type}</p>
      </div>
      <div className="flex items-center gap-3">
        {sticker.enabled ? (
          <Eye className="w-4 h-4 text-kitty-mint" />
        ) : (
          <EyeOff className="w-4 h-4 text-muted-foreground/60" />
        )}
        <Switch
          checked={sticker.enabled}
          onCheckedChange={() => toggleSticker(sticker.id)}
        />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {t("stickers.title")}
      </h1>
      <p className="text-muted-foreground mb-6">{t("stickers.subtitle")}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("stickers.leftSide")}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {leftStickers.map(renderStickerRow)}
            {leftStickers.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                {t("stickers.empty")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("stickers.rightSide")}
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {rightStickers.map(renderStickerRow)}
            {rightStickers.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                {t("stickers.empty")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}