import { create } from "zustand";

// ─── R2 File Reference ───
export interface R2FileInfo {
  url: string;
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  posterKey?: string;
  posterUrl?: string;
}

// ─── Banner Types ───
export type BannerType = "image" | "video" | "mixed" | "rich-video";

// ─── Multi-language text ───
export interface LocalizedText {
  zh: string;
  en: string;
}

// ─── Banner Data Model ───
export interface HeroBanner {
  id: string;
  type: BannerType;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  /** Image file info (R2) - required for image, mixed types */
  image: R2FileInfo | null;
  /** Mobile-optimized image (R2) - optional */
  mobileImage: R2FileInfo | null;
  /** Video file info (R2) - required for video, rich-video types */
  video: R2FileInfo | null;
  /** Video poster/cover (R2) - auto-generated or manually uploaded */
  poster: R2FileInfo | null;
  /** CTA button */
  buttonText: LocalizedText;
  buttonLink: string;
  /** Autoplay delay per banner (ms) */
  autoplayDelay: number;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Store ───
interface HeroStore {
  banners: HeroBanner[];
  setBanners: (banners: HeroBanner[]) => void;
  addBanner: (
    banner: Omit<HeroBanner, "id" | "sortOrder" | "createdAt" | "updatedAt">
  ) => void;
  removeBanner: (id: string) => void;
  updateBanner: (id: string, data: Partial<HeroBanner>) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  toggleEnabled: (id: string) => void;
}

const now = "2026-07-01T00:00:00.000Z";

const defaultBanners: HeroBanner[] = [
  {
    id: "hb-1",
    type: "image",
    title: { zh: "欢迎来到 KittyVerse", en: "Welcome to KittyVerse" },
    subtitle: {
      zh: "探索 Hello Kitty 和朋友们的梦幻世界",
      en: "A dreamy digital space inspired by Hello Kitty & Friends",
    },
    description: { zh: "", en: "" },
    image: null,
    mobileImage: null,
    video: null,
    poster: null,
    buttonText: { zh: "", en: "" },
    buttonLink: "",
    autoplayDelay: 5000,
    sortOrder: 0,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hb-2",
    type: "mixed",
    title: { zh: "发现可爱角色", en: "Meet the Characters" },
    subtitle: {
      zh: "遇见你最爱的三丽鸥明星们",
      en: "Explore your favorite Sanrio friends",
    },
    description: {
      zh: "Hello Kitty、美乐蒂、酷洛米、玉桂狗…… 都在这里等你！",
      en: "Hello Kitty, My Melody, Kuromi, Cinnamoroll… all waiting for you!",
    },
    image: null,
    mobileImage: null,
    video: null,
    poster: null,
    buttonText: { zh: "探索角色", en: "Explore" },
    buttonLink: "#gallery",
    autoplayDelay: 5000,
    sortOrder: 1,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "hb-3",
    type: "video",
    title: { zh: "创造美好回忆", en: "Create & Share" },
    subtitle: {
      zh: "用甜蜜和快乐填满每一天",
      en: "Build your own KittyVerse projects and journals",
    },
    description: { zh: "", en: "" },
    image: null,
    mobileImage: null,
    video: null,
    poster: null,
    buttonText: { zh: "", en: "" },
    buttonLink: "",
    autoplayDelay: 5000,
    sortOrder: 2,
    enabled: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const useHeroStore = create<HeroStore>((set) => ({
  banners: defaultBanners,
  setBanners: (banners) => set({ banners }),
  addBanner: (banner) =>
    set((state) => {
      const ts = new Date().toISOString();
      return {
        banners: [
          ...state.banners,
          {
            ...banner,
            id: `hb-${Date.now()}`,
            sortOrder: state.banners.length,
            createdAt: ts,
            updatedAt: ts,
          },
        ],
      };
    }),
  removeBanner: (id) =>
    set((state) => ({
      banners: state.banners
        .filter((b) => b.id !== id)
        .map((b, i) => ({ ...b, sortOrder: i })),
    })),
  updateBanner: (id, data) =>
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === id
          ? { ...b, ...data, updatedAt: new Date().toISOString() }
          : b
      ),
    })),
  reorder: (fromIndex, toIndex) =>
    set((state) => {
      const items = [...state.banners];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return {
        banners: items.map((item, i) => ({ ...item, sortOrder: i })),
      };
    }),
  toggleEnabled: (id) =>
    set((state) => ({
      banners: state.banners.map((b) =>
        b.id === id
          ? { ...b, enabled: !b.enabled, updatedAt: new Date().toISOString() }
          : b
      ),
    })),
}));
