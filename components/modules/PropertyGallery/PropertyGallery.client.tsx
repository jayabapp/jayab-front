"use client";

import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import type { PropertyGalleryProps } from "@/types/components/modules/property-gallery";
import { Suspense, useMemo, useState } from "react";
import { ContentImage } from "@elements/Image";
import { useStoreInit } from "@/store";

import GalleryLightbox from "./parts/GalleryLightbox.client";
import GalleryThumbnail from "./parts/GalleryThumbnail";
import _STRINGS from "@/utils/LocalStrings";
import difference from "lodash/difference";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";

const Swiper = dynamic(() => import("@/components/embelaCarousel/Swiper"));
const SwiperSlide = dynamic(
  () => import("@/components/embelaCarousel/SwiperSlide"),
);

const THUMBNAIL_COUNT = 4;

const PropertyGallery = ({
  title,
  images,
  advisorCommission,
  productImageId,
}: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
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

  const openLightbox = (index: number) => setLightboxIndex(index);

  if (isEmpty(orderedImages)) return null;

  return (
    <div className="flex flex-row w-full gap-2 overflow-visible">
      <div className="relative hidden md:flex md:w-1/5">
        <div
          className={`relative h-[100%] flex flex-col md:p-0.5 mt-2 md:mt-0 ${
            orderedImages.length >= THUMBNAIL_COUNT ? "justify-between" : ""
          }`}
        >
          {orderedImages.slice(0, THUMBNAIL_COUNT).map((image, index) => (
            <button
              type="button"
              key={`thumbnail-${image?.id}`}
              onClick={() => openLightbox(index)}
              aria-label={`${title ?? ""} ${index + 1}`}
              className="relative p-0.5 rounded-20 w-full first:mr-0 last:ml-0 flex flex-col items-center justify-center cursor-pointer select-none aspect-square"
            >
              {index === THUMBNAIL_COUNT - 1 ? (
                <span className="absolute font-extrabold text-xl z-10 text-white">
                  {orderedImages.slice(THUMBNAIL_COUNT - 1).length} +
                </span>
              ) : null}
              <span
                className={`rounded-10 overflow-clip ${index === THUMBNAIL_COUNT - 1 ? "blur-sm" : ""}`}
              >
                <GalleryThumbnail
                  item={image}
                  alt={title}
                  id={`${image?.id}`}
                  imageSize="thumbnail"
                  moreClass="w-full bg-white aspect-square object-cover"
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <GalleryLightbox
        alt={title}
        title={title}
        images={orderedImages}
        startIndex={lightboxIndex}
        show={lightboxIndex !== null}
        onHide={() => setLightboxIndex(null)}
      />

      <div className="relative w-full md:w-4/5 h-fit">
        <div className="block relative rounded-10 !aspect-square p-0 md:p-0.5">
          {userInfo?.advisor_id && advisorCommission ? (
            <div className="w-24 gap-0.5 h-7 rounded-20 transition-all py-[0.2rem] bg-black/50 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
              <p className="text-sm">
                {_STRINGS.ADVISOR_COMMISSION_SHORT}: {advisorCommission}%
              </p>
            </div>
          ) : null}
          <Suspense>
            <Swiper
              slidesWidth={{ def: "100%", md: "100%" }}
              options={{ align: "center", direction: "rtl", dragFree: false }}
              selectedIndexCb={(index) => setCurrentIndex(index)}
              onShowCountClick={(activeIndex: number) => {
                setCurrentIndex(activeIndex);
                openLightbox(activeIndex);
              }}
            >
              {orderedImages.map((image, index) => (
                <SwiperSlide
                  key={`slide-${image?.id}`}
                  className="w-full !h-auto cursor-pointer select-none"
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    aria-label={`${title ?? ""} ${index + 1}`}
                    className="w-full h-full aspect-square relative rounded-20"
                  >
                    <ContentImage
                      fill
                      title={title}
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 80vw"
                      loading={index === 0 ? undefined : "lazy"}
                      alt={`${image?.alt || title || ""}`}
                      src={getPropertyImageUrl(
                        image,
                        currentIndex === index ? "name" : "thumbnail",
                      )}
                      className="w-full h-full !p-0 transform-gpu !overflow-clip bg-white transition-all rounded-20 duration-500 aspect-square !object-cover"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PropertyGallery;
