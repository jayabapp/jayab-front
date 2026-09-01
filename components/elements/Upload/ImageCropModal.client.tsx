"use client";

import type { ImageCropModalProps } from "@/types/components/elements/upload";
import { RatioIcon43, RatioIcon52, RatioIconFree } from "./ratio-icons";
import { RatioIcon21, RatioIcon34 } from "./ratio-icons";
import { RatioIcon11, RatioIcon12 } from "./ratio-icons";
import type { CropperRef } from "react-advanced-cropper";
import { useEffect, useRef, useState } from "react";
import { Cropper } from "react-advanced-cropper";
import { ContentImage } from "@elements/Image";
import { colors } from "@/theme/colors";

import FixedBottomContainer from "@elements/FixedBottomContainer";
import "react-advanced-cropper/dist/themes/compact.css";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const aspectRatioList = [
  { value: null, icon: RatioIconFree },
  { value: 1, icon: RatioIcon11 },
  { value: 3 / 4, icon: RatioIcon34 },
  { value: 4 / 3, icon: RatioIcon43 },
  { value: 2 / 1, icon: RatioIcon21 },
  { value: 1 / 2, icon: RatioIcon12 },
  { value: 5 / 2, icon: RatioIcon52 },
];
const EditImageModal = ({
  imageUrl,
  isUploading,
  onHide,
  onComplete,
  cropRatio,
}: ImageCropModalProps) => {
  const cropperRef = useRef<CropperRef>(null);
  const mountedRef = useRef(true);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(cropRatio ?? 1);

  const convertCanvasToFile = () => {
    const canvas = cropperRef?.current?.getCanvas();
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob && mountedRef.current) {
          const cropped = new File([blob], "cropped-image.png", {
            type: "image/png",
          });
          onComplete(cropped);
        } else {
          const error = new Error(`${blob}blob does not exict`);
          error.name = "Blob error";
        }
      }, "image/png");
    } else {
      const error = new Error(`${canvas}canvas does not exict`);
      error.name = "Canvas error";
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const reset = () => {
    setAspectRatio(null);
    cropperRef?.current?.reset();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      cropperRef?.current?.setCoordinates(({ imageSize }) => imageSize);
    }, 500);
  };
  return (
    <Modal
      options={{
        containerClass:
          " app-size app-text  !overflow-hidden flex flex-col items-center justify-center !bg-black  relative  rounded-lg overflow-y-scroll  bg-white !rounded-none ",
        parentClass: "bg-white",
      }}
      show={!!imageUrl}
      onHide={() => {
        onHide();
      }}
    >
      <div className="relative py-20 px-4 md:p-20 w-full h-[90dvh] flex flex-col items-center justify-center">
        <div className="flex w-full   relative  h-[60dvh] items-center justify-center">
          <Cropper
            key={imageUrl}
            defaultSize={({ imageSize }) => {
              return {
                width: imageSize.width,
                height: imageSize.height,
              };
            }}
            style={{ height: "60dvh" }}
            ref={cropperRef}
            stencilProps={{
              aspectRatio: cropRatio || aspectRatio || undefined,
            }}
            src={imageUrl}
            className={"cropper"}
          />
        </div>
        <div className="mt-4  flex flex-row h-24 justify-center !overflow-x-scroll  items-center gap-2  w-full ">
          {aspectRatioList
            .filter((e) => {
              if (cropRatio) {
                return e?.value == cropRatio;
              } else {
                return e;
              }
            })
            .map((e, i) => {
              const Icon = e.icon;
              return (
                <button
                  className=" aspect-auto w-fit "
                  key={i}
                  onClick={() => setAspectRatio(e.value)}
                >
                  <Icon
                    color={
                      aspectRatio === e.value
                        ? colors.brand[400]
                        : "currentColor"
                    }
                  />
                </button>
              );
            })}
        </div>
        <div className="lg:absolute mt-8 lg:mt-0 flex justify-center lg:flex-col gap-6 left-3  lg:top-1/3">
          <ContentImage
            alt=""
            height={24}
            width={24}
            onClick={() => cropperRef?.current?.flipImage(true)}
            src={"/assets/icons/uploader/flip_icon.svg"}
            className=" scale-[-1] rotate-90 cursor-pointer   "
          />
          <ContentImage
            alt=""
            height={24}
            width={24}
            onClick={() =>
              cropperRef?.current?.rotateImage(90, {
                transitions: true,
                normalize: true,
              })
            }
            src={"/assets/icons/uploader/rotate_icon.svg"}
            className=" cursor-pointer    "
          />

          <div className="text-white  text-xs">
            <p onClick={() => reset()} className="cursor-pointer">
              {" "}
              reset
            </p>
          </div>
          <ContentImage
            alt=""
            height={24}
            width={24}
            onClick={() =>
              cropperRef?.current?.rotateImage(-90, {
                transitions: true,
                normalize: true,
              })
            }
            src={"/assets/icons/uploader/rotate_icon.svg"}
            className="  scale-x-[-1] cursor-pointer r  "
          />
          <ContentImage
            alt=""
            height={24}
            width={24}
            onClick={() => cropperRef?.current?.flipImage(false, true)}
            className="   cursor-pointer ]   "
            src={"/assets/icons/uploader/flip_icon.svg"}
          />
        </div>

        <FixedBottomContainer
          containerClass={" gap-4 px-4  md:gap-8 !bg-transparent"}
        >
          <Button
            containerClass="w-full"
            onClick={() => {
              if (!isUploading && cropperRef?.current) {
                convertCanvasToFile();
              }
            }}
            title={_STRINGS.SUBMIT}
            width="w-full"
            loading={isUploading}
            disabled={isUploading}
          />

          <Button
            color="danger"
            width="w-full"
            title={"فعلا نه"}
            variant="outline"
            loading={isUploading}
            disabled={isUploading}
            containerClass="w-full"
            onClick={() => onHide()}
          />
        </FixedBottomContainer>
      </div>
    </Modal>
  );
};

export default EditImageModal;
