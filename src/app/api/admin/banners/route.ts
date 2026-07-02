import { NextRequest, NextResponse } from "next/server";
import { bannerStore } from "@/lib/banner-store";
import { dbToBanner } from "@/lib/banner-db";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/banners
 * Admin endpoint – returns ALL banners, sorted by sortOrder.
 */
export async function GET() {
  try {
    const records = bannerStore.getAll();
    return NextResponse.json(records.map(dbToBanner), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/banners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/banners
 * Create a new banner.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const record = bannerStore.create({
      type: body.type || "image",
      titleZh: body.title?.zh || body.titleZh || "",
      titleEn: body.title?.en || body.titleEn || "",
      subtitleZh: body.subtitle?.zh || body.subtitleZh || "",
      subtitleEn: body.subtitle?.en || body.subtitleEn || "",
      descriptionZh: body.description?.zh || body.descriptionZh || "",
      descriptionEn: body.description?.en || body.descriptionEn || "",
      status: body.enabled !== undefined ? body.enabled : true,
      sortOrder: body.sortOrder,
      autoplayDelay: body.autoplayDelay || 5000,
      buttonLink: body.buttonLink || "",
      buttonTextZh: body.buttonText?.zh || body.buttonTextZh || "",
      buttonTextEn: body.buttonText?.en || body.buttonTextEn || "",
      imageUrl: body.image?.url ?? null,
      imageKey: body.image?.key ?? null,
      imageBucket: body.image?.bucket ?? null,
      imageMimeType: body.image?.mimeType ?? null,
      imageSize: body.image?.size ?? null,
      imageWidth: body.image?.width ?? null,
      imageHeight: body.image?.height ?? null,
      mobileImageUrl: body.mobileImage?.url ?? null,
      mobileImageKey: body.mobileImage?.key ?? null,
      mobileImageBucket: body.mobileImage?.bucket ?? null,
      mobileImageMimeType: body.mobileImage?.mimeType ?? null,
      mobileImageSize: body.mobileImage?.size ?? null,
      mobileImageWidth: body.mobileImage?.width ?? null,
      mobileImageHeight: body.mobileImage?.height ?? null,
      videoUrl: body.video?.url ?? null,
      videoKey: body.video?.key ?? null,
      videoBucket: body.video?.bucket ?? null,
      videoMimeType: body.video?.mimeType ?? null,
      videoSize: body.video?.size ?? null,
      videoDuration: body.video?.duration ?? null,
      posterUrl: body.poster?.url ?? null,
      posterKey: body.poster?.key ?? null,
      posterBucket: body.poster?.bucket ?? null,
      posterMimeType: body.poster?.mimeType ?? null,
      posterSize: body.poster?.size ?? null,
      posterWidth: body.poster?.width ?? null,
      posterHeight: body.poster?.height ?? null,
    });
    return NextResponse.json(dbToBanner(record), { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/banners error:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
