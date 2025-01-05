"use client";
import React, { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Swiper as SwiperTyype } from "swiper";
import { NEW_IMAGE_URL } from "../../../utils/urls";
// import Modal from "../shared/Modal";

import Image from "next/image";
import _STRINGS from "@/utils/LocalStrings";
import { ImageDto } from "@/api_services/auth/auth.interface";
import Modal from "../../Modal";
import SwiperWithNavigation from "../../SwiperWithNavigation";
import SmallLoading from "../../shared/Lotties/SmallLoading";
import Device from "@/helpers/Device";
import _, { isEmpty } from "lodash";
import ProductImage from "./ProductImage";
import { SinglePropDto } from "@/api_services/property/property.interface";
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
type ImageSlideType = {
  currentIndex?: number | null;
  isVisible?: boolean;
  data?: any;
  currentImage?: any;
};

const ImagesSliderModal = ({
  modalProps,
  setModalProps,
  addImages,
}: {
  addImages?: (any | undefined)[];
  modalProps?: ImageSlideType;
  setModalProps: (e?: ImageSlideType | null | any) => void | null | undefined;
}) => {
  const [isVisible, setisVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(modalProps?.currentIndex);

  const mobileSwiper = useRef(null) as any;
  const ref = useRef(null) as any;

  useEffect(() => {
    if (modalProps?.isVisible) {
      setTimeout(() => {
        setisVisible(true);
      }, 200);
    } else {
      setisVisible(false);
    }
    setActiveIndex(modalProps?.currentIndex);
  }, [modalProps]);
  useEffect(() => {
    if (activeIndex != null && mobileSwiper?.current) {
      mobileSwiper?.current?.slideTo(activeIndex);
    }
  }, [activeIndex, mobileSwiper.current]);

  const media =
    modalProps?.data?.video && !!addImages
      ? [...addImages, modalProps?.data?.video]
      : !!addImages
      ? [...addImages]
      : [];

  return (
    <Modal
      show={modalProps?.isVisible}
      options={{
        containerClass: `  app-size  pb-[4rem] md:pb-0  !mt-0  overflow-y-scroll   mx-auto   lg:!my-16  w-11/12 md:w-2/3 xl:w-2/3 2xl:w-2/3 rounded-0 md:rounded-20 overflow-y-scroll  bg-white dark:bg-zinc-900`,
      }}
      onHide={() => setModalProps({ ...modalProps, isVisible: false })}
    >
      <div className="  w-full h-screen md:h-fit grid grid-cols-5 gap-x-10 relative">
        <div className="flex fixed md:sticky   rounded-t-0 md:rounded-t-20 w-full z-[60] bg-white dark:bg-zinc-800 justify-between items-center h-12   top-0 col-span-5 px-4 border-b border-b-neutral-300 dark:border-b-zinc-600 ">
          <div className="flex items-center gap-2">
            {" "}
            <h2 className="text-md dark:text-neutral-300">{"_STRINGS.A89"}</h2>
            <div className="text-red-700  rounded-10 z-1  dark:text-red-400 text-xs ">* {"_STRINGS.B52"}</div>
          </div>
          <div className="flex items-center ">
            <img
              src="/assets/icons/adds/x_mark.svg"
              className={"w-4   h-auto mx-1 cursor-pointer dark:invert"}
              onClick={() => setModalProps({ ...modalProps, isVisible: false })}
            />
          </div>
        </div>
        <div className="col-span-5 md:col-span-3  mt-5 md:mt-0 relative border-l border-l-gray-300 dark:border-l-zinc-600  pt-12 lg:pt-0 ">
          {isVisible ? (
            <SwiperWithNavigation
              pagination={{
                clickable: true,
              }}
              dataLength={1}
              activeIndex={modalProps?.currentIndex}
              setActiveIndex={setActiveIndex}
              spaceBetween={10}
              slidesPerView={1}
              reference={ref}
              onBeforeInit={(swiper: SwiperCore) => {
                ref.current = swiper;
              }}
              onActiveIndexChange={(swiper: SwiperCore) => {
                // setzoomEnabled(false);
                return setActiveIndex((index) => swiper.activeIndex);
              }}
              initialSlide={activeIndex}
              className="!select-none"
            >
              {addImages?.map((i, index) => (
                <SwiperSlide key={`index${index}`} id={`${index}`} className={`w-full  cursor-pointer !select-none `}>
                  {true ? (
                    // {i?.type == 1 ? (
                    <div className="swiper-zoom-container !select-none">
                      <img className="w-full aspect-square  object-contain !select-none" src={NEW_IMAGE_URL(i)} />
                    </div>
                  ) : (
                    <video
                      controls
                      width="100%"
                      height="100%"
                      onClick={(e) => {
                        // if (refer?.current?.paused) {
                        //   // refer?.current?.play();
                        //   setShowPlay(false);
                        // } else {
                        //   // refer?.current?.pause();
                        // }
                      }}
                      // poster={}
                      id="myVideo"
                      className="relative bg-black w-full aspect-square object-contain"
                    >
                      <source src={i?.name} type="video/mp4" />
                      <source src={i?.name} type="video/ogg" />
                    </video>
                  )}
                </SwiperSlide>
              ))}
            </SwiperWithNavigation>
          ) : (
            <SmallLoading />
          )}
        </div>
        <div className="col-span-5 md:col-span-2  flex flex-col justify-start px-2 md:px-0 pt-6  ">
          <p className="font-bold text-right ml-4 text-base dark:text-neutral-300">{modalProps?.data?.title}</p>
          <Device>
            {({ isMobile }) => {
              if (isMobile) {
                if (isVisible)
                  return (
                    <Swiper
                      slidesPerView={4}
                      spaceBetween={10}
                      className={"w-full px-0"}
                      onBeforeInit={(swiper) => (mobileSwiper.current = swiper)}
                    >
                      {addImages?.map((i, index) => (
                        <SwiperSlide key={`imgprd${index}`} id={`imgprd${index}`}>
                          <div
                            className={` relative flex-1 md:flex-none w-full !aspect-square  overflow-clip rounded-10 border cursor-pointer transition-all ease-in-out duration-300 ${
                              activeIndex == index
                                ? "border-primary-700  dark:border-zinc-200 "
                                : "border-gray-300 opacity-60 dark:border-zinc-600"
                            } `}
                            onClick={() => ref.current.slideTo(index)}
                          >
                            <img
                              onClick={() => ref.current.slideTo(index)}
                              // src={i?.type == 1 ? NEW_IMAGE_URL(i) : i?.cover}
                              src={i?.type == 1 ? NEW_IMAGE_URL(i) : ""}
                              className={`  ${
                                i?.type != 1 ? " blur-sm" : ""
                              } p-1 w-full rounded-10 !aspect-square object-contain `}
                            />
                            {/* {i?.type != 1 ? (
                              <img
                                src="/assets/icons/products/play-cricle.svg"
                                className="left-1/2 top-1/2 rounded-10 absolute "
                                style={{ transform: "translate(-50%,-50%)" }}
                              />
                            ) : (
                              <></>
                            )} */}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  );
              } else {
                return (
                  <div className="flex !overflow-x-scroll shrink-0 flex-nowrap  md:flex-wrap  z-50  ">
                    {media?.map((i, index) => (
                      <div
                        key={`imgprd${index}`}
                        className={` relative flex-1 md:flex-none overflow-clip md:shrink-0 w-24 h-24 !aspect-square object-contain rounded-10 border cursor-pointer mx-2 my-2 transition-all ease-in-out duration-300 ${
                          activeIndex == index
                            ? "border-primary-700  dark:border-zinc-200 "
                            : "border-gray-300 dark:border-zinc-600"
                        } `}
                        onClick={() => ref.current.slideTo(index)}
                      >
                        {" "}
                        <img
                          id={`imgprd${index}`}
                          key={`imgprd${index}`}
                          // src={i?.type == 1 ? NEW_IMAGE_URL(i) : i?.cover}
                          src={i?.type == 1 ? NEW_IMAGE_URL(i) : ""}
                          className={` ${
                            i?.type != 1 ? " blur-sm" : ""
                          } p-1 flex-1 rounded-10 md:flex-none md:shrink-0 w-24 h-24 !aspect-square object-contain `}
                        />
                        {/* {i?.type != 1 ? (
                          <img
                            src="/assets/icons/products/play-cricle.svg"
                            className="left-1/2 top-1/2 absolute "
                            style={{ transform: "translate(-50%,-50%)" }}
                          />
                        ) : (
                          <></>
                        )} */}
                      </div>
                    ))}
                  </div>
                );
              }
            }}
          </Device>
        </div>
      </div>
    </Modal>
  );
};

function ProductImagesContainer({
  data,
  productImageId,
  attsImagesArray,
}: {
  data: SinglePropDto;
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
  const allImagesIds = _.difference(
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
      <div className="relative w-1/5 ">
        <div
          className={`relative h-[100%] justify-between gap-2 flex flex-col md:p-0.5 mt-2 md:mt-0
            `}
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
        <ImagesSliderModal addImages={addImages} modalProps={modalProps} setModalProps={setModalProps} />
      )}
      {/* ${!data?.cheapest_price ? "grayscale" : ""}  */}
      <div
        className={`relative 
         w-4/5 h-fit `}
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
