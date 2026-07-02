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
export type BannerType = "image" | "video" | "mixed" | "rich-video" | "text";

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
  image: R2FileInfo | null;
  mobileImage: R2FileInfo | null;
  video: R2FileInfo | null;
  poster: R2FileInfo | null;
  buttonText: LocalizedText;
  buttonLink: string;
  autoplayDelay: number;
  sortOrder: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Public Banner shape (from /api/banners) ───
export type BannerCreatePayload = Omit<
  HeroBanner,
  "id" | "sortOrder" | "createdAt" | "updatedAt"
>;

// ─── API helpers ───
const api = {
  async fetchBanners(): Promise<HeroBanner[]> {
    const res = await fetch(`/api/banners?_=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch banners");
    return res.json();
  },
  async fetchAllBanners(): Promise<HeroBanner[]> {
    const res = await fetch(`/api/admin/banners?_=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch admin banners");
    return res.json();
  },
  async createBanner(data: BannerCreatePayload): Promise<HeroBanner> {
    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create banner");
    return res.json();
  },
  async updateBanner(
    id: string,
    data: Partial<HeroBanner>
  ): Promise<HeroBanner> {
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update banner");
    return res.json();
  },
  async deleteBanner(id: string): Promise<void> {
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete banner");
  },
  async reorderBanners(fromIndex: number, toIndex: number): Promise<void> {
    const res = await fetch("/api/admin/banners/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromIndex, toIndex }),
    });
    if (!res.ok) throw new Error("Failed to reorder banners");
  },
};

// ─── Store ───
interface HeroStore {
  banners: HeroBanner[];
  loading: boolean;
  /** Fetch enabled banners (public, for frontend HeroBanner) */
  fetchBanners: () => Promise<void>;
  /** Fetch ALL banners (admin, includes disabled) */
  fetchAllBanners: () => Promise<void>;
  /** Create banner via API and refresh admin list */
  addBanner: (data: BannerCreatePayload) => Promise<void>;
  /** Delete banner via API and refresh admin list */
  removeBanner: (id: string) => Promise<void>;
  /** Update banner via API and refresh admin list */
  updateBanner: (id: string, data: Partial<HeroBanner>) => Promise<void>;
  /** Reorder via API and refresh admin list */
  reorder: (fromIndex: number, toIndex: number) => Promise<void>;
  /** Toggle enabled via API and refresh admin list */
  toggleEnabled: (id: string) => Promise<void>;
}

export const useHeroStore = create<HeroStore>((set, get) => ({
  banners: [],
  loading: false,

  fetchBanners: async () => {
    try {
      const data = await api.fetchBanners();
      set({ banners: data });
    } catch (err) {
      console.error("fetchBanners error:", err);
    }
  },

  fetchAllBanners: async () => {
    try {
      set({ loading: true });
      const data = await api.fetchAllBanners();
      set({ banners: data, loading: false });
    } catch (err) {
      console.error("fetchAllBanners error:", err);
      set({ loading: false });
    }
  },

  addBanner: async (payload) => {
    try {
      await api.createBanner(payload);
      await get().fetchAllBanners();
    } catch (err) {
      console.error("addBanner error:", err);
    }
  },

  removeBanner: async (id) => {
    try {
      await api.deleteBanner(id);
      await get().fetchAllBanners();
    } catch (err) {
      console.error("removeBanner error:", err);
    }
  },

  updateBanner: async (id, data) => {
    try {
      await api.updateBanner(id, data);
      await get().fetchAllBanners();
    } catch (err) {
      console.error("updateBanner error:", err);
    }
  },

  reorder: async (fromIndex, toIndex) => {
    try {
      const state = get();
      // Optimistic UI update
      const items = [...state.banners];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      set({ banners: items.map((b, i) => ({ ...b, sortOrder: i })) });
      // Persist to backend
      await api.reorderBanners(fromIndex, toIndex);
      await get().fetchAllBanners();
    } catch (err) {
      console.error("reorder error:", err);
      await get().fetchAllBanners();
    }
  },

  toggleEnabled: async (id) => {
    try {
      const state = get();
      const banner = state.banners.find((b) => b.id === id);
      if (!banner) return;
      // Optimistic UI update
      set({
        banners: state.banners.map((b) =>
          b.id === id ? { ...b, enabled: !b.enabled } : b
        ),
      });
      await api.updateBanner(id, { enabled: !banner.enabled } as any);
      await get().fetchAllBanners();
    } catch (err) {
      console.error("toggleEnabled error:", err);
      await get().fetchAllBanners();
    }
  },
}));
