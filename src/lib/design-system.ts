/**
 * KittyVerse Design System
 * Centralized design tokens for all components
 */

export const colors = {
  white: "#FFFFFF",
  kittyBlue: "#A8D8EA",
  kittyPink: "#FFB7C5",
  kittyYellow: "#FFF1C1",
  kittyMint: "#C1F0DB",
  kittyPurple: "#E8D5F5",
  kittyOrange: "#FF8C69",
  kittyGray: "#F5F5F7",
} as const;

export const typography = {
  display: "54px",
  h1: "36px",
  h2: "30px",
  h3: "26px",
  body: "21px",
  fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
} as const;

export const spacing = {
  unit: 4,
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
} as const;

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
} as const;

export const shadows = {
  soft: "0 2px 8px rgba(0,0,0,0.04)",
  medium: "0 4px 16px rgba(0,0,0,0.06)",
  glass: "0 8px 32px rgba(168,216,234,0.15)",
} as const;

export const motion = {
  spring: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  stickerFloat: {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 3, -3, 0],
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
} as const;

export const layout = {
  maxWidth: "1440px",
  heroWidth: "1280px",
  heroHeight: "520px",
} as const;
