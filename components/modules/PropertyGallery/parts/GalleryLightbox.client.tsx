"use client";

import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import type { GalleryLightboxProps } from "@/types/components/modules/property-gallery";
import { PROPERTY_DETAIL_IMAGE_QUALITY } from "@features/properties/constants/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { ContentImage } from "@elements/Image";

import SwiperWithThumnails from "@elements/Carousel/SwiperWithThumbnails.client";
import PropertyImageDownloadButton from "./PropertyImageDownloadButton.client";
import Skeleton from "@elements/Skeleton/Skeleton";
import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";

const GalleryLightbox = ({
  alt,
  show,
  title,
  images,
  onHide,
  startIndex,
}: GalleryLightboxProps) => (
  <Modal
    show={show}
    onHide={onHide}
    options={{ containerClass: "w-full h-full" }}
  >
    <div className="bg-white md:py-[5%] gap-2 px-3 items-center justify-center md:px-3 lg:px-4 2xl:px-[10%] w-full flex flex-col h-full relative">
      <div className="flex fixed md:sticky rounded-t-0 md:rounded-t-20 w-full z-[60] gap-4 items-center h-12 top-4 col-span-5 px-4">
        <button
          type="button"
          onClick={onHide}
          aria-label={_STRINGS.CLOSE}
          className="flex border cursor-pointer bg-white p-2 rounded-10 justify-center aspect-square items-center"
        >
          <ContentImage
            alt=""
            width={16}
            height={16}
            className="w-4 h-auto mx-1"
            src="/assets/icons/adds/x_mark.svg"
          />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="!text-base !line-clamp-1">{title}</h2>
        </div>
      </div>

      <div className="w-full md:h-full relative md:px-[25%]">
        {show ? (
          <SwiperWithThumnails
            slides={images}
            spacing="0.5rem"
            slidesWidth={{ def: "100%", md: "100%" }}
            options={{ align: "center", direction: "rtl", dragFree: false }}
            defaultSelectedIndex={
              startIndex === null || startIndex === undefined
                ? undefined
                : Number(startIndex)
            }
          >
            {images?.map((image) => (
              <div
                key={`gallery-image-${image?.id}`}
                className="relative flex items-center embla__slide justify-center w-full h-full p-1 rounded-md"
              >
                <PropertyImageDownloadButton attachmentId={image?.id} />
                <TransformWrapper
                  limitToBounds
                  disablePadding
                  panning={{ disabled: true }}
                >
                  <TransformComponent>
                    <ContentImage
                      unoptimized
                      width={1024}
                      height={1024}
                      alt={alt || ""}
                      title={alt || ""}
                      src={getPropertyImageUrl(image)}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      quality={PROPERTY_DETAIL_IMAGE_QUALITY}
                      className="w-fit embla__slide object-contain h-full rounded-md !max-h-[60dvh]"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            ))}
          </SwiperWithThumnails>
        ) : (
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        )}
      </div>
    </div>
  </Modal>
);

export default GalleryLightbox;
