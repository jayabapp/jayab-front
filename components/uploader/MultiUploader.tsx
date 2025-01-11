"use client";
import "react-advanced-cropper/dist/style.css";
import React, { useRef, useState, useCallback, ReactEventHandler, useEffect } from "react";

import FullscreenImage from "./FullScreenImage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Cropper, CropperRef, Coordinates } from "react-advanced-cropper";
import { useStoreTheme } from "../../store";
import { AuthService } from "@/api_services/auth/auth.service";
import BtnLoading from "../shared/Button/BtnLoading";
import Modal from "../Modal";
//For Slider

type props = {
  type?: string;

  item: any;
  onDelete?: () => void | null;
  onSelect: (e: any) => void | null;
  containerClass?: string;

  disabled?: boolean;
  activeFull?: boolean;
  link: string;
  title?: string;
  setTotalLength?: React.Dispatch<React.SetStateAction<number>>;
  setUploadedImages?: React.Dispatch<React.SetStateAction<number>>;
  innerClasses?: { sizeClass?: string; secontParentClass?: string };
  setUploaderLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};
interface RefObject<T> {
  readonly current: T | null;
}

const MultiUploader = ({
  item,
  type = "image",

  disabled,
  onSelect,

  onDelete,

  containerClass,

  link,
  title,
  innerClasses,
  setTotalLength,
  setUploaderLoading,
  setUploadedImages,
  activeFull,
}: props) => {
  const imagePickerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState<any>("");

  const { mutate } = useMutation({
    mutationFn: AuthService.UploadUsersImage,
    gcTime: 1,
    onSuccess: (e) => {
      onSelect(e);
      if (!!setUploadedImages) setUploadedImages((x) => x + 1);
    },
    onError: () => {
      setLoading(false);
      if (!!setUploaderLoading) setUploaderLoading(false);
    },
  });

  const uploadTemp = (file: Blob, isLast?: boolean) => {
    setLoading(true);
    if (!!setUploaderLoading) setUploaderLoading(true);
    var formData = new FormData();
    formData.append("file", file);

    mutate(
      { formData: formData, link: link },
      {
        onSuccess: () => {
          if (!!isLast) {
            setLoading(false);
            if (!!setUploadedImages) setUploadedImages(0);
            if (!!setUploaderLoading) setUploaderLoading(false);
          }
        },
      }
    );
  };

  const pick: ReactEventHandler = async (e) => {
    const target = e.target as HTMLInputElement;
    const files = target?.files ? target?.files : null;

    if (!files) return;
    if (!!setTotalLength) {
      setTotalLength(files?.length);
    }
    setLoading(true);
    if (!!setUploaderLoading) setUploaderLoading(true);
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (type == "image" && !file.type?.includes("image/")) return toast.error("لطفا از فایل تصویر استفاده نمایید");
      if (type == "image" && file.name.split(".")[1] == "jfif")
        return toast.error("لطفا از فایل تصویر درست استفاده نمایید");
      else {
        setTimeout(() => {
          const compressedFile = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });
          uploadTemp(compressedFile, index + 1 == files?.length);
        }, 1000 * (index + 1));
      }
    }
  };

  return (
    <div className={`flex w-fit  ${containerClass}`} style={{ zIndex: "4 !important" }}>
      <div
        className={`flex  w-fit  flex-col     items-center justify-start   rounded-10 ${innerClasses?.secontParentClass}`}
      >
        <input
          multiple
          className="  hidden "
          type="file"
          id={`formFile-${type}`}
          ref={imagePickerRef as RefObject<HTMLInputElement>}
          onChange={pick}
          onClick={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = "";
          }}
        />
        {typeof onSelect == "function" && item == null && (
          <div
            onClick={() => {
              !disabled ? imagePickerRef?.current?.click() : void null;
            }}
            className={`cursor-pointer flex flex-col items-center  gap-1     relative transition-all duration-150 ease-in-out  hover:border-gray-600  justify-center bg-neutral-100 rounded-10 aspect-square   ${
              !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
            }  `}
          >
            <img src="/assets/images/uploader/uploader_placeholder.png" />
            {title && <p className=" text-sm  opacity-70 ">{title}</p>}
            {loading ? (
              <div className="w-full h-full absolute top-0 left-0 rounded-10 flex items-center justify-center   backdrop-blur-md">
                <BtnLoading />{" "}
              </div>
            ) : (
              <></>
            )}
          </div>
        )}

        {!item ? (
          <></>
        ) : (
          <div
            className={` ${
              !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
            }  rounded-10  overflow-hidden  flex flex-col items-center relative `}
          >
            <div
              onClick={() => {
                if (!!activeFull) {
                  setShow(true);
                  setShowImage(
                    typeof item == "string"
                      ? "imageUrl" + item
                      : item?.file_location
                      ? "imageUrl" + item?.file_location
                      : item?.name
                      ? `https://${item?.bucket}.${item?.end_point}/${item?.path}/${item?.name}`
                      : item
                  );
                }
              }}
              className={`cursor-pointer border   bg-whiteGray-100  dark:bg-zinc-700  rounded-10 aspect-square relative  ${
                !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
              } `}
            >
              <img
                alt="img"
                src={
                  typeof item == "string"
                    ? "imageUrl" + item
                    : item.file_location
                    ? "imageUrl" + item.file_location
                    : item.name
                    ? `https://${item?.bucket}.${item?.end_point}/${item?.path}/${item?.name}`
                    : item
                }
                className="object-cover  w-full bg-gradient-to-b rounded-10 aspect-square max-w-max  "
              />
            </div>
            {!!onDelete ? (
              <div className="   bg-transparent cursor-pointer absolute top-2 left-2 " onClick={onDelete}>
                <img src="/assets/icons/uploader/faded_x_circle.svg" />
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      {show && (
        <FullscreenImage
          setShow={setShow}
          show={show}
          src={showImage}
          onDelete={
            !!onDelete
              ? () => {
                  onDelete();
                  setShow(false);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default MultiUploader;
