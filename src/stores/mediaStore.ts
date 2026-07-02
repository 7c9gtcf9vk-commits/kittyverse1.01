import { create } from "zustand";

// ─── R2 File Reference ───
export interface MediaR2Info {
  url: string;
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

// ─── Media Library Item ───
export interface MediaItem {
  id: string;
  name: string;
  nameEn?: string;
  type: "image" | "video" | "audio";
  url?: string;
  file: MediaR2Info;
  thumbnail?: string;
  description?: string;
  category: MediaCategory;
  tags: string[];
  createdAt: string;
  uploadedBy?: string;
}

export type MediaCategory =
  | "hero"
  | "project"
  | "blog"
  | "sticker"
  | "background"
  | "avatar"
  | "logo"
  | "general";

export const MEDIA_CATEGORIES: { value: MediaCategory; labelZh: string; labelEn: string }[] = [
  { value: "hero", labelZh: "Hero横幅", labelEn: "Hero Banner" },
  { value: "project", labelZh: "项目封面", labelEn: "Project Cover" },
  { value: "blog", labelZh: "博客封面", labelEn: "Blog Cover" },
  { value: "sticker", labelZh: "贴纸", labelEn: "Sticker" },
  { value: "background", labelZh: "背景图", labelEn: "Background" },
  { value: "avatar", labelZh: "头像", labelEn: "Avatar" },
  { value: "logo", labelZh: "Logo", labelEn: "Logo" },
  { value: "general", labelZh: "通用", labelEn: "General" },
];

interface MediaStore {
  items: MediaItem[];
  setItems: (items: MediaItem[]) => void;
  addItem: (item: Omit<MediaItem, "id" | "createdAt">) => void;
  addItems: (items: Omit<MediaItem, "id" | "createdAt">[]) => void;
  removeItem: (id: string) => void;
  removeItems: (ids: string[]) => void;
  updateItem: (id: string, data: Partial<MediaItem>) => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: `m${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  addItems: (items) =>
    set((state) => ({
      items: [
        ...state.items,
        ...items.map((item) => ({
          ...item,
          id: `m${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
        })),
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  removeItems: (ids) =>
    set((state) => ({
      items: state.items.filter((item) => !ids.includes(item.id)),
    })),
  updateItem: (id, data) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
}));
