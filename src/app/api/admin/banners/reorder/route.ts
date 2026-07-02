import { NextRequest, NextResponse } from "next/server";
import { bannerStore } from "@/lib/banner-store";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/banners/reorder
 * Body: { fromIndex: number, toIndex: number }
 * Moves the banner at fromIndex to toIndex in the sortOrder-ascending list.
 */
export async function PATCH(req: NextRequest) {
  try {
    const { fromIndex, toIndex } = await req.json();

    if (fromIndex === undefined || toIndex === undefined) {
      return NextResponse.json(
        { error: "fromIndex and toIndex are required" },
        { status: 400 }
      );
    }

    bannerStore.reorder(fromIndex, toIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (message === "Invalid index") {
      return NextResponse.json({ error: "Index out of range" }, { status: 400 });
    }
    console.error("PATCH /api/admin/banners/reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder banners" },
      { status: 500 }
    );
  }
}
