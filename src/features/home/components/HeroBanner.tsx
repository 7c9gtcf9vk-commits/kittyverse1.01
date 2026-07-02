"use client";

import { useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHeroStore } from "@/stores/heroStore";
import { useTranslation } from "react-i18next";
import type { Swiper as SwiperType } from "swiper";

export default function HeroBanner() {
  const { t, i18n } = useTranslation("home");
  const { banners, fetchBanners } = useHeroStore();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const autoplayPausedRef = useRef(false);

  // Fetch banners from API on mount
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const enabledBanners = banners
    .filter((b) => b.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params.navigation) {
      const nav = swiperRef.current.params.navigation;
      if (nav && typeof nav !== "boolean") {
        nav.prevEl = prevRef.current;
        nav.nextEl = nextRef.current;
        swiperRef.current.navigation.init();
        swiperRef.current.navigation.update();
      }
    }
  }, []);

  const getLocalized = (banner: (typeof enabledBanners)[number]) => {
    const isEn = i18n.language === "en-US";
    return {
      title: isEn ? banner.title.en || banner.title.zh : banner.title.zh,
      subtitle: isEn
        ? banner.subtitle.en || banner.subtitle.zh
        : banner.subtitle.zh,
      description: isEn
        ? banner.description.en || banner.description.zh
        : banner.description.zh,
      buttonText: isEn
        ? banner.buttonText.en || banner.buttonText.zh
        : banner.buttonText.zh,
    };
  };

  const isVideoType = (type: string) => type === "video" || type === "rich-video";
  const hasImageField = (type: string) => type === "image" || type === "mixed";

  const handleVideoEnded = useCallback(() => {
    if (
      swiperRef.current &&
      swiperRef.current.autoplay &&
      autoplayPausedRef.current
    ) {
      autoplayPausedRef.current = false;
      swiperRef.current.autoplay.start();
      swiperRef.current.slideNext();
    }
  }, []);

  const handleSlideChange = useCallback(() => {
    if (!swiperRef.current) return;
    const activeIndex =
      swiperRef.current.realIndex % enabledBanners.length;
    const activeBanner = enabledBanners[activeIndex];

    videoRefs.current.forEach((video) => {
      video.pause();
    });

    if (
      autoplayPausedRef.current &&
      !isVideoType(activeBanner?.type || "") &&
      swiperRef.current.autoplay
    ) {
      autoplayPausedRef.current = false;
      swiperRef.current.autoplay.start();
    }

    // Update per-banner autoplay delay
    if (swiperRef.current.autoplay) {
      const autoplayParams = swiperRef.current.params.autoplay || {};
      swiperRef.current.params.autoplay = {
        ...autoplayParams,
        delay: activeBanner?.autoplayDelay || 5000,
      };
      if (!autoplayPausedRef.current) {
        swiperRef.current.autoplay.stop();
        swiperRef.current.autoplay.start();
      }
    }

    if (isVideoType(activeBanner?.type || "") && activeBanner?.video?.url) {
      const video = videoRefs.current.get(activeBanner.id);
      if (video) {
        autoplayPausedRef.current = true;
        if (swiperRef.current.autoplay) {
          swiperRef.current.autoplay.stop();
        }
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  }, [enabledBanners]);

  const setVideoRef = useCallback(
    (bannerId: string) => (el: HTMLVideoElement | null) => {
      if (el) {
        videoRefs.current.set(bannerId, el);
      } else {
        videoRefs.current.delete(bannerId);
      }
    },
    []
  );

  if (enabledBanners.length === 0) {
    return (
      <section className="mx-auto max-w-[1280px] px-4 mt-8">
        <div
          className="w-full h-[520px] rounded-[32px] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--hero-from), var(--hero-to))",
          }}
        >
          <p className="text-muted-foreground text-lg">
            {t("hero.slide1.title")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1280px] px-4 mt-8 relative group">
      <div className="relative overflow-hidden rounded-[32px]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          slidesPerView={1}
          spaceBetween={0}
          centeredSlides
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{
            clickable: true,
            el: ".hero-pagination",
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          className="w-full h-[520px]"
        >
          {enabledBanners.map((banner) => {
            const text = getLocalized(banner);
            const index = enabledBanners.indexOf(banner);
            const imageUrl = banner.image?.url;
            const mobileImageUrl = banner.mobileImage?.url;
            const videoUrl = banner.video?.url;
            const posterUrl = banner.poster?.url || imageUrl;
            const showVideo = isVideoType(banner.type) && videoUrl;
            const hasAnyText = text.title || text.subtitle || text.description || text.buttonText;

            return (
              <SwiperSlide key={banner.id}>
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                  {/* Background image with mobile fallback */}
                  {imageUrl && (
                    <picture>
                      {mobileImageUrl && (
                        <source
                          media="(max-width: 768px)"
                          srcSet={mobileImageUrl}
                        />
                      )}
                      <img
                        src={imageUrl}
                        alt={text.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </picture>
                  )}

                  {!imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}

                  {/* Video overlay when type=video or rich-video */}
                  {showVideo && (
                    <video
                      ref={setVideoRef(banner.id)}
                      src={videoUrl}
                      poster={posterUrl || undefined}
                      muted
                      loop={false}
                      playsInline
                      controls={false}
                      onEnded={handleVideoEnded}
                      className="absolute inset-0 w-full h-full object-cover"
                      preload={index === 0 ? "auto" : "none"}
                    />
                  )}

                  {isVideoType(banner.type) && !videoUrl && posterUrl && (
                    <img
                      src={posterUrl}
                      alt={text.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}

                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-foreground/15" />

                  {/* Text overlay — only rendered when at least one text field exists */}
                  {hasAnyText && (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-16 max-w-[800px]">
                      {text.title && (
                        <h2 className="text-[32px] md:text-[54px] font-bold text-primary-foreground drop-shadow-lg mb-3 md:mb-4 leading-tight">
                          {text.title}
                        </h2>
                      )}
                      {text.subtitle && (
                        <p className="text-[16px] md:text-[21px] text-primary-foreground/90 max-w-[600px] drop-shadow mb-4 md:mb-5">
                          {text.subtitle}
                        </p>
                      )}
                      {text.description && (
                        <p className="text-sm md:text-base text-primary-foreground/80 max-w-[500px] drop-shadow mb-5 md:mb-6 leading-relaxed">
                          {text.description}
                        </p>
                      )}
                      {text.buttonText && (
                        <a
                          href={banner.buttonLink || "#"}
                          className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-card text-primary font-semibold rounded-full shadow-lg hover:bg-card/90 transition-colors text-sm md:text-base"
                        >
                          {text.buttonText}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2" />

        <button
          ref={prevRef}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={t("hero.prev")}
        >
          <ChevronLeft className="w-6 h-6 text-muted-foreground" />
        </button>
        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label={t("hero.next")}
        >
          <ChevronRight className="w-6 h-6 text-muted-foreground" />
        </button>
      </div>
    </section>
  );
}
