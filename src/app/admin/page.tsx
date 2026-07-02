"use client";

import { useHeroStore } from "@/stores/heroStore";
import { useMediaStore } from "@/stores/mediaStore";
import { useStickerStore } from "@/stores/stickerStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t: tCommon } = useTranslation("common");
  const { t: tAdmin } = useTranslation("admin");
  const heroCount = useHeroStore((s) => s.banners.length);
  const mediaCount = useMediaStore((s) => s.items.length);
  const stickerCount = useStickerStore((s) => s.stickers.length);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {tCommon("admin.dashboard.title")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tCommon("admin.dashboard.heroCount")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{heroCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tCommon("admin.dashboard.mediaCount")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-kitty-blue">{mediaCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tCommon("admin.dashboard.stickerCount")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-kitty-purple">
              {stickerCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tCommon("admin.dashboard.overview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{tAdmin("dashboard.welcome")}</p>
          <p className="text-muted-foreground text-sm mt-2">
            {tAdmin("dashboard.manageContent")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
