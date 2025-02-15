"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageSlideType } from "./PropertiesImagesPart";
import Modal from "@/components/Modal";
import _STRINGS from "@/utils/LocalStrings";

import SmallLoading from "@/components/shared/Lotties/SmallLoading";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Swiper from "@/components/embelaCarousel/Swiper";
import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import SwiperWithThumnails from "@/components/embelaCarousel/SwiperWithThumnails";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
      {" "}
      <div className=" bg-white  md:py-[5%] gap-2 px-3  items-center justify-center md:px-3 lg:px-4 2xl:px-[10%]   w-full flex flex-col   h-full    relative">
        <div className="flex fixed md:sticky   rounded-t-0 md:rounded-t-20 w-full z-[60]  dark:bg-zinc-800  gap-4 items-center h-12   top-4  col-span-5 px-4  ">
          <div
            onClick={() => setModalProps({ ...modalProps, isVisible: false })}
            className="flex border  cursor-pointer bg-white p-2 rounded-10 justify-center aspect-square items-center "
          >
            <img src="/assets/icons/adds/x_mark.svg" className={"w-4    h-auto mx-1 cursor-pointer dark:invert"} />
          </div>
          <div className="flex items-center gap-2">
            {" "}
            <h2 className="text-md dark:text-neutral-300">{modalProps?.data?.title}</h2>
          </div>
        </div>
        <div className="w-full   md:h-full  relative  md:px-[25%] ">
          {isVisible ? (
            <SwiperWithThumnails
              slides={addImages || []}
              slidesWidth={{ def: "100%", md: "100%" }}
              spacing="0.5rem"
              options={{ align: "center", direction: "rtl", dragFree: false }}
            >
              {addImages?.map((i, index) => (
                <div className="  flex items-center embla__slide  justify-center w-full h-full  p-1 rounded-md ">
                  <TransformWrapper panning={{ disabled: true }} disablePadding limitToBounds>
                    <TransformComponent>
                      <img
                        className="w-fit  embla__slide  object-contain  h-full rounded-md  !max-h-[60dvh]  "
                        src={NEW_IMAGE_URL(i)}
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              ))}
            </SwiperWithThumnails>
          ) : (
            <SmallLoading />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RoomImageModalPart;
