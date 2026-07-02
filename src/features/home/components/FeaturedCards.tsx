"use client";

import { motion } from "framer-motion";
import { Sparkles, Palette, Heart, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
  Heart: <Heart className="w-8 h-8" />,
  Star: <Star className="w-8 h-8" />,
};

const iconKeys = ["Sparkles", "Palette", "Heart", "Star"];
const colors = [
  "text-primary",
  "text-kitty-blue",
  "text-kitty-orange",
  "text-kitty-purple",
];

export default function FeaturedCards() {
  const { t } = useTranslation("home");

  return (
    <section className="mx-auto max-w-[1280px] px-4 mt-20">
      <h2 className="text-[36px] font-bold text-foreground text-center mb-12">
        {t("featured.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="glass-card rounded-[24px] p-8 cursor-pointer group"
          >
            <div
              className={`w-16 h-16 rounded-[16px] flex items-center justify-center mb-6 bg-card/60 ${colors[i]}`}
            >
              {iconMap[iconKeys[i]]}
            </div>
            <h3 className="text-[21px] font-semibold text-foreground mb-3">
              {t(`featured.cards.${i}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`featured.cards.${i}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
