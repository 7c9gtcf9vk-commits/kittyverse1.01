"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const characterColors: Record<string, string> = {
  helloKitty: "bg-kitty-pink/20",
  myMelody: "bg-kitty-pink/15",
  kuromi: "bg-kitty-purple/20",
  cinnamoroll: "bg-kitty-blue/20",
  keroppi: "bg-kitty-mint/20",
  littleTwinStars: "bg-kitty-yellow/20",
  pochacco: "bg-kitty-yellow/15",
  pompompurin: "bg-kitty-orange/15",
};

const characterSvgs: Record<string, string> = {
  helloKitty:
    '<circle cx="40" cy="35" r="22" fill="white" stroke="#FFB7C5" stroke-width="2"/><circle cx="33" cy="30" r="3" fill="#333"/><circle cx="47" cy="30" r="3" fill="#333"/><ellipse cx="40" cy="40" rx="5" ry="3" fill="#FFB7C5"/><line x1="32" y1="50" x2="28" y2="58" stroke="#FFB7C5" stroke-width="2"/><line x1="48" y1="50" x2="52" y2="58" stroke="#FFB7C5" stroke-width="2"/><line x1="31" y1="52" x2="27" y2="60" stroke="#FFB7C5" stroke-width="2"/><line x1="49" y1="52" x2="53" y2="60" stroke="#FFB7C5" stroke-width="2"/><path d="M37 22 L39 16 L41 22" fill="#FFB7C5"/><text x="40" y="72" text-anchor="middle" font-size="6" fill="#FFB7C5" font-weight="bold">KITTY</text>',
  myMelody:
    '<ellipse cx="40" cy="35" rx="20" ry="22" fill="white" stroke="#FFB7C5" stroke-width="2"/><circle cx="33" cy="30" r="2.5" fill="#333"/><circle cx="47" cy="30" r="2.5" fill="#333"/><ellipse cx="40" cy="38" rx="4" ry="2.5" fill="#FFB7C5"/><path d="M20 15 Q40 -8 60 15" fill="#FFB7C5"/><circle cx="40" cy="8" r="4" fill="#FFB7C5"/><line x1="30" y1="50" x2="27" y2="60" stroke="#FFB7C5" stroke-width="2"/><line x1="50" y1="50" x2="53" y2="60" stroke="#FFB7C5" stroke-width="2"/>',
  kuromi:
    '<ellipse cx="40" cy="38" rx="20" ry="22" fill="white" stroke="#E8D5F5" stroke-width="2"/><circle cx="33" cy="33" r="3" fill="#333"/><circle cx="47" cy="33" r="3" fill="#333"/><ellipse cx="40" cy="42" rx="5" ry="2.5" fill="#E8D5F5"/><path d="M32 14 Q40 4 48 14" fill="#333"/><circle cx="30" cy="14" r="5" fill="#333"/><circle cx="50" cy="14" r="5" fill="#333"/><path d="M35 20 L36 28" stroke="#333" stroke-width="1.5"/>',
  cinnamoroll:
    '<ellipse cx="40" cy="42" rx="22" ry="20" fill="white" stroke="#A8D8EA" stroke-width="2"/><circle cx="32" cy="36" r="2.5" fill="#333"/><circle cx="48" cy="36" r="2.5" fill="#333"/><ellipse cx="40" cy="43" rx="4" ry="2" fill="#A8D8EA"/><path d="M20 18 Q28 10 40 12 Q52 10 60 18" fill="none" stroke="#A8D8EA" stroke-width="2"/><path d="M26 48 Q24 58 22 60" fill="none" stroke="#A8D8EA" stroke-width="2"/><path d="M54 48 Q56 58 58 60" fill="none" stroke="#A8D8EA" stroke-width="2"/>',
  keroppi:
    '<circle cx="40" cy="38" r="22" fill="#C1F0DB" stroke="#A8D8EA" stroke-width="2"/><circle cx="30" cy="30" r="6" fill="white" stroke="#A8D8EA" stroke-width="1.5"/><circle cx="50" cy="30" r="6" fill="white" stroke="#A8D8EA" stroke-width="1.5"/><circle cx="30" cy="30" r="3" fill="#333"/><circle cx="50" cy="30" r="3" fill="#333"/><path d="M35 46 Q40 50 45 46" stroke="#A8D8EA" stroke-width="2" fill="none"/>',
  littleTwinStars:
    '<circle cx="28" cy="32" r="16" fill="#FFB7C5" opacity="0.6"/><circle cx="52" cy="32" r="16" fill="#A8D8EA" opacity="0.6"/><circle cx="28" cy="32" r="10" fill="white"/><circle cx="52" cy="32" r="10" fill="white"/><circle cx="25" cy="30" r="1.5" fill="#333"/><circle cx="31" cy="30" r="1.5" fill="#333"/><circle cx="49" cy="30" r="1.5" fill="#333"/><circle cx="55" cy="30" r="1.5" fill="#333"/><text x="28" y="42" text-anchor="middle" font-size="5" fill="#FFB7C5">LALA</text><text x="52" y="42" text-anchor="middle" font-size="5" fill="#A8D8EA">KIKI</text>',
  pochacco:
    '<ellipse cx="40" cy="35" rx="20" ry="22" fill="white" stroke="#FFB7C5" stroke-width="2"/><circle cx="33" cy="28" r="3" fill="#333"/><circle cx="47" cy="28" r="3" fill="#333"/><ellipse cx="40" cy="36" rx="4" ry="2.5" fill="#FFB7C5"/><path d="M36 14 L40 10 L44 14 Z" fill="#333"/><path d="M32 48 L30 58" stroke="#FFB7C5" stroke-width="2"/><path d="M48 48 L50 58" stroke="#FFB7C5" stroke-width="2"/>',
  pompompurin:
    '<circle cx="40" cy="38" r="22" fill="#FFF1C1" stroke="#FFB7C5" stroke-width="2"/><circle cx="32" cy="32" r="2.5" fill="#333"/><circle cx="48" cy="32" r="2.5" fill="#333"/><ellipse cx="40" cy="40" rx="4" ry="2" fill="#FFB7C5"/><ellipse cx="40" cy="18" rx="14" ry="8" fill="#8B6914"/><path d="M36 46 L38 52" stroke="#FFB7C5" stroke-width="2"/><path d="M44 46 L42 52" stroke="#FFB7C5" stroke-width="2"/>',
};

