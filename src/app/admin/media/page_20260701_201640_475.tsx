"use client";

import dynamic from "next/dynamic";

const MediaLibrary = dynamic(
  () => import("@/features/media/components/MediaLibrary"),
  { ssr: false }
);

export default function MediaAdminPage() {
  return <MediaLibrary />;
}
