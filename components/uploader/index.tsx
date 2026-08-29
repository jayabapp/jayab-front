"use client";

import { ReactEventHandler, useEffect, useRef, useState } from "react";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { AuthService } from "@/api_services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import ProfileImageModal from "@features/auth/components/ProfileImageModal";
import EditImageModal from "./EditImageModal";
import { BtnLoading } from "@elements/Button";
import Image from "next/image";

import "react-advanced-cropper/dist/style.css";

type props = {
  item: any;
  link: string;
  type?: string;
  title?: string;
  disabled?: boolean;
  withCrop?: boolean;
  cropRatio?: number;
  showCamera?: boolean;
  containerClass?: string;
  onDelete?: () => void | null;
  onSelect: (e: any) => void | null;
  innerClasses?: {
    sizeClass?: string;
    secontParentClass?: string;
    imageClass?: string;
  };
};
interface RefObject<T> {
  readonly current: T | null;
}

const MainUploader = ({
  item,
  link,
  title,
  disabled,
  onSelect,
  onDelete,
  cropRatio,
  showCamera,
  innerClasses,
  type = "image",
  containerClass,
}: props) => {
  const imagePickerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState("");
  const [selectedFile, setselectedFile] = useState<string | null>(null);
  const uploadControllerRef = useRef<AbortController | null>(null);

  const { mutate } = useMutation({ mutationFn: AuthService.UploadUsersImage });

  useEffect(
    () => () => {
      uploadControllerRef.current?.abort();
      if (selectedFile) URL.revokeObjectURL(selectedFile);
    },
    [selectedFile],
  );

  const uploadTemp = async (file: Blob) => {
    setLoading(true);
    uploadControllerRef.current?.abort();
    const controller = new AbortController();
    uploadControllerRef.current = controller;
    try {
      if (!!file) {
        var formData = new FormData();
        formData.append("file", file);
        mutate(
          { formData: formData, link: link, signal: controller.signal },
          {
            onSuccess: (e) => {
              if (controller.signal.aborted) return;
              setLoading(false);
              onSelect(e?.result);
              if (selectedFile) URL.revokeObjectURL(selectedFile);
              setselectedFile(null);
            },
            onError: () => {
              if (controller.signal.aborted) return;
              setLoading(false);
            },
          },
        );
      }
    } finally {
      file = null as any;
    }
  };

  const pick: ReactEventHandler = async (e) => {
    const target = e.target as HTMLInputElement;
    const file = target?.files ? target?.files[0] : null;
    if (!file) return;
    if (type == "image" && !file.type?.includes("image/"))
      return toast.error("لطفا از فایل تصویر استفاده نمایید");
    if (type == "image" && file.name.split(".")[1] == "jfif")
      return toast.error("لطفا از فایل تصویر درست استفاده نمایید");
    else {
      if (selectedFile) URL.revokeObjectURL(selectedFile);
      setselectedFile(URL.createObjectURL(file));
    }
  };

  const onHide = () => {
    uploadControllerRef.current?.abort();
    if (selectedFile) URL.revokeObjectURL(selectedFile);
    setselectedFile(null);
  };

  return (
    <div
      className={`flex w-fit  ${containerClass} ${showCamera ? "relative" : ""}`}
      style={{ zIndex: "4 !important" }}
    >
      {!!showCamera ? (
        <div
          onClick={() => {
            !disabled ? imagePickerRef?.current?.click() : void null;
          }}
          className="  z-2  bg-transparent cursor-pointer absolute bottom-0  w-6 h-6 aspect-square right-0 "
        >
          <Image
            width={24}
            height={24}
            alt="تغییر تصویر"
            src="/assets/icons/uploader/uploader_camera.svg"
          />
        </div>
      ) : (
        <></>
      )}
      <div
        className={`flex w-fit flex-col items-center justify-start rounded-20 ${innerClasses?.secontParentClass}`}
      >
        <input
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
            className={`cursor-pointer flex flex-col items-center  gap-1     relative transition-all duration-150 ease-in-out  hover:border-neutral-600  justify-center bg-neutral-100 rounded-10 aspect-square   ${
              !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
            }  `}
          >
            <Image
              className="w-8 opacity-70"
              src="/assets/images/uploader/uploader_placeholder.png"
              alt="انتخاب تصویر"
              width={32}
              height={32}
            />
            {title && <p className=" text-sm  opacity-70 ">{title}</p>}
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
                setShow(true);
                setShowImage(
                  typeof item === "string"
                    ? item
                    : item?.file_location || NEW_IMAGE_URL(item),
                );
              }}
              className={`cursor-pointer border   bg-whiteGray-100    rounded-20 aspect-square relative  ${
                !!innerClasses?.sizeClass
                  ? innerClasses?.sizeClass
                  : "h-24 w-24"
              } `}
            >
              <Image
                alt={title || "تصویر پروفایل"}
                src={
                  typeof item === "string"
                    ? item
                    : item?.file_location || NEW_IMAGE_URL(item, "thumbnail")
                }
                width={96}
                height={96}
                className={`object-cover  w-full bg-gradient-to-b rounded-20 aspect-square max-w-max 
                  
                   ${!!innerClasses?.imageClass ? innerClasses?.imageClass : "h-24 w-24"}
                  `}
              />
            </div>
            {!!onDelete ? (
              <div
                className="   bg-transparent cursor-pointer absolute top-2 left-2 shadow-2xl "
                onClick={onDelete}
              >
                <Image
                  src="/assets/icons/uploader/faded_x_circle.svg"
                  alt="حذف تصویر"
                  width={20}
                  height={20}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      {show && (
        <ProfileImageModal
          src={showImage}
          onClose={() => setShow(false)}
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
      {!!selectedFile ? (
        <EditImageModal
          onHide={onHide}
          isUploading={loading}
          cropRatio={cropRatio}
          onComplete={uploadTemp}
          imageUrl={selectedFile || ""}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainUploader;
