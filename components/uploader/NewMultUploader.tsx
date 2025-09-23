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
import Notify from "../shared/Toast";
import { random } from "lodash";
//For Slider

type props = {
  type?: string;
  images: any[];

  item: any;
  onDelete?: () => void | null;
  setImages: React.Dispatch<React.SetStateAction<any[]>>;
  setimagesLoadings: React.Dispatch<
    React.SetStateAction<{
      [key: string]: any;
    }>
  >;
  containerClass?: string;

  disabled?: boolean;
  activeFull?: boolean;
  loading?: boolean;
  link: string;
  title?: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  imagesLoadings: {
    [key: string]: any;
  };
  innerClasses?: { sizeClass?: string; secontParentClass?: string };
};
interface RefObject<T> {
  readonly current: T | null;
}

const NewMultUploader = ({
  item,
  type = "image",

  disabled,
  setImages,
  setimagesLoadings,

  onDelete,

  containerClass,

  link,
  title,
  innerClasses,

  activeFull,
  loading,
  setLoading,
  imagesLoadings,
  images,
}: props) => {
  const imagePickerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState<any>("");
  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.UploadUsersImage,
    mutationKey: [setImages],
    gcTime: 0,

    onSuccess: (data) => {
      setImages((e) => {
        return e?.map((x) => {
          if (x?.id == data?.id) {
            x.data = data?.result;
            return x;
          } else return x;
        });
      });
    },

    onError: (error: any) => {
      setImages((e) => {
        return e?.filter((x) => x?.id != error?.id);
      });

      setLoading(false);
    },
  });

  useEffect(() => {
    if (!!imagesLoadings && !isPending) {
      if (Object.keys(imagesLoadings).every((e) => imagesLoadings?.[e] == 1)) {
        setLoading(false);
      }
    }
  }, [imagesLoadings, isPending]);

  const uploadTemp = async (file: Blob, id: number | string, isLast?: boolean) => {
    const compressedBlob = await imageCompression(file as any, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1240,
      useWebWorker: true,
    });
    const compressedFile = new File([compressedBlob], "whatever", {
      type: file.type,
      lastModified: Date.now(),
    });

    var formData = new FormData();
    formData.append("file", compressedFile);

    mutate(
      {
        id: id,
        formData: formData,
        link: link,
        onProgressCallBack: (p) => {
          setimagesLoadings((e) => ({
            ...e,
            [id]: p?.progress,
          }));
        },
      },
      {
        onSuccess: (data) => {
          // if (!!isLast) {
          //   setLoading(false);
          // }
        },
      }
    );
  };

  const pick: ReactEventHandler = useCallback(
    (e) => {
      const target = e.target as HTMLInputElement;
      const files = target?.files ? target?.files : null;

      if (!files) return;
      if (files?.length > 10) {
        return Notify({ type: "error", body: "در هر تلاش بیشتر از 10 عدد عکس انتخاب نکنید ." });
      }
      const loadingsObj: { [key: string | number]: any } = {};
      setLoading(true);
      for (let index = 0; index < files.length; index++) {
        const id = `id${random(1, 50000)}`;

        loadingsObj[id] = 0;
        const file = files[index];
        if (type == "image" && !file.type?.includes("image/")) return toast.error("لطفا از فایل تصویر استفاده نمایید");
        if (type == "image" && file.name.split(".")[1] == "jfif") {
          return toast.error("لطفا از فایل تصویر درست استفاده نمایید");
        } else {
          setLoading(true);
          const objectUrl = URL.createObjectURL(file);
          setImages((e) => [...e, { url: objectUrl, id: id }]);
          // setTimeout(() => {

          uploadTemp(file, id, index + 1 == files?.length);
          // }, 1000 * (index + 1));
        }
      }
      setimagesLoadings(loadingsObj);
    },
    [setImages]
  );

  return (
    <div className={`flex w-fit  ${containerClass}`} style={{ zIndex: "4 !important" }}>
      <div
        className={`flex  w-fit  flex-col     items-center justify-start   rounded-20 ${innerClasses?.secontParentClass}`}
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
        {typeof setImages == "function" && item == null && (
          <div
            onClick={() => {
              !disabled ? imagePickerRef?.current?.click() : void null;
            }}
            className={`cursor-pointer flex flex-col items-center  gap-1  border   bg-white  relative transition-all duration-150 ease-in-out  hover:border-gray-600  justify-center  rounded-20 aspect-square   ${
              !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
            }  `}
          >
            <img
              src="/assets/images/uploader/uploader_placeholder.png"
              className="w-10 h-10  opacity-80  text-primary-700"
            />
            {title && <p className=" text-xs  opacity-70 ">{title}</p>}
            {loading ? (
              <div className="w-full h-full absolute top-0 left-0 rounded-20 flex items-center justify-center   backdrop-blur-md">
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
            }  rounded-20  overflow-hidden  flex flex-col items-center relative `}
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
              className={`cursor-pointer border   bg-whiteGray-100  dark:bg-zinc-700  rounded-20 aspect-square relative  ${
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
                className="object-cover  w-full bg-gradient-to-b rounded-20 aspect-square max-w-max  "
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

export default NewMultUploader;
