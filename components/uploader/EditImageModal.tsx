import { Cropper, CropperRef } from "react-advanced-cropper";
//import "react-advanced-cropper/dist/style.css";
import _STRINGS from "@/utils/LocalStrings";

import { useEffect, useRef, useState } from "react";
import "react-advanced-cropper/dist/themes/compact.css";
import Modal from "../Modal";
import Button from "../shared/Button/Button";
import FixedBottomContainer from "../shared/FixedBottomContainer";
import {
  RatioIcon11,
  RatioIcon12,
  RatioIcon21,
  RatioIcon34,
  RatioIcon43,
  RatioIcon52,
  RatioIconFree,
} from "./icons/ratio-icons";

type Props = {
  imageUrl: string;
  cropRatio?: number;
  isUploading: boolean;
  onHide: () => void;
  onComplete: (image: File) => void;
};

const aspectRatioList = [
  { value: null, icon: RatioIconFree },
  { value: 1, icon: RatioIcon11 },
  { value: 3 / 4, icon: RatioIcon34 },
  { value: 4 / 3, icon: RatioIcon43 },
  { value: 2 / 1, icon: RatioIcon21 },
  { value: 1 / 2, icon: RatioIcon12 },
  { value: 5 / 2, icon: RatioIcon52 },
];
const EditImageModal = ({ imageUrl, isUploading, onHide, onComplete, cropRatio }: Props) => {
  const cropperRef = useRef<CropperRef>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(1);

  const convertCanvasToFile = () => {
    const canvas = cropperRef?.current?.getCanvas();
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const cropped = new File([blob], "cropped-image.png", { type: "image/png" });
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
    if (!imageUrl && !cropRatio) setAspectRatio(cropRatio || 1);
    else reset();
  }, [imageUrl, cropRatio]);

  useEffect(() => {
    if (!!cropRatio) {
      setAspectRatio(cropRatio);
    }
  }, [cropRatio]);

  const reset = () => {
    setAspectRatio(null);
    cropperRef?.current?.reset();
    setTimeout(() => {
      cropperRef?.current?.setCoordinates(({ imageSize }) => imageSize);
    }, 500);
  };
  return (
    <Modal
      options={{
        containerClass:
          " app-size app-text  !overflow-hidden flex flex-col items-center justify-center !bg-black  relative  rounded-lg overflow-y-scroll  bg-white !rounded-none dark:bg-dark-900",
        parentClass: "bg-white",
      }}
      show={!!imageUrl}
      onHide={() => {
        onHide();
      }}
    >
      <div className="relative  py-20 px-4 md:p-20 w-full h-[90dvh]  !relative   flex flex-col items-center justify-center">
        {/* <Cropper
          ref={cropperRef}
          src={imageUrl}
          stencilProps={{
            handlers: true,
            lines: false,
            movable: true,
            resizable: true,

            aspectRatio,
          }}
        /> */}
        <div className="flex w-full   relative  h-[60dvh] items-center justify-center">
          <Cropper
            defaultSize={({ imageSize }, settings) => {
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
            // onChange={onChange}
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
                <button className=" aspect-auto w-fit " key={i} onClick={() => setAspectRatio(e.value)}>
                  <Icon color={aspectRatio === e.value ? "#61dafb" : "#ffffff"} />
                </button>
              );
            })}
        </div>
        <div className="lg:absolute mt-8 lg:mt-0 flex justify-center lg:flex-col gap-6 left-3  lg:top-1/3">
          <img
            onClick={() => cropperRef?.current?.flipImage(true)}
            src={"/assets/icons/uploader/flip_icon.svg"}
            className=" scale-[-1] rotate-90 cursor-pointer  dark:invert-0 "
          />
          <img
            onClick={() => cropperRef?.current?.rotateImage(90, { transitions: true, normalize: true })}
            src={"/assets/icons/uploader/rotate_icon.svg"}
            className=" cursor-pointer   dark:invert-0 "
          />

          <div className="text-white  text-xs">
            <p onClick={() => reset()} className="cursor-pointer">
              {" "}
              reset
            </p>
          </div>
          <img
            onClick={() => cropperRef?.current?.rotateImage(-90, { transitions: true, normalize: true })}
            src={"/assets/icons/uploader/rotate_icon.svg"}
            className="  scale-x-[-1] cursor-pointer r dark:invert-0 "
          />
          <img
            onClick={() => cropperRef?.current?.flipImage(false, true)}
            className="   cursor-pointer ]  dark:invert-0 "
            src={"/assets/icons/uploader/flip_icon.svg"}
          />
        </div>

        <FixedBottomContainer containerClass={" gap-4 px-4  md:gap-8 !bg-transparent"}>
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
            variant="outline"
            containerClass="w-full"
            onClick={() => onHide()}
            width="w-full"
            title={"فعلا نه"}
            loading={isUploading}
            disabled={isUploading}
          />
        </FixedBottomContainer>
      </div>
    </Modal>
  );
};

export default EditImageModal;
