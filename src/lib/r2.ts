/**
 * Cloudflare R2 Object Storage utilities
 * Supports presigned URLs for secure upload without exposing credentials.
 */

export interface R2UploadResult {
  url: string;
  key: string;
  bucket: string;
}

export interface R2MediaInfo {
  url: string;
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

const R2_ACCOUNT_ID = process.env.CF_R2_ACCOUNT_ID || "";
const R2_BUCKET = process.env.CF_R2_BUCKET || "kittyverse-media";
const R2_PUBLIC_DOMAIN =
  process.env.CF_R2_PUBLIC_DOMAIN ||
  (R2_ACCOUNT_ID ? `https://pub-${R2_ACCOUNT_ID}.r2.dev` : "");
const R2_API_TOKEN = process.env.CF_R2_API_TOKEN || "";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function getAllowedTypes(type: "image" | "video"): string[] {
  return type === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
}

export function getMaxFileSize(): number {
  return MAX_FILE_SIZE;
}

export function validateFile(
  file: File,
  type: "image" | "video"
): { valid: boolean; error?: string } {
  const allowedTypes = getAllowedTypes(type);
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `不支持的文件类型: ${file.type}. 仅允许 ${allowedTypes.join(", ")}`,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `文件大小超过限制 (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`,
    };
  }
  return { valid: true };
}

/**
 * Build the public URL for a given R2 key
 */
export function getPublicUrl(key: string): string {
  const base = R2_PUBLIC_DOMAIN.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${base}/${cleanKey}`;
}

/**
 * Generate a unique storage key for a file
 */
export function generateKey(
  prefix: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop() || "bin";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const safeName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\.[^.]+$/, "");
  return `${prefix}/${timestamp}-${random}-${safeName}.${ext}`;
}

/**
 * Upload a file to Cloudflare R2 via the Worker Upload API.
 * Uses a server-side API route to avoid exposing credentials.
 */
export async function uploadToR2(
  file: File,
  prefix: string,
  onProgress?: (percent: number) => void
): Promise<R2MediaInfo> {
  const key = generateKey(prefix, file.name);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);
  formData.append("bucket", R2_BUCKET);
  formData.append("prefix", prefix);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText) as R2MediaInfo;
          resolve(result);
        } catch {
          reject(new Error("Invalid response from server"));
        }
      } else {
        let message = "Upload failed";
        try {
          const err = JSON.parse(xhr.responseText);
          message = err.error || message;
        } catch {}
        reject(new Error(message));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

/**
 * Delete a file from R2 via API
 */
export async function deleteFromR2(key: string): Promise<void> {
  const res = await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, bucket: R2_BUCKET }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Delete failed" }));
    throw new Error(err.error || "Delete failed");
  }
}

export function getR2Config() {
  return {
    bucket: R2_BUCKET,
    publicDomain: R2_PUBLIC_DOMAIN,
    isConfigured: Boolean(R2_API_TOKEN && R2_ACCOUNT_ID),
  };
}
