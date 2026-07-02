"use client";

import { motion } from "framer-motion";
import { useStickerStore, type StickerVariant } from "@/stores/stickerStore";
import { cn } from "@/lib/utils";

/* ===== Inline SVG Character Components ===== */

function HelloKitty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Ears */}
      <ellipse cx="28" cy="18" rx="12" ry="16" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      <ellipse cx="72" cy="18" rx="12" ry="16" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      {/* Inner ears */}
      <ellipse cx="28" cy="20" rx="6" ry="10" fill="#FFB7C5" />
      <ellipse cx="72" cy="20" rx="6" ry="10" fill="#FFB7C5" />
      {/* Head */}
      <ellipse cx="50" cy="52" rx="32" ry="28" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="40" cy="48" rx="4" ry="5" fill="#333" />
      <ellipse cx="60" cy="48" rx="4" ry="5" fill="#333" />
      {/* Eye highlights */}
      <circle cx="41" cy="46" r="1.5" fill="white" />
      <circle cx="61" cy="46" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="55" rx="3" ry="2.5" fill="#FFD700" />
      {/* Whiskers */}
      <line x1="18" y1="52" x2="35" y2="54" stroke="#999" strokeWidth="0.8" />
      <line x1="20" y1="58" x2="36" y2="57" stroke="#999" strokeWidth="0.8" />
      <line x1="65" y1="54" x2="82" y2="52" stroke="#999" strokeWidth="0.8" />
      <line x1="64" y1="57" x2="80" y2="58" stroke="#999" strokeWidth="0.8" />
      {/* Bow */}
      <circle cx="50" cy="22" r="5" fill="#FF6B8A" />
      <ellipse cx="40" cy="22" rx="8" ry="5" fill="#FF6B8A" />
      <ellipse cx="60" cy="22" rx="8" ry="5" fill="#FF6B8A" />
    </svg>
  );
}

function MyMelody({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Hood */}
      <path d="M22,40 Q22,10 50,10 Q78,10 78,40 L78,45 Q78,50 74,50 L26,50 Q22,50 22,45 Z" fill="#FFB7C5" />
      {/* Ears */}
      <ellipse cx="30" cy="22" rx="10" ry="18" fill="#FFB7C5" stroke="#F0A0B0" strokeWidth="1" />
      <ellipse cx="70" cy="22" rx="10" ry="18" fill="#FFB7C5" stroke="#F0A0B0" strokeWidth="1" />
      {/* Inner ears */}
      <ellipse cx="30" cy="24" rx="5" ry="11" fill="#FFE0E8" />
      <ellipse cx="70" cy="24" rx="5" ry="11" fill="#FFE0E8" />
      {/* Face */}
      <ellipse cx="50" cy="55" rx="24" ry="22" fill="#FFF5F5" />
      {/* Eyes */}
      <ellipse cx="40" cy="52" rx="4" ry="5" fill="#333" />
      <ellipse cx="60" cy="52" rx="4" ry="5" fill="#333" />
      <circle cx="41" cy="50" r="1.5" fill="white" />
      <circle cx="61" cy="50" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="58" rx="3" ry="2" fill="#FFB7C5" />
      {/* Flower on head */}
      <circle cx="50" cy="18" r="4" fill="#FFF1C1" />
    </svg>
  );
}

function Kuromi({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Jester hat */}
      <path d="M25,38 Q25,10 50,8 Q75,10 75,38 Z" fill="#4A4A6A" />
      {/* Hat tips */}
      <circle cx="25" cy="10" r="6" fill="#FFB7C5" />
      <circle cx="75" cy="10" r="6" fill="#FFB7C5" />
      {/* Skull on hat */}
      <ellipse cx="50" cy="18" rx="4" ry="5" fill="white" />
      <circle cx="48" cy="17" r="1" fill="#333" />
      <circle cx="52" cy="17" r="1" fill="#333" />
      {/* Ears */}
      <path d="M30,38 L18,35 L30,45 Z" fill="#4A4A6A" />
      <path d="M70,38 L82,35 L70,45 Z" fill="#4A4A6A" />
      {/* Face */}
      <ellipse cx="50" cy="55" rx="24" ry="22" fill="white" />
      {/* Eyes */}
      <ellipse cx="40" cy="52" rx="5" ry="6" fill="#333" />
      <ellipse cx="60" cy="52" rx="5" ry="6" fill="#333" />
      <circle cx="41" cy="49" r="2" fill="white" />
      <circle cx="61" cy="49" r="2" fill="white" />
      {/* Eyelashes */}
      <line x1="35" y1="46" x2="32" y2="42" stroke="#333" strokeWidth="1.5" />
      <line x1="65" y1="46" x2="68" y2="42" stroke="#333" strokeWidth="1.5" />
      {/* Mouth */}
      <path d="M44,62 Q50,58 56,62" fill="none" stroke="#333" strokeWidth="1" />
      {/* Nose */}
      <circle cx="50" cy="56" r="2" fill="#FFB7C5" />
    </svg>
  );
}

