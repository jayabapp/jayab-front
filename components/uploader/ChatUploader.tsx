import { ReactEventHandler, useEffect, useRef, useState } from "react";
import { AuthService } from "@/api_services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import BtnLoading from "../shared/Button/BtnLoading";
import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import Image from "next/image";
import Modal from "../Modal";

type props = {
  item: any;
  link: string;
  type?: string;
  disabled?: boolean;
  cropRatio?: number;
  withCrop?: boolean;
  chatId: string | number;
  containerClass?: string;
  onDelete: () => void | null;
  onSelect: (e: any) => void | null;
  sendMessage: (
    body: {
      id: string | number;
      text: string;
      media_id?: number;
      optimisticMedia?: any;
    },
    options?: {
      onSuccess?: (response: unknown) => void;
      onError?: (error: unknown) => void;
    },
  ) => void;
};
interface RefObject<T> {
  readonly current: T | null;
}

const ChatUploader = ({
  link,
  item,
  chatId,
  onSelect,
  disabled,
  sendMessage,
  type = "image",
  containerClass,
}: props) => {
  const imagePickerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [, setNewCrop] = useState<any>();
  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [isCropping, setisCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [caption, setCaption] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState("");
  const uploadControllerRef = useRef<AbortController | null>(null);
  const { mutate } = useMutation({ mutationFn: AuthService.UploadUsersImage });

  useEffect(
    () => () => {
      uploadControllerRef.current?.abort();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const submit = (image: any) => {
    if (chatId) {
      const body: {
        id: string | number;
        text: string;
        media_id?: number;
        optimisticMedia?: any;
      } = {
        id: chatId,
        text: caption,
      };
      if (!!image) {
        body.media_id = Number(image?.id);
        body.optimisticMedia = image;
      }

      sendMessage(body, {
        onSuccess: () => {
          setLoading(false);
          setSubLoading(false);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl("");
          setselectedFile(null);
          setNewCrop(null);
          setCaption("");
        },
        onError: () => {
          setLoading(false);
          setSubLoading(false);
          setNewCrop(null);
        },
      });
    }
  };

  const uploadTemp = async (file: Blob) => {
    setLoading(true);
    uploadControllerRef.current?.abort();
    const controller = new AbortController();
    uploadControllerRef.current = controller;
    var formData = new FormData();
    formData.append("file", file);
    mutate(
      { formData: formData, link: link, signal: controller.signal },
      {
        onSuccess: (e) => {
          if (controller.signal.aborted) return;
          submit(e?.result);
        },
        onError: () => {
          if (controller.signal.aborted) return;
          setLoading(false);
        },
      },
    );
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
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setselectedFile(file);
    }
  };
  async function uploadImage() {
    setSubLoading(true);
    if (!!selectedFile) uploadTemp(selectedFile);
    else setSubLoading(false);
  }

  const onHide = () => {
    uploadControllerRef.current?.abort();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setselectedFile(null);
    setisCropping(false);
  };

  return (
    <div
      className={`flex w-fit  ${containerClass}`}
      style={{ zIndex: "4 !important" }}
    >
      <div className="flex w-fit flex-col items-center justify-start rounded-20">
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
        {typeof onSelect == "function" &&
          item == null &&
          (loading ? (
            <div className="w-full h-full absolute top-0 left-0 rounded-20 flex items-center justify-center   backdrop-blur-md">
              <BtnLoading />{" "}
            </div>
          ) : (
            <div className="  aspect-square shrink-0 md:w-6  items-center justify-center flex  text-gray-500   h-5 w-5 md:h-6">
              {" "}
              <Image
                src="/assets/icons/chat/chat_clip.svg"
                alt="PaperClipIcon"
                className="  aspect-square shrink-0 md:w-6 text-gray-500   h-5 w-5 md:h-6"
                onClick={() => {
                  !disabled ? imagePickerRef?.current?.click() : void null;
                }}
                width={24}
                height={24}
              />{" "}
            </div>
          ))}
      </div>

      <Modal
        show={!!selectedFile ? true : false}
        options={{
          containerClass:
            "mx-auto my-0  bg-slate-800  !h-fit  w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-2xl overflow-y-scroll  ",
        }}
        onHide={onHide}
      >
        <div
          className="flex    items-center justify-center"
          style={{
            position: "relative",
            width: "100%",
            minHeight: "60dvh",
          }}
        >
          {!!selectedFile && (
            <>
              <Image
                ref={imgRef}
                unoptimized
                width={1024}
                height={1024}
                src={previewUrl}
                alt="پیش‌نمایش تصویر"
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 92vw"
                className="max-h-[60dvh] bg-slate-800 object-contain xl:max-h-[70dvh]"
              />
            </>
          )}
        </div>
        <FormInput
          value={caption}
          onChangeText={(e) => setCaption(e)}
          item={{
            inputClass: " !bg-slate-800 !text-white",
            containerClass: " !bg-slate-800 px-4",
            placeholder: _STRINGS.MESSAGE_TEXT,
          }}
        />
        <div className=" w-full grid overflow-clip   p-2 gap-2 items-center  bg-slate-800  justify-center grid-cols-2 ">
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
                <Image
                  width={20}
                  height={20}
                  alt="CheckIcon"
                  src="/assets/icons/shared/green_check_icon.svg"
                  className=" items-center justify-center text-center text-green-600 border-green-600 w-5 dark:text-dark-green"
                />
                <p className="text-green-600 border-green-600  text-lg font-medium dark:text-dark-green">
                  تایید
                </p>
              </>
            )}{" "}
          </div>
          <div
            onClick={() => {
              if (!isCropping) onHide();
            }}
            className="w-full py-1.5 cursor-pointer gap-3  border rounded-xl border-red-600 dark:border-dark-red flex items-center justify-center"
          >
            <Image
              width={20}
              height={20}
              alt="XCircleIcon"
              src="/assets/icons/adds/red_x_mark.svg"
              className="  text-red-600 w-5 dark:text-dark-red"
            />
            <p className="text-red-600  text-lg font-medium dark:text-dark-red">
              بستن
            </p>
          </div>
        </div>

        <div></div>
      </Modal>
    </div>
  );
};

export default ChatUploader;
