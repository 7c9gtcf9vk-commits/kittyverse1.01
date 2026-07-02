"use client";

import { Globe, MessageCircle, Camera, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("common");

  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-[1280px] px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={t("footer.github")}
          >
            <Globe className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={t("footer.twitter")}
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={t("footer.instagram")}
          >
            <Camera className="w-5 h-5" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          {t("footer.madeWith")}
        </p>
      </div>
    </footer>
  );
}
