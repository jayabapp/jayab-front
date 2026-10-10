"use client";

import { BLOG_DETAIL_IMAGE_QUALITY } from "@features/blog/constants/image";
import { getUploadedImageUrl } from "@features/upload/mappers/upload-image.mapper";
import { Fragment, useState } from "react";
import { BLOG_IMAGE_QUALITY } from "@features/blog/constants/image";
import { useTranslations } from "next-intl";
import { ContentImage } from "@/components/elements/Image";

import type { BlogGalleryModalProps } from "@/types/components/modules/blog";
import type { BlogGalleryProps } from "@/types/components/modules/blog";
import type { TGalleryItem } from "@/types/components/modules/blog";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import Modal from "@elements/Modal";
import dynamic from "next/dynamic";

const Swiper = dynamic(() => import("@elements/Carousel/Swiper.client"), {
  ssr: true,
});

const GalleryItem = ({ item, _onPress }: TGalleryItem) => {
  return (
    <div
      className="col-span-1 w-full aspect-square relative cursor-pointer"
      onClick={_onPress}
    >
      <ContentImage
        fill
        alt={item?.alt as string}
        quality={BLOG_IMAGE_QUALITY}
        src={getUploadedImageUrl(item)}
        sizes="(min-width: 768px) 9vw, 28vw"
        className="w-full h-full rounded-md object-cover"
      />
    </div>
  );
};

const GalleryModal = ({
  images,
  _onHide,
  isVisible,
}: BlogGalleryModalProps) => {
  return (
    <Modal show={isVisible > 0} onHide={_onHide}>
      {isVisible > 0 && (
        <Swiper
          options={{
            startIndex: isVisible - 1,
            align: "start",
            direction: "rtl",
          }}
          withArrows
          slidesWidth={{ def: "100%", md: "100%" }}
        >
          {images?.map((i) => (
            <SwiperSlide
              key={`MODAL${i?.id}`}
              className="!w-full flex  justify-center items-center  aspect-square relative "
            >
              <ContentImage
                width={1024}
                height={1024}
                alt={i?.alt as string}
                quality={BLOG_DETAIL_IMAGE_QUALITY}
                src={getUploadedImageUrl(i, "name")}
                sizes="(min-width: 768px) 50vw, 75vw"
                className="w-3/4 aspect-square rounded-md object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Modal>
  );
};

const Gallery = ({ images }: BlogGalleryProps) => {
  const t = useTranslations("content");

  const [isVisible, setIsVisible] = useState(0);

  const _onPress = (index: number) => {
    setIsVisible(index + 1);
  };

  const _onHide = () => setIsVisible(0);

  if (images?.length > 0)
    return (
      <Fragment>
        <div className="grid grid-cols-3 gap-4">
          <p className="col-span-3">{t("gallery")}</p>
          {images?.map((i, index) => (
            <GalleryItem
              item={i}
              _onPress={() => _onPress(index)}
              key={i?.id}
            />
          ))}
        </div>
        <GalleryModal images={images} isVisible={isVisible} _onHide={_onHide} />
      </Fragment>
    );
};

export default Gallery;
