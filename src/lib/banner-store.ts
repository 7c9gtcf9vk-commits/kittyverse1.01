import { seedBanners } from "./banner-seed";

export interface BannerRecord {
  id: string;
  type: string;
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  imageUrl: string | null;
  imageKey: string | null;
  imageBucket: string | null;
  imageMimeType: string | null;
  imageSize: number | null;
  imageWidth: number | null;
  imageHeight: number | null;
  mobileImageUrl: string | null;
  mobileImageKey: string | null;
  mobileImageBucket: string | null;
  mobileImageMimeType: string | null;
  mobileImageSize: number | null;
  mobileImageWidth: number | null;
  mobileImageHeight: number | null;
  videoUrl: string | null;
  videoKey: string | null;
  videoBucket: string | null;
  videoMimeType: string | null;
  videoSize: number | null;
  videoDuration: number | null;
  posterUrl: string | null;
  posterKey: string | null;
  posterBucket: string | null;
  posterMimeType: string | null;
  posterSize: number | null;
  posterWidth: number | null;
  posterHeight: number | null;
  buttonTextZh: string;
  buttonTextEn: string;
  buttonLink: string;
  autoplayDelay: number;
  status: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detect if running in a Node.js environment (local dev / build).
 * Cloudflare Workers do not have `process.release` or `process.cwd()`.
 */
function isNodeEnv(): boolean {
  return typeof process !== "undefined" && process.release?.name === "node";
}

// ── Node.js filesystem backend (local dev) ──────────────────────────

function nodeReadAll(): BannerRecord[] {
  // dynamic import to avoid crashing on Workers
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  const dataPath = path.join(process.cwd(), "data", "banners.json");
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [...seedBanners];
  }
}

function nodeWriteAll(records: BannerRecord[]): void {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("fs") as typeof import("fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  const dataPath = path.join(process.cwd(), "data", "banners.json");
  const dir = path.dirname(dataPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(records, null, 2), "utf-8");
}

// ── In-memory backend (Cloudflare Workers) ──────────────────────────

let memoryStore: BannerRecord[] | null = null;

function memReadAll(): BannerRecord[] {
  if (!memoryStore) {
    memoryStore = seedBanners.map((b) => ({ ...b }));
  }
  return memoryStore;
}

function memWriteAll(records: BannerRecord[]): void {
  memoryStore = records;
}

// ── Unified backend ─────────────────────────────────────────────────

function readAll(): BannerRecord[] {
  return isNodeEnv() ? nodeReadAll() : memReadAll();
}

function writeAll(records: BannerRecord[]): void {
  if (isNodeEnv()) {
    nodeWriteAll(records);
  } else {
    memWriteAll(records);
  }
}

function cuid(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}

export const bannerStore = {
  /** Get enabled banners, sorted by sortOrder */
  getEnabled(): BannerRecord[] {
    return readAll()
      .filter((b) => b.status === true)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },

  /** Get all banners (admin), sorted by sortOrder */
  getAll(): BannerRecord[] {
    return readAll().sort((a, b) => a.sortOrder - b.sortOrder);
  },

  /** Get by ID */
  getById(id: string): BannerRecord | undefined {
    return readAll().find((b) => b.id === id);
  },

  /** Create a new banner */
  create(data: Partial<BannerRecord>): BannerRecord {
    const records = readAll();
    const now = new Date().toISOString();
    const record: BannerRecord = {
      id: cuid(),
      type: data.type || "image",
      titleZh: data.titleZh || "",
      titleEn: data.titleEn || "",
      subtitleZh: data.subtitleZh || "",
      subtitleEn: data.subtitleEn || "",
      descriptionZh: data.descriptionZh || "",
      descriptionEn: data.descriptionEn || "",
      imageUrl: data.imageUrl ?? null,
      imageKey: data.imageKey ?? null,
      imageBucket: data.imageBucket ?? null,
      imageMimeType: data.imageMimeType ?? null,
      imageSize: data.imageSize ?? null,
      imageWidth: data.imageWidth ?? null,
      imageHeight: data.imageHeight ?? null,
      mobileImageUrl: data.mobileImageUrl ?? null,
      mobileImageKey: data.mobileImageKey ?? null,
      mobileImageBucket: data.mobileImageBucket ?? null,
      mobileImageMimeType: data.mobileImageMimeType ?? null,
      mobileImageSize: data.mobileImageSize ?? null,
      mobileImageWidth: data.mobileImageWidth ?? null,
      mobileImageHeight: data.mobileImageHeight ?? null,
      videoUrl: data.videoUrl ?? null,
      videoKey: data.videoKey ?? null,
      videoBucket: data.videoBucket ?? null,
      videoMimeType: data.videoMimeType ?? null,
      videoSize: data.videoSize ?? null,
      videoDuration: data.videoDuration ?? null,
      posterUrl: data.posterUrl ?? null,
      posterKey: data.posterKey ?? null,
      posterBucket: data.posterBucket ?? null,
      posterMimeType: data.posterMimeType ?? null,
      posterSize: data.posterSize ?? null,
      posterWidth: data.posterWidth ?? null,
      posterHeight: data.posterHeight ?? null,
      buttonTextZh: data.buttonTextZh || "",
      buttonTextEn: data.buttonTextEn || "",
      buttonLink: data.buttonLink || "",
      autoplayDelay: data.autoplayDelay || 5000,
      status: data.status !== undefined ? data.status : true,
      sortOrder: data.sortOrder !== undefined ? data.sortOrder : records.length,
      createdAt: now,
      updatedAt: now,
    };
    records.push(record);
    writeAll(records);
    return record;
  },

  /** Update a banner */
  update(id: string, data: Partial<BannerRecord>): BannerRecord {
    const records = readAll();
    const idx = records.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Banner not found");
    records[idx] = {
      ...records[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    writeAll(records);
    return records[idx];
  },

  /** Delete a banner */
  delete(id: string): void {
    const records = readAll();
    const filtered = records.filter((b) => b.id !== id);
    if (filtered.length === records.length) throw new Error("Banner not found");
    writeAll(filtered);
  },

  /** Reorder: move fromIndex to toIndex */
  reorder(fromIndex: number, toIndex: number): void {
    const records = readAll().sort((a, b) => a.sortOrder - b.sortOrder);
    if (fromIndex < 0 || fromIndex >= records.length || toIndex < 0 || toIndex >= records.length) {
      throw new Error("Invalid index");
    }
    const [moved] = records.splice(fromIndex, 1);
    records.splice(toIndex, 0, moved);
    records.forEach((b, i) => (b.sortOrder = i));
    writeAll(records);
  },
};
