"use client";

import Header from "@/features/home/components/Header";
import HeroBanner from "@/features/home/components/HeroBanner";
import FloatingStickers from "@/features/home/components/FloatingStickers";
import FeaturedCards from "@/features/home/components/FeaturedCards";
import CharacterGallery from "@/features/home/components/CharacterGallery";
import LatestContent from "@/features/home/components/LatestContent";
import Footer from "@/features/home/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <FloatingStickers />
      <main className="max-w-[1440px] mx-auto">
        <HeroBanner />
        <FeaturedCards />
        <CharacterGallery />
        <LatestContent />
      </main>
      <Footer />
    </>
  );
}
