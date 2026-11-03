"use client";

import { RatioIcon43, RatioIcon52, RatioIconFree } from "./ratio-icons";
import { useEffect, useRef, useState } from "react";
import { RatioIcon21, RatioIcon34 } from "./ratio-icons";
import { RatioIcon11, RatioIcon12 } from "./ratio-icons";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { Cropper } from "react-advanced-cropper";
import { colors } from "@/theme/colors";

import type { ImageCropModalProps } from "@/types/components/elements/upload";
import type { CropperRef } from "react-advanced-cropper";

import FixedBottomContainer from "@elements/FixedBottomContainer";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

import "react-advanced-cropper/dist/themes/compact.css";

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
  onHide,
  imageUrl,
  cropRatio,
  maxDimension = 2560,
  onComplete,
  isUploading,
}: ImageCropModalProps) => {
  const t = useTranslations("common");

  const cropperRef = useRef<CropperRef>(null);
  const mountedRef = useRef(true);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(cropRatio ?? 1);
  const [ready, setReady] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertCanvasToFile = () => {
    setError(null);
    setPreparing(true);
    try {
      // Bound the cropper's canvas before allocation. PNG avoids an extra
      // lossy JPEG encode before the server processes the cropped image.
      const canvas = cropperRef.current?.getCanvas({
        maxWidth: maxDimension,
        maxHeight: maxDimension,
        imageSmoothingQuality: "high",
      });
      if (!canvas) throw new Error("No cropped image");
      if (canvas.width < 32 || canvas.height < 32) {
        setError(t("imageUploadTooSmall"));
        setPreparing(false);
        return;
      }
      canvas.toBlob((blob) => {
        if (!mountedRef.current) return;
        setPreparing(false);
        if (!blob) {
          setError(t("imageUploadInvalid"));
          return;
        }
        onComplete(
          new File([blob], "cropped-image.png", { type: "image/png" }),
        );
      }, "image/png");
    } catch {
      setPreparing(false);
      setError(t("imageUploadInvalid"));
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
          " app-size app-text max-h-[100dvh] flex flex-col items-center justify-center !bg-black  relative  rounded-lg overflow-y-scroll overflow-x-hidden  bg-surface !rounded-none ",
        parentClass: "bg-surface",
      }}
      show={!!imageUrl}
      onHide={() => onHide()}
    >
      <div className="relative py-4 px-4 md:p-20 w-full h-[90dvh] flex flex-col items-center justify-center">
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
            onReady={() => {
              setReady(true);
              setError(null);
            }}
            onError={() => {
              setReady(false);
              setError(t("imageUploadInvalid"));
            }}
            stencilProps={{
              aspectRatio: cropRatio || aspectRatio || undefined,
            }}
            src={imageUrl}
            className={"cropper"}
          />
        </div>
        <p className="mt-2 text-center text-xs text-white/80">
          {t("imageUploadHint", { maxDimension })}
        </p>
        {error ? (
          <p role="alert" className="mt-2 text-center text-sm text-red-300">
            {error}
          </p>
        ) : null}
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
        <div className="lg:absolute mt-8 lg:mt-0 flex justify-center lg:flex-col gap-6 end-3  lg:top-1/3">
          <ContentImage
            alt=""
            width={24}
            height={24}
            src={"/assets/icons/uploader/flip_icon.svg"}
            className="scale-[-1] rotate-90 cursor-pointer"
            onClick={() => cropperRef?.current?.flipImage(true)}
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
            className="cursor-pointer"
          />

          <div className="text-white text-xs">
            <p onClick={() => reset()} className="cursor-pointer">
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
            className="scale-x-[-1] cursor-pointer r"
          />
          <ContentImage
            alt=""
            width={24}
            height={24}
            className="cursor-pointer"
            src={"/assets/icons/uploader/flip_icon.svg"}
            onClick={() => cropperRef?.current?.flipImage(false, true)}
          />
        </div>

        <FixedBottomContainer
          containerClass={" gap-4 px-4  md:gap-8 !bg-transparent"}
        >
          <Button
            containerClass="w-full"
            onClick={() => {
              if (!isUploading && !preparing && ready && cropperRef.current)
                convertCanvasToFile();
            }}
            width="w-full"
            title={t("submit")}
            loading={isUploading || preparing}
            disabled={isUploading || preparing || !ready}
          />

          <Button
            color="danger"
            width="w-full"
            variant="outline"
            title={t("notNow")}
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
