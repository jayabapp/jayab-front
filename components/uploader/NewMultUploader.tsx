"use client";
import "react-advanced-cropper/dist/style.css";
import React, { useRef, useState, useCallback, ReactEventHandler, useEffect } from "react";

import FullscreenImage from "./FullScreenImage";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useStoreTheme } from "../../store";
import { AuthService } from "@/api_services/auth/auth.service";
import BtnLoading from "../shared/Button/BtnLoading";
import Modal from "../Modal";
import Notify from "../shared/Toast";
import { random } from "lodash";

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

const MAX_TOTAL_IMAGES = 20;

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
  const [uploadingImages, setUploadingImages] = useState<any[]>([]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: AuthService.UploadUsersImage,
    mutationKey: [setImages],
    gcTime: 0,

    onSuccess: (data) => {
      setImages((e) =>
        e?.map((x) => {
          if (x?.id == data?.id) {
            x.data = data?.result;
            return x;
          } else return x;
        })
      );
    },

    onError: (error: any) => {
      setImages((e) => e?.filter((x) => x?.id != error?.id));
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

  // cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img?.url?.startsWith("blob:")) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  const uploadTemp = async (file: Blob, id: number | string, isLast?: boolean) => {
    try {
      const compressedBlob = await imageCompression(file as any, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1240,
        useWebWorker: true,
        maxIteration: 5,
      });

      const compressedFile = new File([compressedBlob], file.type || "image", {
        type: file.type,
        lastModified: Date.now(),
      });

      const formData = new FormData();
      formData.append("file", compressedFile);

      await mutateAsync({
        id,
        formData,
        link,
        onProgressCallBack: (p) => {
          setimagesLoadings((e) => ({
            ...e,
            [id]: p?.progress,
          }));
        },
      });
    } finally {
      // drop file reference
      file = null as any;
    }
  };

  const pick: ReactEventHandler = async (e) => {
    const target = e.target as HTMLInputElement;
    const files = target?.files ? target?.files : null;
    if (!files) return;

    // Hard cap total images
    if (images.length + files.length > MAX_TOTAL_IMAGES) {
      return Notify({
        type: "error",
        body: `حداکثر ${MAX_TOTAL_IMAGES} تصویر می‌توانید انتخاب کنید.`,
      });
    }

    if (files.length > 10) {
      return Notify({
        type: "error",
        body: "در هر تلاش بیشتر از 10 عدد عکس انتخاب نکنید.",
      });
    }

    const loadingsObj: { [key: string | number]: any } = {};
    setLoading(true);
    let filesUploding = [];
    for (let i = 0; i < files.length; i++) {
      let file = files?.[i];
      const id = `id_${file.lastModified}_${Math.random().toString(36).slice(2)}`;
      filesUploding.push({ id, file });
      loadingsObj[id] = 0;

      if (type === "image" && !file.type.includes("image/")) {
        return toast.error("لطفا از فایل تصویر استفاده نمایید");
      }
      if (type === "image" && file.name.split(".")[1] === "jfif") {
        return toast.error("لطفا از فایل تصویر درست استفاده نمایید");
      }

      const objectUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { url: objectUrl, id }]);
    }

    setimagesLoadings(loadingsObj);

    if (filesUploding?.length == files?.length) {
      for (let i = 0; i < filesUploding.length; i++) {
        let file = filesUploding?.[i];
        await uploadTemp(file?.file, file?.id, i + 1 === filesUploding.length).finally(() => {
          file = null as any;
        });
      }
    }
  };

  return (
    <div className={`flex w-fit ${containerClass}`} style={{ zIndex: 4 }}>
      <div className={`flex w-fit flex-col items-center justify-start rounded-20 ${innerClasses?.secontParentClass}`}>
        <input
          multiple
          className="hidden"
          type="file"
          accept="image/png, image/jpeg"
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
            className={`cursor-pointer flex flex-col items-center gap-1 border bg-white relative transition-all duration-150 ease-in-out hover:border-gray-600 justify-center rounded-20 aspect-square ${
              innerClasses?.sizeClass || "h-24 w-24"
            }`}
          >
            <img
              src="/assets/images/uploader/uploader_placeholder.png"
              className="w-10 h-10 opacity-80 text-primary-700"
            />
            {title && <p className="text-xs opacity-70">{title}</p>}
            {loading && (
              <div className="w-full h-full absolute top-0 left-0 rounded-20 flex items-center justify-center backdrop-blur-md">
                <BtnLoading />
              </div>
            )}
          </div>
        )}

        {!item ? (
          <></>
        ) : (
          <div
            className={`${
              innerClasses?.sizeClass || "h-24 w-24"
            } rounded-20 overflow-hidden flex flex-col items-center relative`}
          >
            <div
              onClick={() => {
                if (activeFull) {
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
              className={`cursor-pointer border bg-whiteGray-100 dark:bg-zinc-700 rounded-20 aspect-square relative ${
                innerClasses?.sizeClass || "h-24 w-24"
              }`}
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
                className="object-cover w-full rounded-20 aspect-square max-w-max"
              />
            </div>
            {!!onDelete && (
              <div
                className="bg-transparent cursor-pointer absolute top-2 left-2"
                onClick={() => {
                  if (item?.url?.startsWith("blob:")) {
                    URL.revokeObjectURL(item.url);
                  }
                  onDelete();
                }}
              >
                <img src="/assets/icons/uploader/faded_x_circle.svg" />
              </div>
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