const characterKeys = [
  "helloKitty",
  "myMelody",
  "kuromi",
  "cinnamoroll",
  "keroppi",
  "littleTwinStars",
  "pochacco",
  "pompompurin",
];

export default function CharacterGallery() {
  const { t } = useTranslation("home");

  return (
    <section className="mx-auto max-w-[1280px] px-4 mt-20">
      <div className="text-center mb-12">
        <h2 className="text-[36px] font-bold text-foreground">
          {t("gallery.title")}
        </h2>
        <p className="text-lg text-muted-foreground mt-2">{t("gallery.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {characterKeys.map((key, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`${characterColors[key] || "bg-secondary"} rounded-[24px] p-6 cursor-pointer group`}
          >
            <div className="w-full aspect-square mb-4 flex items-center justify-center">
              <svg
                viewBox="0 0 80 75"
                data-sticker
                className="w-full h-full max-w-[160px] group-hover:scale-110 transition-transform duration-300"
              >
                <g
                  dangerouslySetInnerHTML={{
                    __html: characterSvgs[key] || "",
                  }}
                />
              </svg>
            </div>
            <h3 className="text-[21px] font-semibold text-foreground text-center mb-2">
              {t(`gallery.characters.${key}.name`)}
            </h3>
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              {t(`gallery.characters.${key}.desc`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