function Cinnamoroll({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Long ears */}
      <ellipse cx="28" cy="15" rx="14" ry="30" fill="white" stroke="#E8E8F0" strokeWidth="1" />
      <ellipse cx="72" cy="15" rx="14" ry="30" fill="white" stroke="#E8E8F0" strokeWidth="1" />
      {/* Body/Head */}
      <ellipse cx="50" cy="55" rx="28" ry="24" fill="white" stroke="#E8E8F0" strokeWidth="1" />
      {/* Cheeks */}
      <circle cx="34" cy="58" r="5" fill="#FFB7C5" opacity="0.4" />
      <circle cx="66" cy="58" r="5" fill="#FFB7C5" opacity="0.4" />
      {/* Eyes */}
      <ellipse cx="38" cy="48" rx="5" ry="6" fill="#5BC0EB" />
      <ellipse cx="62" cy="48" rx="5" ry="6" fill="#5BC0EB" />
      <circle cx="39" cy="46" r="2" fill="white" />
      <circle cx="63" cy="46" r="2" fill="white" />
      {/* Mouth */}
      <path d="M46,56 Q50,60 54,56" fill="none" stroke="#333" strokeWidth="1" />
      {/* Tail curl */}
      <path d="M60,78 Q70,85 72,78" fill="none" stroke="#E0E0E0" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Keroppi({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Eyes (big frog eyes) */}
      <ellipse cx="35" cy="32" rx="14" ry="14" fill="#5DBA6B" />
      <ellipse cx="65" cy="32" rx="14" ry="14" fill="#5DBA6B" />
      <ellipse cx="35" cy="32" rx="10" ry="10" fill="white" />
      <ellipse cx="65" cy="32" rx="10" ry="10" fill="white" />
      <circle cx="35" cy="32" r="5" fill="#333" />
      <circle cx="65" cy="32" r="5" fill="#333" />
      <circle cx="36" cy="30" r="2" fill="white" />
      <circle cx="66" cy="30" r="2" fill="white" />
      {/* Head */}
      <ellipse cx="50" cy="58" rx="26" ry="22" fill="#5DBA6B" />
      {/* Light face patch */}
      <ellipse cx="50" cy="62" rx="18" ry="14" fill="#A8E6A0" />
      {/* Mouth */}
      <path d="M40,62 Q50,72 60,62" fill="none" stroke="#333" strokeWidth="1.5" />
    </svg>
  );
}

function LittleTwinStars({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Star shapes */}
      <polygon
        points="25,10 30,25 45,25 33,35 37,50 25,42 13,50 17,35 5,25 20,25"
        fill="#A8D8EA"
        opacity="0.6"
      />
      <polygon
        points="75,15 79,28 92,28 81,37 85,50 75,42 65,50 69,37 58,28 71,28"
        fill="#FFB7C5"
        opacity="0.6"
      />
      {/* Kiki (blue hair boy) */}
      <ellipse cx="28" cy="60" rx="15" ry="14" fill="white" />
      <path d="M18,52 Q28,38 38,52" fill="#A8D8EA" />
      <circle cx="25" cy="58" r="2" fill="#333" />
      <circle cx="31" cy="58" r="2" fill="#333" />
      <path d="M26,63 Q28,65 30,63" fill="none" stroke="#333" strokeWidth="0.8" />
      {/* Lala (pink hair girl) */}
      <ellipse cx="72" cy="60" rx="15" ry="14" fill="white" />
      <path d="M62,52 Q72,35 82,52" fill="#FFB7C5" />
      <circle cx="69" cy="58" r="2" fill="#333" />
      <circle cx="75" cy="58" r="2" fill="#333" />
      <path d="M70,63 Q72,65 74,63" fill="none" stroke="#333" strokeWidth="0.8" />
    </svg>
  );
}

function Pochacco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("w-full h-full", className)}>
      {/* Floppy ears */}
      <ellipse cx="20" cy="40" rx="14" ry="24" fill="white" stroke="#E0E0E0" strokeWidth="1" transform="rotate(-20,20,40)" />
      <ellipse cx="80" cy="40" rx="14" ry="24" fill="white" stroke="#E0E0E0" strokeWidth="1" transform="rotate(20,80,40)" />
      {/* Head */}
      <ellipse cx="50" cy="55" rx="27" ry="24" fill="white" stroke="#E0E0E0" strokeWidth="1" />
      {/* Ears inner */}
      <ellipse cx="50" cy="35" rx="12" ry="10" fill="#FFF0F0" />
      {/* Eyes */}
      <circle cx="40" cy="50" r="4" fill="#333" />
      <circle cx="60" cy="50" r="4" fill="#333" />
      <circle cx="41" cy="48" r="1.5" fill="white" />
      <circle cx="61" cy="48" r="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="50" cy="57" rx="4" ry="3" fill="#333" />
      {/* Tongue */}
      <ellipse cx="50" cy="64" rx="3" ry="4" fill="#FF8C69" />
    </svg>
  );
}

/* ===== Decoration SVG Components ===== */

function HeartDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("w-full h-full", className)}>
      <path d="M20,34 C10,24 2,18 2,10 C2,4 8,0 14,0 C18,0 20,3 20,3 C20,3 22,0 26,0 C32,0 38,4 38,10 C38,18 30,24 20,34Z" fill="#FFB7C5" />
    </svg>
  );
}

function StarDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("w-full h-full", className)}>
      <polygon points="20,2 24,15 38,15 26,24 30,38 20,30 10,38 14,24 2,15 16,15" fill="#FFF1C1" />
    </svg>
  );
}

function CloudDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 35" className={cn("w-full h-full", className)}>
      <ellipse cx="18" cy="22" rx="14" ry="12" fill="white" opacity="0.8" />
      <ellipse cx="32" cy="20" rx="16" ry="14" fill="white" opacity="0.8" />
      <ellipse cx="25" cy="12" rx="12" ry="10" fill="white" opacity="0.9" />
    </svg>
  );
}

function RainbowDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 30" className={cn("w-full h-full", className)}>
      <path d="M5,25 Q25,-5 45,25" fill="none" stroke="#FFB7C5" strokeWidth="3" opacity="0.6" />
      <path d="M8,25 Q25,-1 42,25" fill="none" stroke="#FFF1C1" strokeWidth="3" opacity="0.6" />
      <path d="M11,25 Q25,3 39,25" fill="none" stroke="#A8D8EA" strokeWidth="3" opacity="0.6" />
      <path d="M14,25 Q25,7 36,25" fill="none" stroke="#C1F0DB" strokeWidth="3" opacity="0.6" />
      <path d="M17,25 Q25,11 33,25" fill="none" stroke="#E8D5F5" strokeWidth="3" opacity="0.6" />
    </svg>
  );
}

function FlowerDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("w-full h-full", className)}>
      <circle cx="20" cy="14" r="6" fill="#FFB7C5" />
      <circle cx="14" cy="20" r="6" fill="#FFB7C5" />
      <circle cx="26" cy="20" r="6" fill="#FFB7C5" />
      <circle cx="16" cy="28" r="6" fill="#FFB7C5" />
      <circle cx="24" cy="28" r="6" fill="#FFB7C5" />
      <circle cx="20" cy="22" r="5" fill="#FFF1C1" />
    </svg>
  );
}

function RibbonDeco({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("w-full h-full", className)}>
      <path d="M20,4 L32,12 Q20,20 8,12 Z" fill="#FFB7C5" />
      <path d="M20,4 L30,12 L30,26 Q20,22 10,26 L10,12 Z" fill="#FF8C69" opacity="0.8" />
      <path d="M14,12 L26,16" stroke="white" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ===== Variant Map ===== */

const characterMap: Record<StickerVariant, React.ComponentType<{ className?: string }>> = {
  "hello-kitty": HelloKitty,
  "my-melody": MyMelody,
  kuromi: Kuromi,
  cinnamoroll: Cinnamoroll,
  keroppi: Keroppi,
  "little-twin-stars": LittleTwinStars,
  pochacco: Pochacco,
  heart: HeartDeco,
  star: StarDeco,
  cloud: CloudDeco,
  rainbow: RainbowDeco,
  flower: FlowerDeco,
  ribbon: RibbonDeco,
};

/* ===== Main Component ===== */

export default function FloatingStickers() {
  const { stickers } = useStickerStore();
  const enabledStickers = stickers.filter((s) => s.enabled);

  const leftStickers = enabledStickers.filter((s) => s.side === "left");
  const rightStickers = enabledStickers.filter((s) => s.side === "right");

  return (
    <>
      {/* Left side stickers */}
      <div className="fixed left-4 top-[120px] z-20 pointer-events-none hidden lg:flex flex-col items-center gap-1 sticker-fade">
        {leftStickers.map((sticker) => {
          const Comp = characterMap[sticker.variant];
          if (!Comp) return null;
          return (
            <motion.div
              key={sticker.id}
              className="pointer-events-auto cursor-default"
              style={{ width: 60 * sticker.scale, height: 60 * sticker.scale }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 4, -2, 0],
              }}
              transition={{
                duration: 4 + sticker.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: sticker.delay,
              }}
              whileHover={{
                scale: 1.3,
                rotate: 0,
                transition: { duration: 0.3 },
              }}
            >
              <Comp />
            </motion.div>
          );
        })}
      </div>

      {/* Right side stickers */}
      <div className="fixed right-4 top-[120px] z-20 pointer-events-none hidden lg:flex flex-col items-center gap-1 sticker-fade">
        {rightStickers.map((sticker) => {
          const Comp = characterMap[sticker.variant];
          if (!Comp) return null;
          return (
            <motion.div
              key={sticker.id}
              className="pointer-events-auto cursor-default"
              style={{ width: 60 * sticker.scale, height: 60 * sticker.scale }}
              animate={{
                y: [0, -18, 0],
                rotate: [0, -3, 5, 0],
              }}
              transition={{
                duration: 4.5 + sticker.delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay: sticker.delay + 0.5,
              }}
              whileHover={{
                scale: 1.3,
                rotate: 0,
                transition: { duration: 0.3 },
              }}
            >
              <Comp />
            </motion.div>
          );
        })}
      </div>
    </>
  );
}