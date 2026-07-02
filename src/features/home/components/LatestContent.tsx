"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const itemGradients = [
  "from-primary/20 to-kitty-blue/20",
  "from-kitty-blue/20 to-kitty-mint/20",
  "from-kitty-yellow/20 to-primary/20",
];

export default function LatestContent() {
  const { t } = useTranslation("home");

  return (
    <section className="mx-auto max-w-[1280px] px-4 mt-20">
      <div className="text-center mb-12">
        <h2 className="text-[36px] font-bold text-foreground">
          {t("latest.title")}
        </h2>
        <p className="text-lg text-muted-foreground mt-2">{t("latest.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="glass-card rounded-[24px] overflow-hidden cursor-pointer group"
          >
            <div
              className={`h-48 bg-gradient-to-br ${itemGradients[i]} flex items-center justify-center`}
            >
              <div className="w-16 h-16 rounded-full bg-card/60" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{t(`latest.items.${i}.date`)}</span>
              </div>
              <h3 className="text-[21px] font-semibold text-foreground mb-2">
                {t(`latest.items.${i}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t(`latest.items.${i}.description`)}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                {t(`latest.items.${i}.readMore`)}
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
