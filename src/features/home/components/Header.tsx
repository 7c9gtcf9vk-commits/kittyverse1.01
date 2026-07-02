"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Globe, Menu, X } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const modeIcons: Record<"dark" | "system", { icon: string; label: string }> = {
  dark: { icon: "🌙", label: "Dark" },
  system: { icon: "💻", label: "System" },
};

export default function Header() {
  const { t } = useTranslation("common");
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, mode, cycleMode } = useThemeStore();

  const navItems = [
    { label: t("header.nav.home"), href: "/" },
    { label: t("header.nav.gallery"), href: "/gallery" },
    { label: t("header.nav.projects"), href: "/projects" },
    { label: t("header.nav.journal"), href: "/journal" },
  ];

  return (
    <header className="sticky top-0 z-50 navbar-glass">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold tracking-tight text-foreground">
            {theme.logoText}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label={t("header.search")}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <LanguageSwitcher />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="GitHub"
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
          </a>
          <button
            onClick={cycleMode}
            className="p-2 rounded-full hover:bg-secondary transition-colors relative"
            aria-label={`Theme: ${mode}`}
            title={`Theme: ${mode}`}
          >
            <span className="text-lg leading-none">{modeIcons[mode].icon}</span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label={menuOpen ? t("header.menuClose") : t("header.menuOpen")}
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-b border-border px-6 pb-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </motion.nav>
      )}
    </header>
  );
}
