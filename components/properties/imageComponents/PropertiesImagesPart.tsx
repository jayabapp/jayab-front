"use client";

import { Suspense, useEffect, useState } from "react";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "../../../utils/urls";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { useStoreInit } from "@/store";
import { ImageDto } from "@/api_services/auth/auth.interface";

import RoomImageModalPart from "./RoomImageModalPart";
import ProductImage from "./ProductImage";
import difference from "lodash/difference";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";
import Image from "next/image";

const Swiper = dynamic(() => import("@/components/embelaCarousel/Swiper"));
const SwiperSlide = dynamic(
  () => import("@/components/embelaCarousel/SwiperSlide"),
);

export type ProductDataType = {
  title: string;
  rate: number;
  price: number;
  gender: number;
  image: ImageDto;
  in_cart: number;
  category: string;
  colors: string[];
  full_title: string;
  rate_count: number;
  descripton: string;
  images: ImageDto[];
  id: string | number;
  is_favorite: boolean;
  discount_price: number;
  status: string | number;
  discount_percent: number;
  tags: {
    id: number;
    title: string;
    image: string;
  }[];
  properties: {
    id: number;
    value: string;
    title: string;
  }[];
  selected_color: {
    id: number;
    color: string;
    title: string;
  };
};
export type ImageSlideType = {
  data?: any;
  currentImage?: any;
  isVisible?: boolean;
  currentIndex?: number | null;
};

function ProductImagesContainer({
  data,
  productImageId,
  attsImagesArray,
}: {
  data: SinglePropDto | SingleOwnerPropertyDto;
  productImageId: number | null;
  attsImagesArray?: any[] | number[];
}) {
  const imagesDefautAlt = data?.title;
  const [currentIndex, setCurrentIndex] = useState(0);

  const { userInfo } = useStoreInit((data) => data);
  const [modalProps, setModalProps] = useState<ImageSlideType>({
    data: data,
    isVisible: false,
    currentIndex: null,
  });
  const defaultImages = [...data?.images];
  const [addImages, setAddImages] = useState<(any | undefined)[]>([
    ...data?.images,
  ]);
  const allImagesIds = difference(
    defaultImages?.map((e) => e?.id),
    attsImagesArray || [],
  );

  useEffect(() => {
    if (productImageId) {
      const activeImages = [productImageId]
        .concat(allImagesIds)
        .map((e) => defaultImages?.find((x) => x?.id == e));
      if (
        !!activeImages &&
        !isEmpty(activeImages) &&
        activeImages?.every((e) => !!e)
      ) {
        setAddImages(activeImages);
      }
    }
  }, [productImageId]);
  if (!data) return null;

  return (
    <div className={`flex flex-row w-full gap-2 overflow-visible`}>
      <div className="relative  hidden md:flex  md:w-1/5 ">
        <div
          className={`relative h-[100%]   flex flex-col md:p-0.5 mt-2 md:mt-0
        ${addImages?.length >= 4 ? "justify-between" : ""}    `}
        >
          {addImages?.slice(0, 4)?.map((e, index) => (
            <div
              onClick={() =>
                setModalProps({
                  isVisible: true,
                  data: data,
                  currentIndex: index,
                })
              }
              key={index}
              className={` relative over   p-0.5 rounded-20   w-full  first:mr-0 last:ml-0  flex flex-col items-center justify-center  cursor-pointer select-none aspect-square`}
            >
              {index == 3 ? (
                <div className="absolute font-extrabold text-xl  z-10  text-white ">
                  {addImages?.slice(3)?.length} +
                </div>
              ) : null}
              {true ? (
                <div
                  className={` rounded-10 overflow-clip  ${index == 3 ? " blur-sm " : " "}`}
                >
                  <ProductImage
                    item={e}
                    id={`${e?.id}`}
                    alt={imagesDefautAlt}
                    imageSize="thumbnail"
                    moreClass={"w-full bg-white aspect-square object-cover"}
                    onClick={() =>
                      setModalProps({ isVisible: false, currentImage: e })
                    }
                  />
                </div>
              ) : (
                <div
                  className={` relative flex-1 md:flex-none w-full !aspect-square   rounded-20   cursor-pointer transition-all ease-in-out duration-300  `}
                >
                  <img
                    className={`  ${
                      e?.type != 1 ? " blur-sm" : ""
                    } w-full !aspect-square object-contain     rounded-20  `}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {modalProps.isVisible && (
        <RoomImageModalPart
          alt={imagesDefautAlt}
          addImages={addImages}
          modalProps={modalProps}
          setModalProps={setModalProps}
        />
      )}
      <div className={`relative w-full md:w-4/5 h-fit `}>
        <div className="block  relative rounded-10 !aspect-square p-0 md:p-0.5 ">
          {!!userInfo?.advisor_id && data?.advisor_commission ? (
            <div className="w-24 gap-0.5  h-7 rounded-20 transition-all  py-[0.2rem]   bg-black/50 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
              <p className="  text-sm   ">
                کمیسیون: {data.advisor_commission}%
              </p>
            </div>
          ) : (
            <></>
          )}
          <Suspense>
            {" "}
            <Swiper
              slidesWidth={{ def: "100%", md: "100%" }}
              options={{ align: "center", direction: "rtl", dragFree: false }}
              onShowCountClick={(activeIndex: any) => {
                setModalProps({
                  isVisible: true,
                  data: data,
                  currentIndex: activeIndex,
                });
                setCurrentIndex(activeIndex);
              }}
              selectedIndexCb={(e) => {
                setCurrentIndex(e);
              }}
            >
              {addImages?.map((i, index: number) => (
                <SwiperSlide
                  key={index}
                  className={`w-full  !h-auto    cursor-pointer select-none `}
                >
                  <div
                    onClick={() =>
                      setModalProps({
                        isVisible: true,
                        data: data,
                        currentIndex: index,
                      })
                    }
                    className={`w-full    h-full  aspect-square relative  rounded-20 `}
                  >
                    {" "}
                    <Image
                      src={NEW_IMAGE_URL(
                        i || "",
                        currentIndex == index ? "name" : "thumbnail",
                      )}
                      fill
                      priority={index === 0}
                      title={imagesDefautAlt}
                      sizes="(max-width: 768px) 100vw, 80vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      alt={`${i?.alt || imagesDefautAlt || ""}`}
                      className={`w-full h-full !p-0  transform-gpu !overflow-clip  bg-white  transition-all
                      rounded-20 duration-500 aspect-square !object-cover `}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProductImagesContainer;
