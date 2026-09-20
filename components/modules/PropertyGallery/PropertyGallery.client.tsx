"use client";

import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { useMemo, useState } from "react";
import { ContentImage } from "@elements/Image";
import { useStoreInit } from "@/store";
import { Icon } from "@elements/Icon";

import type { PropertyGalleryProps } from "@/types/components/modules/property-gallery";

import PropertyPhotoViewer from "./PropertyPhotoViewer.client";
import SwiperSlide from "@elements/Carousel/SwiperSlide";
import difference from "lodash/difference";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Swiper from "@elements/Carousel/Swiper.client";

const THUMBNAIL_COUNT = 4;

const thumbnailSpan = (count: number, index: number) => {
  if (count === 1) return "col-span-2 row-span-2";
  if (count === 2) return "col-span-2 row-span-1";
  if (count === 3) return index === 0 ? "col-span-2 row-span-1" : "col-span-1";
  return "col-span-1";
};

const PropertyGallery = ({
  title,
  images,
  hostName,
  viewerActions,
  productImageId,
  advisorCommission,
}: PropertyGalleryProps) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { userInfo } = useStoreInit((state) => state);

  const orderedImages = useMemo(() => {
    const defaultImages = [...(images ?? [])];
    if (!productImageId) return defaultImages;

    const remainingIds = difference(
      defaultImages.map((image) => image?.id),
      [productImageId],
    );
    const pinnedFirst = [productImageId]
      .concat(remainingIds)
      .map((id) => defaultImages.find((image) => image?.id === id));

    return !isEmpty(pinnedFirst) && pinnedFirst.every(Boolean)
      ? (pinnedFirst as typeof defaultImages)
      : defaultImages;
  }, [images, productImageId]);

  if (isEmpty(orderedImages)) return <></>;

  const [mainImage, ...restImages] = orderedImages;
  const thumbnails = restImages.slice(0, THUMBNAIL_COUNT);
  const openViewer = (
    index: number,
    source: "carousel" | "grid" | "show_all",
  ) => {
    trackListingEvent("listing_gallery_open", { index });
    trackListingEvent("photo_viewer_open", { index, source });
    setViewerIndex(index);
  };

  return (
    <div className="relative w-full">
      {userInfo?.advisor_id && advisorCommission ? (
        <div className="absolute right-3 top-3 z-1 flex h-7 items-center rounded-full bg-neutral-900/60 px-3 text-white">
          <p className="text-xs">
            {_STRINGS.ADVISOR_COMMISSION_SHORT}: {advisorCommission}%
          </p>
        </div>
      ) : (
        <></>
      )}

      {/* Desktop: bento */}
      <div className="hidden aspect-[16/7] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-20 md:grid">
        <button
          type="button"
          onClick={() => openViewer(0, "grid")}
          aria-label={`${title ?? ""} 1`}
          className={`group relative cursor-pointer overflow-hidden bg-neutral-100 ${
            thumbnails.length
              ? "col-span-2 row-span-2"
              : "col-span-4 row-span-2"
          }`}
        >
          <ContentImage
            fill
            priority
            title={title}
            quality={PROPERTY_IMAGE_QUALITY}
            alt={mainImage?.alt || title || ""}
            sizes="(min-width: 1024px) 50vw, 60vw"
            src={getPropertyImageUrl(mainImage, "name")}
            className="object-cover transition-transform duration-500 group-hover:scale-102"
          />
        </button>

        {thumbnails.map((image, index) => (
          <button
            type="button"
            key={`gallery-thumb-${image?.id}`}
            onClick={() => openViewer(index + 1, "grid")}
            aria-label={`${title ?? ""} ${index + 2}`}
            className={`group relative cursor-pointer overflow-hidden bg-neutral-100 ${thumbnailSpan(
              thumbnails.length,
              index,
            )}`}
          >
            <ContentImage
              fill
              sizes="25vw"
              loading="lazy"
              alt={image?.alt || title || ""}
              quality={PROPERTY_IMAGE_QUALITY}
              src={getPropertyImageUrl(image, "medium")}
              fallbackSrc={getPropertyImageUrl(image, "name")}
              className="object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => openViewer(0, "show_all")}
          className="absolute bottom-4 left-4 flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-glass-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Icon name="images" size={20} />
          {_STRINGS.SHOW_ALL_PHOTOS} ({orderedImages.length})
        </button>
      </div>

      <div className="relative md:hidden">
        <Swiper
          selectedIndexCb={setCarouselIndex}
          slidesWidth={{ def: "100%", md: "100%" }}
          options={{ align: "center", direction: "rtl", dragFree: false }}
        >
          {orderedImages.map((image, index) => (
            <SwiperSlide
              key={`gallery-slide-${image?.id}`}
              className="w-full !h-auto cursor-pointer select-none"
            >
              <button
                type="button"
                onClick={() => openViewer(index, "carousel")}
                aria-label={`${title ?? ""} ${index + 1}`}
                className="relative block aspect-[4/3] w-full overflow-hidden rounded-20"
              >
                <ContentImage
                  fill
                  title={title}
                  sizes="100vw"
                  priority={index === 0}
                  alt={image?.alt || title || ""}
                  quality={PROPERTY_IMAGE_QUALITY}
                  className="bg-neutral-100 object-cover"
                  src={getPropertyImageUrl(image, "name")}
                  loading={index === 0 ? undefined : "lazy"}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <p className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-neutral-900/60 px-2.5 py-1 text-xs text-white">
          {carouselIndex + 1} {_STRINGS.PHOTO_OF} {orderedImages.length}
        </p>
      </div>

      <PropertyPhotoViewer
        alt={title}
        title={title}
        hostName={hostName}
        actions={viewerActions}
        images={orderedImages}
        startIndex={viewerIndex}
        show={viewerIndex !== null}
        onHide={() => setViewerIndex(null)}
        key={`viewer-${viewerIndex ?? "closed"}`}
      />
    </div>
  );
};

export default PropertyGallery;
