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
import EditImageModal from "./EditImageModal";
import Notify from "../shared/Toast";
//For Slider

type props = {
  type?: string;

  item: any;
  onDelete?: () => void | null;
  onSelect: (e: any) => void | null;
  containerClass?: string;

  disabled?: boolean;
  withCrop?: boolean;
  showCamera?: boolean;
  cropRatio?: number;
  link: string;
  title?: string;

  innerClasses?: { sizeClass?: string; secontParentClass?: string; imageClass?: string };
};
interface RefObject<T> {
  readonly current: T | null;
}

const MainUploader = ({
  item,
  type = "image",

  disabled,
  onSelect,

  onDelete,

  containerClass,

  withCrop = false,
  cropRatio,
  link,
  title,
  innerClasses,
  showCamera,
}: props) => {
  const cropperRef = useRef<CropperRef>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const imagePickerRef = useRef<HTMLDivElement>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [image, setImage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState<any>("");
  const [selectedFile, setselectedFile] = useState<string | null>(null);
  const [isCropping, setisCropping] = useState(false);

  const { mutate } = useMutation({ mutationFn: AuthService.UploadUsersImage });

  const uploadTemp = async (file: Blob) => {
    setLoading(true);

    let compressedBlob;
    let compressedFile;
    try {
      compressedBlob = await imageCompression(file as any, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1240,
        useWebWorker: true,
      });
      compressedFile = new File([compressedBlob], "whatever", {
        type: file.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      compressedFile = file;
      console.error("Image compression failed:", error);
    }
    if (!!compressedFile) {
      var formData = new FormData();
      formData.append("file", compressedFile);

      mutate(
        { formData: formData, link: link },
        {
          onSuccess: (e) => {
            setLoading(false);
            setSubLoading(false);
            onSelect(e?.result);
            setImage("");
            setselectedFile(null);
            // setNewCrop(null);
            // setDisable(true);
          },
          onError: () => {
            setSubLoading(false);
            setLoading(false);
          },
        }
      );
    }
  };

  const pick: ReactEventHandler = async (e) => {
    const target = e.target as HTMLInputElement;
    const file = target?.files ? target?.files[0] : null;

    if (!file) return;
    if (type == "image" && !file.type?.includes("image/")) return toast.error("لطفا از فایل تصویر استفاده نمایید");
    if (type == "image" && file.name.split(".")[1] == "jfif")
      return toast.error("لطفا از فایل تصویر درست استفاده نمایید");
    else {
      setImage(URL.createObjectURL(file));
      setselectedFile(URL.createObjectURL(file));
    }
  };

  const onHide = () => {
    setImage("");
    setselectedFile(null);
    setisCropping(false);
  };

  return (
    <div className={`flex w-fit  ${containerClass} ${showCamera ? "relative" : ""}`} style={{ zIndex: "4 !important" }}>
      {/* <div id="myVIdeo"></div> */}
      {!!showCamera ? (
        <div
          onClick={() => {
            !disabled ? imagePickerRef?.current?.click() : void null;
          }}
          className="  z-2  bg-transparent cursor-pointer absolute bottom-0  w-6 h-6 aspect-square right-0 "
        >
          <img src="/assets/icons/uploader/uploader_camera.svg" className=" w-6 h-6 " />
        </div>
      ) : (
        <></>
      )}
      <div
        className={`flex  w-fit  flex-col     items-center justify-start   rounded-20 ${innerClasses?.secontParentClass}`}
        // style={{ overflowX: "scroll" }}
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
            className={`cursor-pointer flex flex-col items-center  gap-1     relative transition-all duration-150 ease-in-out  hover:border-gray-600  justify-center bg-neutral-100 rounded-10 aspect-square   ${
              !!innerClasses?.sizeClass ? innerClasses?.sizeClass : "h-24 w-24"
            }  `}
          >
            <img className="w-8 opacity-70" src="/assets/images/uploader/uploader_placeholder.png" />
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
                  typeof item == "string"
                    ? "imageUrl" + item
                    : item?.file_location
                    ? "imageUrl" + item?.file_location
                    : item?.name
                    ? `https://${item?.bucket}.${item?.end_point}/${item?.path}/${item?.name}`
                    : item
                );
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
                className={`object-cover  w-full bg-gradient-to-b rounded-20 aspect-square max-w-max 
                  
                   ${!!innerClasses?.imageClass ? innerClasses?.imageClass : "h-24 w-24"}
                  `}
              />
            </div>
            {!!onDelete ? (
              <div className="   bg-transparent cursor-pointer absolute top-2 left-2 shadow-2xl " onClick={onDelete}>
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
      {!!selectedFile ? (
        <EditImageModal
          cropRatio={cropRatio}
          imageUrl={selectedFile || ""}
          isUploading={loading}
          onComplete={uploadTemp}
          onHide={onHide}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainUploader;
