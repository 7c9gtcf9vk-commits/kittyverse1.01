import { NextResponse } from "next/server";
import { bannerStore } from "@/lib/banner-store";
import { dbToBanner } from "@/lib/banner-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/banners
 * Public endpoint – returns only enabled banners, sorted by sortOrder ASC.
 */
export async function GET() {
  try {
    const records = bannerStore.getEnabled();
    const banners = records.map(dbToBanner);
    return NextResponse.json(banners, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
