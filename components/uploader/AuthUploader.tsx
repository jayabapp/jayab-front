import { ReactEventHandler, useEffect, useRef, useState } from "react";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { toast } from "sonner";

import ProfileImageModal from "@features/auth/components/ProfileImageModal";
import EditImageModal from "./EditImageModal";
import BtnLoading from "../shared/Button/BtnLoading";
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
  containerClass?: string;
  onDelete: () => void | null;
  onSelect: (e: any) => void | null;
};
interface RefObject<T> {
  readonly current: T | null;
}

const resolveProfileImage = (item: any, derivative?: "thumbnail") => {
  if (typeof item === "string") return item;
  if (item?.file_location) return item.file_location;
  return NEW_IMAGE_URL(item, derivative);
};

const AuthUploader = ({
  item,
  link,
  title,
  disabled,
  onSelect,
  onDelete,
  cropRatio,
  containerClass,
  type = "image",
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
      className={`flex w-fit  ${containerClass}`}
      style={{ zIndex: "4 !important" }}
    >
      <div className="flex w-fit flex-col relative items-center justify-start rounded-20 ">
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
            className="cursor-pointer bg-neutral-100 flex flex-col items-center  gap-1      relative transition-all duration-150 ease-in-out  hover:border-primary-700  justify-center rounded-10  aspect-square  h-24 w-24"
          >
            <Image
              width={32}
              height={32}
              alt="انتخاب تصویر"
              className="w-8 opacity-70"
              src="/assets/images/uploader/uploader_placeholder.png"
            />

            {title && <p className=" text-sm  opacity-70 ">{title}</p>}
            {loading ? (
              <div className="w-full h-full absolute top-0 left-0 rounded-20  flex items-center justify-center   backdrop-blur-md">
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
          <div className="  rounded-20   overflow-hidden  flex flex-col items-center relative ">
            <div
              onClick={() => {
                setShow(true);
                setShowImage(resolveProfileImage(item));
              }}
              className="cursor-pointer border   bg-whiteGray-100  dark:bg-zinc-700  rounded-20  aspect-square relative   h-24 w-24 "
            >
              <Image
                width={96}
                height={96}
                alt={title || "تصویر پروفایل"}
                src={resolveProfileImage(item, "thumbnail")}
                className="object-cover  w-full bg-gradient-to-b rounded-20  aspect-square max-w-max  "
              />
            </div>
            <div
              className=" p-1 bg-white  dark:bg-zinc-700  rounded-lg cursor-pointer absolute bottom-4 left-4 "
              onClick={onDelete}
            >
              <Image
                width={16}
                height={16}
                alt="حذف تصویر"
                src="/assets/icons/uploader/TrashIcon.svg"
              />
            </div>
          </div>
        )}
      </div>
      {show && (
        <ProfileImageModal
          src={showImage}
          onClose={() => setShow(false)}
          onDelete={() => {
            onDelete();
            setShow(false);
          }}
        />
      )}

      {!!selectedFile ? (
        <EditImageModal
          onHide={onHide}
          cropRatio={cropRatio}
          isUploading={loading}
          onComplete={uploadTemp}
          imageUrl={selectedFile || ""}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AuthUploader;
