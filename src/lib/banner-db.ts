/**
 * Convert a Banner DB record to the HeroBanner frontend shape.
 */
export function dbToBanner(record: any) {
  return {
    id: record.id,
    type: record.type,
    title: { zh: record.titleZh, en: record.titleEn },
    subtitle: { zh: record.subtitleZh, en: record.subtitleEn },
    description: { zh: record.descriptionZh, en: record.descriptionEn },
    image: record.imageUrl
      ? {
          url: record.imageUrl,
          key: record.imageKey ?? "",
          bucket: record.imageBucket ?? "",
          mimeType: record.imageMimeType ?? "",
          size: record.imageSize ?? 0,
          width: record.imageWidth ?? undefined,
          height: record.imageHeight ?? undefined,
        }
      : null,
    mobileImage: record.mobileImageUrl
      ? {
          url: record.mobileImageUrl,
          key: record.mobileImageKey ?? "",
          bucket: record.mobileImageBucket ?? "",
          mimeType: record.mobileImageMimeType ?? "",
          size: record.mobileImageSize ?? 0,
          width: record.mobileImageWidth ?? undefined,
          height: record.mobileImageHeight ?? undefined,
        }
      : null,
    video: record.videoUrl
      ? {
          url: record.videoUrl,
          key: record.videoKey ?? "",
          bucket: record.videoBucket ?? "",
          mimeType: record.videoMimeType ?? "",
          size: record.videoSize ?? 0,
          duration: record.videoDuration ?? undefined,
        }
      : null,
    poster: record.posterUrl
      ? {
          url: record.posterUrl,
          key: record.posterKey ?? "",
          bucket: record.posterBucket ?? "",
          mimeType: record.posterMimeType ?? "",
          size: record.posterSize ?? 0,
          width: record.posterWidth ?? undefined,
          height: record.posterHeight ?? undefined,
        }
      : null,
    buttonText: { zh: record.buttonTextZh, en: record.buttonTextEn },
    buttonLink: record.buttonLink,
    autoplayDelay: record.autoplayDelay,
    sortOrder: record.sortOrder,
    enabled: record.status,
    createdAt: typeof record.createdAt === "string" ? record.createdAt : record.createdAt.toISOString(),
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : record.updatedAt.toISOString(),
  };
}

/**
 * Build Prisma create/update data from a partial HeroBanner shape.
 */
export function bannerToDbData(data: any) {
  const db: any = {};
  if (data.type !== undefined) db.type = data.type;
  if (data.title) {
    db.titleZh = data.title.zh ?? "";
    db.titleEn = data.title.en ?? "";
  }
  if (data.subtitle) {
    db.subtitleZh = data.subtitle.zh ?? "";
    db.subtitleEn = data.subtitle.en ?? "";
  }
  if (data.description) {
    db.descriptionZh = data.description.zh ?? "";
    db.descriptionEn = data.description.en ?? "";
  }
  if (data.buttonText) {
    db.buttonTextZh = data.buttonText.zh ?? "";
    db.buttonTextEn = data.buttonText.en ?? "";
  }
  if (data.buttonLink !== undefined) db.buttonLink = data.buttonLink;
  if (data.autoplayDelay !== undefined) db.autoplayDelay = data.autoplayDelay;
  if (data.sortOrder !== undefined) db.sortOrder = data.sortOrder;
  if (data.enabled !== undefined) db.status = data.enabled;

  // R2 image
  if (data.image !== undefined) {
    if (data.image) {
      db.imageUrl = data.image.url;
      db.imageKey = data.image.key ?? "";
      db.imageBucket = data.image.bucket ?? "";
      db.imageMimeType = data.image.mimeType ?? "";
      db.imageSize = data.image.size ?? 0;
      db.imageWidth = data.image.width ?? null;
      db.imageHeight = data.image.height ?? null;
    } else {
      db.imageUrl = null;
      db.imageKey = null;
      db.imageBucket = null;
      db.imageMimeType = null;
      db.imageSize = null;
      db.imageWidth = null;
      db.imageHeight = null;
    }
  }
  if (data.mobileImage !== undefined) {
    if (data.mobileImage) {
      db.mobileImageUrl = data.mobileImage.url;
      db.mobileImageKey = data.mobileImage.key ?? "";
      db.mobileImageBucket = data.mobileImage.bucket ?? "";
      db.mobileImageMimeType = data.mobileImage.mimeType ?? "";
      db.mobileImageSize = data.mobileImage.size ?? 0;
      db.mobileImageWidth = data.mobileImage.width ?? null;
      db.mobileImageHeight = data.mobileImage.height ?? null;
    } else {
      db.mobileImageUrl = null;
      db.mobileImageKey = null;
      db.mobileImageBucket = null;
      db.mobileImageMimeType = null;
      db.mobileImageSize = null;
      db.mobileImageWidth = null;
      db.mobileImageHeight = null;
    }
  }
  if (data.video !== undefined) {
    if (data.video) {
      db.videoUrl = data.video.url;
      db.videoKey = data.video.key ?? "";
      db.videoBucket = data.video.bucket ?? "";
      db.videoMimeType = data.video.mimeType ?? "";
      db.videoSize = data.video.size ?? 0;
      db.videoDuration = data.video.duration ?? null;
    } else {
      db.videoUrl = null;
      db.videoKey = null;
      db.videoBucket = null;
      db.videoMimeType = null;
      db.videoSize = null;
      db.videoDuration = null;
    }
  }
  if (data.poster !== undefined) {
    if (data.poster) {
      db.posterUrl = data.poster.url;
      db.posterKey = data.poster.key ?? "";
      db.posterBucket = data.poster.bucket ?? "";
      db.posterMimeType = data.poster.mimeType ?? "";
      db.posterSize = data.poster.size ?? 0;
      db.posterWidth = data.poster.width ?? null;
      db.posterHeight = data.poster.height ?? null;
    } else {
      db.posterUrl = null;
      db.posterKey = null;
      db.posterBucket = null;
      db.posterMimeType = null;
      db.posterSize = null;
      db.posterWidth = null;
      db.posterHeight = null;
    }
  }

  return db;
}
