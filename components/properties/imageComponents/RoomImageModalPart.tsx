"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";

import type { ImageSlideType } from "./PropertiesImagesPart";

import SwiperWithThumnails from "@/components/embelaCarousel/SwiperWithThumnails";
import Skeleton from "@/components/elements/Skeleton/Skeleton";
import Modal from "@/components/Modal";

type TRoomImageModalProps = {
  alt?: string;
  modalProps?: ImageSlideType;
  addImages?: (any | undefined)[];
  setModalProps: (e?: ImageSlideType | null | any) => void | null | undefined;
};

const RoomImageModalPart = ({
  alt,
  addImages,
  modalProps,
  setModalProps,
}: TRoomImageModalProps) => {
  const isVisible = Boolean(modalProps?.isVisible);

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
            <img
              src="/assets/icons/adds/x_mark.svg"
              className={"w-4    h-auto mx-1 cursor-pointer dark:invert"}
            />
          </div>
          <div className="flex items-center gap-2">
            {" "}
            <h2 className=" !text-base  !line-clamp-1 dark:text-neutral-300">
              {modalProps?.data?.title}
            </h2>
          </div>
        </div>
        <div className="w-full   md:h-full  relative  md:px-[25%] ">
          {isVisible ? (
            <SwiperWithThumnails
              defaultSelectedIndex={
                modalProps?.currentIndex
                  ? Number(modalProps?.currentIndex)
                  : undefined
              }
              slides={addImages || []}
              slidesWidth={{ def: "100%", md: "100%" }}
              spacing="0.5rem"
              options={{ align: "center", direction: "rtl", dragFree: false }}
            >
              {addImages?.map((i) => (
                <div
                  key={`addImage${i?.id}`}
                  className="  flex items-center embla__slide  justify-center w-full h-full  p-1 rounded-md "
                >
                  <TransformWrapper
                    limitToBounds
                    disablePadding
                    panning={{ disabled: true }}
                  >
                    <TransformComponent>
                      <ContentImage
                        width={1024}
                        height={1024}
                        alt={alt || ""}
                        title={alt || ""}
                        src={NEW_IMAGE_URL(i)}
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="w-fit  embla__slide  object-contain  h-full rounded-md  !max-h-[60dvh]  "
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
};

export default RoomImageModalPart;
