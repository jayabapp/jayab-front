"use client";
import React, { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Swiper as SwiperTyype } from "swiper";
import { NEW_IMAGE_URL } from "../../../utils/urls";
// import Modal from "../shared/Modal";

import Image from "next/image";
import _STRINGS from "@/utils/LocalStrings";
import { ImageDto } from "@/api_services/auth/auth.interface";

import SwiperWithNavigation from "../../SwiperWithNavigation";

import { difference, isEmpty } from "lodash";
import ProductImage from "./ProductImage";
import { SingleOwnerPropertyDto, SinglePropDto } from "@/api_services/property/property.interface";
import RoomImageModalPart from "./RoomImageModalPart";
// const ProductOptionsContainer = dynamic(() => import("./ProductOptionsContainer"), {
//   ssr: false,
// });

export type ProductDataType = {
  image: ImageDto;
  id: string | number;
  status: string | number;
  title: string;
  category: string;
  full_title: string;
  descripton: string;
  colors: string[];

  price: number;
  discount_percent: number;
  in_cart: number;
  discount_price: number;
  gender: number;
  rate_count: number;
  rate: number;
  images: ImageDto[];
  is_favorite: boolean;
  tags: {
    title: string;
    id: number;
    image: string;
  }[];
  properties: {
    value: string;
    title: string;
    id: number;
  }[];
  selected_color: {
    color: string;
    title: string;
    id: number;
  };
};
export type ImageSlideType = {
  currentIndex?: number | null;
  isVisible?: boolean;
  data?: any;
  currentImage?: any;
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
  const ref = useRef<SwiperTyype>(null);
  const [modalProps, setModalProps] = useState<ImageSlideType>({
    data: data,
    isVisible: false,
    currentIndex: null,
  });
  const defaultImages =
    //  data?.video
    //   ? [data?.feature_image, ...data?.images, data?.video]
    //   :
    [data?.feature_image, ...data?.images];
  const [addImages, setAddImages] = useState<(any | undefined)[]>(
    // data?.video ? [data?.feature_image, ...data?.images, data?.video] :
    [data?.feature_image, ...data?.images]
  );
  const allImagesIds = difference(
    defaultImages?.map((e) => e?.id),
    attsImagesArray || []
  );

  // Here we filter out images with diffrent tag ids.  only the selectd tags image and default ones

  useEffect(() => {
    if (productImageId) {
      const activeImages = [productImageId].concat(allImagesIds).map((e) => defaultImages?.find((x) => x?.id == e));
      if (!!activeImages && !isEmpty(activeImages) && activeImages?.every((e) => !!e)) {
        setAddImages(activeImages);
      }
    }
  }, [productImageId]);
  useEffect(() => {
    if (productImageId) {
      ref.current?.slideTo(productImageId ? addImages?.findIndex((e) => e?.id == productImageId) : 0);
    }
  }, [addImages]);

  if (!data) return null;
  return (
    <div className={`flex flex-row w-full gap-2 overflow-visible`}>
      <div className="relative  hidden md:flex  md:w-1/5 ">
        <div
          className={`relative h-[100%]  gap-2 flex flex-col md:p-0.5 mt-2 md:mt-0
        ${addImages?.length >= 4 ? "justify-between" : ""}    `}
        >
          {/* ${
         !data?.cheapest_price ? "grayscale" : ""
       } */}
          {addImages?.slice(0, 4)?.map((e, index) => (
            <div
              onClick={() => setModalProps({ isVisible: true, data: data, currentIndex: index })}
              key={index}
              className={` relative over   p-0.5 rounded-20   w-full  first:mr-0 last:ml-0  flex flex-col items-center justify-center  cursor-pointer select-none aspect-square`}
            >
              {index == 3 ? <div className="absolute font-extrabold text-3xl  z-10 text-zinc-900 "> ...</div> : null}
              {/* {e?.type == 1 ? ( */}
              {true ? (
                <div className={` rounded-10 overflow-clip  ${index == 3 ? " blur-sm " : " "}`}>
                  <ProductImage
                    id={`${e?.id}`}
                    item={e}
                    moreClass={"w-full bg-white aspect-square object-cover"}
                    onClick={() => setModalProps({ isVisible: false, currentImage: e })}
                  />
                </div>
              ) : (
                <div
                  className={` relative flex-1 md:flex-none w-full !aspect-square   rounded-20   cursor-pointer transition-all ease-in-out duration-300  `}
                >
                  <img
                    // src={e?.cover}
                    className={`  ${
                      e?.type != 1 ? " blur-sm" : ""
                    } w-full !aspect-square object-contain     rounded-20  `}
                  />

                  {/* <img
                    src="/assets/icons/products/play-cricle.svg"
                    className="left-1/2 top-1/2 absolute "
                    style={{ transform: "translate(-50%,-50%)" }}
                  /> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {modalProps.isVisible && (
        <RoomImageModalPart addImages={addImages} modalProps={modalProps} setModalProps={setModalProps} />
      )}
      {/* ${!data?.cheapest_price ? "grayscale" : ""}  */}
      <div
        className={`relative 
  w-full       md:w-4/5 h-fit `}
      >
        <div className="block  relative rounded-10 !aspect-square p-0 md:p-0.5 ">
          <SwiperWithNavigation
            pagination={{
              clickable: true,
            }}
            reference={ref}
            onBeforeInit={(swiper: SwiperTyype) => (ref.current = swiper)}
            dataLength={0}
            slidesPerView={1}
            spaceBetween={10}
            className={"w-full  overflow-clip   rounded-20  px-0"}
          >
            {addImages
              // ?.filter((e) => e?.type == 1)
              ?.map((i, index) => (
                <SwiperSlide key={`imgprd${index}`} id={`imgprd${index}`}>
                  <div
                    onClick={() => setModalProps({ isVisible: true, data: data, currentIndex: index })}
                    className={`w-full    h-full  aspect-square relative  rounded-20 `}
                  >
                    {" "}
                    {!!i ? (
                      <Image
                        fill
                        src={NEW_IMAGE_URL(i || "")}
                        className="w-full h-full !p-0 custome-shadow-card !overflow-clip  bg-white  rounded-20  aspect-square !object-cover "
                        alt=""
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </SwiperSlide>
              ))}
          </SwiperWithNavigation>
        </div>
      </div>
    </div>
  );
}

export default ProductImagesContainer;

// {/* <div className={`md:hidden `}>
// <SwiperWithNavigation
//   reference={ref}
//   onBeforeInit={(swiper: SwiperTyype) => (ref.current = swiper)}
//   dataLength={addImages?.length}
//   slidesPerView={1}
//   spaceBetween={10}
//   className={"w-full px-0"}
// >
//   {addImages
//     ?.filter((e) => e?.type == 1)
//     ?.map((i, index) => (
//       <SwiperSlide key={`imgprd${index}`} id={`imgprd${index}`}>
//         <div className={`w-full h-full mb-2 aspect-square relative `}>
//           {" "}
//           <Image
//             fill
//             src={NEW_IMAGE_URL(i || "")}
//             className="w-full h-full !p-1 aspect-square !object-contain"
//             alt=""
//           />
//         </div>
//       </SwiperSlide>
//     ))}
// </SwiperWithNavigation>
// {/* )} */}
// </div> */}
