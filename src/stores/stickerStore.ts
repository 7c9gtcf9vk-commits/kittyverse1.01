import { create } from "zustand";

export type StickerType = "character" | "decoration";

export interface StickerConfig {
  id: string;
  type: StickerType;
  name: string;
  /** Which character or decoration this represents */
  variant: StickerVariant;
  /** Position: left or right side */
  side: "left" | "right";
  /** Animation delay in seconds */
  delay: number;
  /** Scale factor */
  scale: number;
  enabled: boolean;
}

export type StickerVariant =
  | "hello-kitty"
  | "my-melody"
  | "kuromi"
  | "cinnamoroll"
  | "keroppi"
  | "little-twin-stars"
  | "pochacco"
  | "heart"
  | "star"
  | "cloud"
  | "rainbow"
  | "flower"
  | "ribbon";

interface StickerStore {
  stickers: StickerConfig[];
  setStickers: (stickers: StickerConfig[]) => void;
  toggleSticker: (id: string) => void;
  updateSticker: (id: string, data: Partial<StickerConfig>) => void;
}

const defaultStickers: StickerConfig[] = [
  {
    id: "s1",
    type: "character",
    name: "Hello Kitty",
    variant: "hello-kitty",
    side: "left",
    delay: 0,
    scale: 1,
    enabled: true,
  },
  {
    id: "s2",
    type: "decoration",
    name: "Heart",
    variant: "heart",
    side: "left",
    delay: 0.5,
    scale: 0.8,
    enabled: true,
  },
  {
    id: "s3",
    type: "character",
    name: "My Melody",
    variant: "my-melody",
    side: "left",
    delay: 1.2,
    scale: 0.9,
    enabled: true,
  },
  {
    id: "s4",
    type: "decoration",
    name: "Star",
    variant: "star",
    side: "left",
    delay: 1.8,
    scale: 0.7,
    enabled: true,
  },
  {
    id: "s5",
    type: "character",
    name: "Keroppi",
    variant: "keroppi",
    side: "left",
    delay: 2.5,
    scale: 0.85,
    enabled: true,
  },
  {
    id: "s6",
    type: "character",
    name: "Kuromi",
    variant: "kuromi",
    side: "right",
    delay: 0.3,
    scale: 1,
    enabled: true,
  },
  {
    id: "s7",
    type: "decoration",
    name: "Cloud",
    variant: "cloud",
    side: "right",
    delay: 0.8,
    scale: 0.75,
    enabled: true,
  },
  {
    id: "s8",
    type: "character",
    name: "Cinnamoroll",
    variant: "cinnamoroll",
    side: "right",
    delay: 1.5,
    scale: 0.9,
    enabled: true,
  },
  {
    id: "s9",
    type: "decoration",
    name: "Ribbon",
    variant: "ribbon",
    side: "right",
    delay: 2.0,
    scale: 0.7,
    enabled: true,
  },
  {
    id: "s10",
    type: "character",
    name: "Pochacco",
    variant: "pochacco",
    side: "right",
    delay: 2.8,
    scale: 0.85,
    enabled: true,
  },
];

export const useStickerStore = create<StickerStore>((set) => ({
  stickers: defaultStickers,
  setStickers: (stickers) => set({ stickers }),
  toggleSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    })),
  updateSticker: (id, data) =>
    set((state) => ({
      stickers: state.stickers.map((s) =>
        s.id === id ? { ...s, ...data } : s
      ),
    })),
}));