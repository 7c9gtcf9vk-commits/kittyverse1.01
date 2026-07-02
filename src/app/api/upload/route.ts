import { NextRequest, NextResponse } from "next/server";

/**
 * Upload API - handles file uploads to Cloudflare R2.
 *
 * In production, this should use the Cloudflare Workers R2 binding.
 * For local development without R2 credentials, files are stored
 * in the local filesystem as a fallback.
 */

const R2_ACCOUNT_ID = process.env.CF_R2_ACCOUNT_ID || "";
const R2_BUCKET = process.env.CF_R2_BUCKET || "kittyverse-media";
const R2_API_TOKEN = process.env.CF_R2_API_TOKEN || "";
const R2_PUBLIC_DOMAIN =
  process.env.CF_R2_PUBLIC_DOMAIN || `https://pub-${R2_ACCOUNT_ID}.r2.dev`;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const MAX_SIZE = 100 * 1024 * 1024;

function getPublicUrl(key: string): string {
  const base = R2_PUBLIC_DOMAIN.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${base}/${cleanKey}`;
}

async function uploadToR2(
  key: string,
  body: ArrayBuffer,
  contentType: string
): Promise<{ url: string }> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${R2_API_TOKEN}`,
      "Content-Type": contentType,
      "cf-cache-ttl": "31536000",
    },
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `R2 upload failed: ${(err as { errors?: Array<{ message: string }> }).errors?.[0]?.message || res.statusText}`
    );
  }

  return { url: getPublicUrl(key) };
}

async function deleteFromR2(key: string): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${R2_ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${R2_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `R2 delete failed: ${(err as { errors?: Array<{ message: string }> }).errors?.[0]?.message || res.statusText}`
    );
  }
}

// ─── Local fallback (when R2 is not configured) ───
// fs/promises and path are dynamically imported to avoid crashing on Cloudflare Workers.

async function getLocalUploader() {
  const { writeFile, unlink, mkdir } = await import("fs/promises");
  const path = await import("path");

  const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

  return {
    async uploadLocal(key: string, body: Buffer): Promise<{ url: string }> {
      const fullPath = path.join(LOCAL_UPLOAD_DIR, key);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, body);
      return { url: `/uploads/${key}` };
    },
    async deleteLocal(key: string): Promise<void> {
      const fullPath = path.join(LOCAL_UPLOAD_DIR, key);
      try { await unlink(fullPath); } catch { /* file may not exist */ }
    },
  };
}

const isR2Configured = Boolean(R2_API_TOKEN && R2_ACCOUNT_ID);

export async function POST(req: NextRequest) {
  try {
    // In Next.js App Router, we need to use the Web API FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = formData.get("key") as string | null;
    const bucket = formData.get("bucket") as string | null;

    if (!file || !key) {
      return NextResponse.json(
        { error: "Missing file or key" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (max ${(MAX_SIZE / 1024 / 1024).toFixed(0)}MB)`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let url: string;
    if (isR2Configured) {
      const result = await uploadToR2(key, buffer.buffer, file.type);
      url = result.url;
    } else {
      const { uploadLocal } = await getLocalUploader();
      const result = await uploadLocal(key, buffer);
      url = result.url;
    }

    return NextResponse.json({
      url,
      key,
      bucket: bucket || R2_BUCKET,
      mimeType: file.type,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { error: "Missing key" },
        { status: 400 }
      );
    }

    if (isR2Configured) {
      await deleteFromR2(key);
    } else {
      const { deleteLocal } = await getLocalUploader();
      await deleteLocal(key);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 }
    );
  }
}
