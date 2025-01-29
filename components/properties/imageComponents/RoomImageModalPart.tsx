"use client";
import { useEffect, useRef, useState } from "react";
import { ImageSlideType } from "./PropertiesImagesPart";
import Modal from "@/components/Modal";
import _STRINGS from "@/utils/LocalStrings";
import SwiperWithNavigation from "@/components/SwiperWithNavigation";
import SwiperCore, { Swiper as SwiperTyype } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import { NEW_IMAGE_URL } from "@/utils/urls";
const RoomImageModalPart = ({
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
        containerClass: `  w-full h-full`,
      }}
      onHide={() => {
        setModalProps({ ...modalProps, isVisible: false });
      }}
    >
      <div className=" bg-white  md:py-[10%] gap-2 px-3  items-center justify-center md:px-3 lg:px-4 2xl:px-[10%]   w-full flex flex-col   h-full    relative">
        <div className="flex fixed md:sticky   rounded-t-0 md:rounded-t-20 w-full z-[60]  dark:bg-zinc-800  gap-4 items-center h-12   top-4  col-span-5 px-4  ">
          <div className="flex border bg-white p-2 rounded-10 justify-center aspect-square items-center ">
            <img
              src="/assets/icons/adds/x_mark.svg"
              className={"w-4    h-auto mx-1 cursor-pointer dark:invert"}
              onClick={() => setModalProps({ ...modalProps, isVisible: false })}
            />
          </div>
          <div className="flex items-center gap-2">
            {" "}
            <h2 className="text-md dark:text-neutral-300">{modalProps?.data?.title}</h2>
          </div>
        </div>
        <div className="w-full   md:h-full  relative  md:px-[25%] ">
          {isVisible ? (
            <SwiperWithNavigation
              pagination={{
                clickable: true,
              }}
              dataLength={addImages?.length}
              // activeIndex={modalProps?.currentIndex}
              // setActiveIndex={setActiveIndex}
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
              className="!select-none centerise  flex !items-center "
            >
              {addImages?.map((i, index) => (
                <SwiperSlide
                  key={`index${index}`}
                  id={`${index}`}
                  className={`w-full   h-full    cursor-pointer !select-none `}
                >
                  {true ? (
                    // {i?.type == 1 ? (
                    <div className="swiper-zoom-container h-full  p-1 rounded-md border-2 !select-none">
                      <img className="w-fit  object-contain  h-full rounded-md   !select-none" src={NEW_IMAGE_URL(i)} />
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

        <div className=" w-full flex  flex-col gap-2 fixed bottom-12 md:bottom-auto px-4 md:!relative ">
          <div className="w-full pt-4 flex items-start justify-start">
            {" "}
            <p className="font-medium text-lg">
              {" "}
              {(activeIndex || 0) + 1}/{addImages?.length}
            </p>
          </div>
          <div className="w-full flex  ">
            {isVisible ? (
              <Swiper
                slidesPerView={4}
                breakpoints={{
                  320: {
                    slidesPerView: 4,
                  },
                  // when window width is >= 640px
                  640: {
                    slidesPerView: 4,
                  },
                  // when window width is >= 768px
                  768: {
                    slidesPerView: 7.5,
                    spaceBetween: 15,
                  },
                  1024: {
                    slidesPerView: 8,
                    spaceBetween: 20,
                  },
                  1600: {
                    slidesPerView: 8.5,
                    spaceBetween: 20,
                  },
                }}
                spaceBetween={10}
                className={"w-full px-0"}
                onBeforeInit={(swiper) => (mobileSwiper.current = swiper)}
              >
                {addImages?.map((i, index) => (
                  <SwiperSlide key={`imgprd${index}`} id={`imgprd${index}`}>
                    <div
                      className={` relative flex-1 md:flex-none w-full h-full  overflow-clip rounded-10 border cursor-pointer transition-all ease-in-out duration-300 ${
                        activeIndex == index
                          ? "border-primary-700  dark:border-zinc-200 "
                          : "border-gray-300 opacity-60 dark:border-zinc-600"
                      } `}
                      onClick={() => ref.current.slideTo(index)}
                    >
                      <img
                        onClick={() => ref.current.slideTo(index)}
                        // src={i?.type == 1 ? NEW_IMAGE_URL(i) : i?.cover}
                        src={i?.type == 1 ? NEW_IMAGE_URL(i, "thumbnail") : ""}
                        className={`  ${
                          i?.type != 1 ? " blur-sm" : ""
                        }  aspect-square  object-cover p-1 w-full rounded-10 h-full  `}
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
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoomImageModalPart;
