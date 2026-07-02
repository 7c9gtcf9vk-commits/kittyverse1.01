"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Sparkles,
  Palette,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const adminNav = [
    {
      label: t("admin.sidebar.dashboard"),
      href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: t("admin.sidebar.hero"),
      href: "/admin/hero",
      icon: <SlidersHorizontal className="w-5 h-5" />,
    },
    {
      label: t("admin.sidebar.media"),
      href: "/admin/media",
      icon: <Image className="w-5 h-5" />,
    },
    {
      label: t("admin.sidebar.stickers"),
      href: "/admin/stickers",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      label: t("admin.sidebar.theme"),
      href: "/admin/theme",
      icon: <Palette className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary dark:bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-card dark:bg-card border-b border-border dark:border-border h-14 flex items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors mr-6"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("admin.sidebar.backToSite")}
        </Link>
        <span className="text-sm font-semibold text-foreground dark:text-muted-foreground/60">
          {t("header.logo")} Admin
        </span>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-14 bg-card dark:bg-card border-r border-border dark:border-border min-h-[calc(100vh-56px)] flex flex-col items-center py-4 gap-1">
          {adminNav.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground dark:text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground/60 hover:bg-secondary dark:hover:bg-secondary"
                )}
              >
                {item.icon}
              </Link>
            );
          })}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
