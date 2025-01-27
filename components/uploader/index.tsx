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
  withCrop?: boolean;
  cropRatio?: number;
  link: string;
  title?: string;

  innerClasses?: { sizeClass?: string; secontParentClass?: string };
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

  const uploadTemp = (file: Blob) => {
    setLoading(true);
    var formData = new FormData();
    formData.append("file", file);

    mutate(
      { formData: formData, link: link },
      {
        onSuccess: (e) => {
          setLoading(false);
          setSubLoading(false);
          onSelect(e);
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
  };

  const pick: ReactEventHandler = async (e) => {
    const target = e.target as HTMLInputElement;
    const file = target?.files ? target?.files[0] : null;

    if (!file) return;
    if (type == "image" && !file.type?.includes("image/")) return toast.error("لطفا از فایل تصویر استفاده نمایید");
    if (type == "image" && file.name.split(".")[1] == "jfif")
      return toast.error("لطفا از فایل تصویر درست استفاده نمایید");
    else {
      const compressedBlob = await imageCompression(file as File, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1240,
        useWebWorker: true,
      });
      const compressedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      // setselectedFile(compressedFile);
      setImage(URL.createObjectURL(compressedFile));
      setselectedFile(URL.createObjectURL(compressedFile));
    }
  };

  async function uploadImage() {
    setSubLoading(true);

    if (!!image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "file.jpeg", {
        type: blob.type,
      });
      uploadTemp(file);
    } else {
      setSubLoading(false);
    }
  }

  const onHide = () => {
    setImage("");
    setselectedFile(null);
    setisCropping(false);
  };

  const onRotate = (rotate: number) => {
    if (!!cropperRef.current) {
      cropperRef.current?.rotateImage(rotate, { normalize: true });
    }
  };

  const onFlip = (horizontal?: boolean, vertical?: boolean) => {
    if (!!cropperRef.current) {
      cropperRef.current?.flipImage(horizontal, vertical);
    }
  };

  const onChange = (cropper: CropperRef) => {
    setCoordinates(cropper.getCoordinates());
    if (cropper.getCanvas()?.toDataURL()) setImage(cropper.getCanvas()?.toDataURL());
  };

  return (
    <div className={`flex w-fit  ${containerClass}`} style={{ zIndex: "4 !important" }}>
      {/* <div id="myVIdeo"></div> */}
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
      <Modal
        show={!!selectedFile ? true : false}
        options={{
          containerClass:
            "mx-auto my-0 !h-fit  w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll  bg-zinc-800   dark:bg-slate-800",
        }}
        onHide={onHide}
      >
        <div
          className="flex bg-zinc-900 dark:bg-slate-800 items-center justify-center"
          style={{
            position: "relative",
            width: "100%",
            minHeight: "60dvh",
            maxHeight: "60dvh",
          }}
        >
          <Cropper
            defaultSize={({ imageSize }, settings) => {
              return {
                width: imageSize.width,
                height: imageSize.height,
              };
            }}
            style={{ maxHeight: "60dvh" }}
            ref={cropperRef}
            stencilProps={{
              aspectRatio: cropRatio || undefined,
            }}
            src={selectedFile}
            onChange={onChange}
            className={"cropper"}
          />
        </div>
        <div className=" w-full flex  gap-4 relative bg-zinc-800 dark:bg-slate-800 pt-8   pb-8  items-center justify-center">
          <img
            onClick={() => {
              onRotate(-90);
            }}
            src={"/assets/icons/uploader/rotate_icon.svg"}
            className="absolute cursor-pointer left-[30%]  dark:invert-0 "
          />
          <img
            onClick={() => {
              onFlip(true, undefined);
            }}
            src={"/assets/icons/uploader/flip_icon.svg"}
            className="absolute scale-[-1] rotate-90 cursor-pointer left-[15%]  dark:invert-0 "
          />

          <img
            onClick={() => {
              onFlip(undefined, true);
            }}
            className="absolute   cursor-pointer right-[15%]  dark:invert-0 "
            src={"/assets/icons/uploader/flip_icon.svg"}
          />

          <img
            onClick={() => {
              onRotate(90);
            }}
            src={"/assets/icons/uploader/rotate_icon.svg"}
            className="absolute  scale-x-[-1] cursor-pointer right-[30%]  dark:invert-0 "
          />
        </div>

        <div className=" w-full grid overflow-clip   p-2 gap-2 items-center bg-zinc-800 dark:bg-slate-800 justify-center grid-cols-2 ">
          <div
            onClick={() => {
              if (!subLoading) {
                uploadImage();
              }
            }}
            className={`  transition-all  w-full cursor-pointer flex py-1.5  border rounded-xl border-green-600 dark:border-dark-green gap-3 items-center  border-l justify-center`}
          >
            {subLoading ? (
              <div className=" flex items-center justify-center w-full min-h-[1.7rem]">
                {" "}
                <BtnLoading />
              </div>
            ) : (
              <>
                {" "}
                <img
                  src="/assets/icons/shared/check_icon.svg"
                  className=" items-center justify-center text-center text-green-600 border-green-600 w-4 dark:text-dark-green"
                />
                <p className="text-green-600 border-green-600  text-lg font-medium dark:text-dark-green">تایید</p>
              </>
            )}{" "}
          </div>
          <div
            onClick={() => {
              if (!isCropping) {
                onHide();
              }
            }}
            className="w-full py-1.5 cursor-pointer gap-3  border rounded-xl border-red-600 dark:border-dark-red flex items-center justify-center"
          >
            <img src="/assets/icons/adds/red_x_mark.svg" className="  text-red-600 w-4 dark:text-dark-red" />
            <p className="text-red-600  text-lg font-medium dark:text-dark-red">بستن</p>
          </div>
        </div>

        <div></div>
      </Modal>
    </div>
  );
};

export default MainUploader;
