"use client";

import { FC, Fragment, useState } from "react";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";
import { ImageDto } from "@/api_services/auth/auth.interface";

import SwiperSlide from "../embelaCarousel/SwiperSlide";
import dynamic from "next/dynamic";
import Image from "next/image";
import Modal from "../Modal";

const Swiper = dynamic(() => import("../embelaCarousel/Swiper"), { ssr: true });

const GalleryItem: FC<{ item: ImageDto; _onPress: () => void }> = ({
  item,
  _onPress,
}) => {
  return (
    <div
      className="col-span-1 w-full aspect-square relative cursor-pointer"
      onClick={_onPress}
    >
      <Image
        fill
        alt={item?.alt as string}
        src={NEW_IMAGE_URL(item)}
        sizes="(min-width: 768px) 9vw, 28vw"
        className="w-full h-full rounded-md object-cover"
      />
    </div>
  );
};

const GalleryModal: FC<{
  isVisible: number;
  _onHide: () => void;
  images: ImageDto[];
}> = ({ isVisible, _onHide, images }) => {
  return (
    <Modal show={isVisible > 0} onHide={_onHide} type="bottom-sheet">
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
                src={NEW_IMAGE_URL(i, "name")}
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

const Gallery: FC<{ images: ImageDto[] }> = ({ images }) => {
  const [isVisible, setIsVisible] = useState(0);

  const _onPress = (index: number) => {
    setIsVisible(index + 1);
  };

  const _onHide = () => setIsVisible(0);

  if (images?.length > 0)
    return (
      <Fragment>
        <div className="grid grid-cols-3 gap-4">
          <p className="col-span-3">گالری تصاویر</p>
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
