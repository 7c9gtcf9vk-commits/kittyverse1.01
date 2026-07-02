import { NextRequest, NextResponse } from "next/server";
import { bannerStore } from "@/lib/banner-store";
import { dbToBanner } from "@/lib/banner-db";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/banners/[id]
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = bannerStore.getById(id);
    if (!record) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    return NextResponse.json(dbToBanner(record));
  } catch (error) {
    console.error("GET /api/admin/banners/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 });
  }
}

/**
 * PUT /api/admin/banners/[id]
 * Update a banner (partial update supported).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};

    if (body.type !== undefined) updateData.type = body.type;
    if (body.title?.zh !== undefined) updateData.titleZh = body.title.zh;
    if (body.title?.en !== undefined) updateData.titleEn = body.title.en;
    if (body.subtitle?.zh !== undefined) updateData.subtitleZh = body.subtitle.zh;
    if (body.subtitle?.en !== undefined) updateData.subtitleEn = body.subtitle.en;
    if (body.description?.zh !== undefined) updateData.descriptionZh = body.description.zh;
    if (body.description?.en !== undefined) updateData.descriptionEn = body.description.en;
    if (body.buttonText?.zh !== undefined) updateData.buttonTextZh = body.buttonText.zh;
    if (body.buttonText?.en !== undefined) updateData.buttonTextEn = body.buttonText.en;
    if (body.buttonLink !== undefined) updateData.buttonLink = body.buttonLink;
    if (body.enabled !== undefined) updateData.status = body.enabled;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.autoplayDelay !== undefined) updateData.autoplayDelay = body.autoplayDelay;

    // R2 resource fields
    if (body.image !== undefined) {
      updateData.imageUrl = body.image?.url ?? null;
      updateData.imageKey = body.image?.key ?? null;
      updateData.imageBucket = body.image?.bucket ?? null;
      updateData.imageMimeType = body.image?.mimeType ?? null;
      updateData.imageSize = body.image?.size ?? null;
      updateData.imageWidth = body.image?.width ?? null;
      updateData.imageHeight = body.image?.height ?? null;
    }
    if (body.mobileImage !== undefined) {
      updateData.mobileImageUrl = body.mobileImage?.url ?? null;
      updateData.mobileImageKey = body.mobileImage?.key ?? null;
      updateData.mobileImageBucket = body.mobileImage?.bucket ?? null;
      updateData.mobileImageMimeType = body.mobileImage?.mimeType ?? null;
      updateData.mobileImageSize = body.mobileImage?.size ?? null;
      updateData.mobileImageWidth = body.mobileImage?.width ?? null;
      updateData.mobileImageHeight = body.mobileImage?.height ?? null;
    }
    if (body.video !== undefined) {
      updateData.videoUrl = body.video?.url ?? null;
      updateData.videoKey = body.video?.key ?? null;
      updateData.videoBucket = body.video?.bucket ?? null;
      updateData.videoMimeType = body.video?.mimeType ?? null;
      updateData.videoSize = body.video?.size ?? null;
      updateData.videoDuration = body.video?.duration ?? null;
    }
    if (body.poster !== undefined) {
      updateData.posterUrl = body.poster?.url ?? null;
      updateData.posterKey = body.poster?.key ?? null;
      updateData.posterBucket = body.poster?.bucket ?? null;
      updateData.posterMimeType = body.poster?.mimeType ?? null;
      updateData.posterSize = body.poster?.size ?? null;
      updateData.posterWidth = body.poster?.width ?? null;
      updateData.posterHeight = body.poster?.height ?? null;
    }

    const record = bannerStore.update(id, updateData);
    return NextResponse.json(dbToBanner(record));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Banner not found") {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    console.error("PUT /api/admin/banners/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/banners/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    bannerStore.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Banner not found") {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/banners/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
