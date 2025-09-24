import React, { useRef, useState, useCallback, ReactEventHandler, useEffect } from "react";

import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import _STRINGS from "@/utils/LocalStrings";
import imageCompression from "browser-image-compression";

import { toast } from "sonner";
import BtnLoading from "../shared/Button/BtnLoading";
import FormInput from "../shared/Form/FormInput";
import Modal from "../Modal";

//For Slider
const marks = {
  "-180": "180°-",
  "-90": "90°-",
  0: <strong>0</strong>,
  90: "90°",
  180: "180°",
};
type props = {
  type?: string;

  item: any;
  onDelete: () => void | null;
  onSelect: (e: any) => void | null;
  containerClass?: string;

  disabled?: boolean;
  withCrop?: boolean;
  cropRatio?: number;
  link: string;
  chatId: string | number;
  sendMessage: UseMutateFunction<
    unknown,
    unknown,
    {
      id: string | number;
      text: string;
      media_id?: number;
    },
    unknown
  >;
};
interface RefObject<T> {
  readonly current: T | null;
}

const ChatUploader = ({
  item,
  type = "image",

  disabled,
  onSelect,

  onDelete,

  containerClass,

  withCrop = false,
  cropRatio,
  link,
  sendMessage,
  chatId,
}: props) => {
  const imagePickerRef = useRef<HTMLDivElement>(null);
  /* ------------------------------- CROP STATES ------------------------------ */
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [newCrop, setNewCrop] = useState<any>();
  const [selectedFile, setselectedFile] = useState<File | null>(null);
  const [isCropping, setisCropping] = useState(false);
  const [aspect, setAspect] = useState<number | undefined>(cropRatio);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<any>();
  const [caption, setCaption] = useState<string>("");
  /* ------------------------------- END CROP STATES ------------------------------ */

  /* ------------------------------ ON PICK FILE ------------------------------ */

  const { mutate } = useMutation({ mutationFn: AuthService.UploadUsersImage });

  const submit = (image: any) => {
    if (chatId) {
      const body: { id: string | number; text: string; media_id?: number } = { id: chatId, text: caption };
      if (!!image) {
        body.media_id = Number(image?.id);
      }

      sendMessage(body, {
        onSuccess: () => {
          setLoading(false);
          setSubLoading(false);
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
      { formData: formData, link: link },
      {
        onSuccess: (e) => {
          submit(e?.result);

          // onSelect(e);
        },
        onError: () => {
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
      // const compressedBlob = await imageCompression(file as File, {
      //   maxSizeMB: 1,
      //   maxWidthOrHeight: 1400,
      //   useWebWorker: true,
      // });
      // const compressedFile = new File([compressedBlob], file.name, {
      //   type: file.type,
      //   lastModified: file.lastModified,
      // });
      setselectedFile(file);
    }
  };
  async function uploadImage() {
    setSubLoading(true);
    if (!!selectedFile) {
      uploadTemp(selectedFile);
    } else {
      setSubLoading(false);
    }
  }

  const onHide = () => {
    setselectedFile(null);
    setisCropping(false);
  };

  // useEffect(() => {
  //   setDisable(true);
  // }, [rotation]);
  return (
    <div className={`flex w-fit  ${containerClass}`} style={{ zIndex: "4 !important" }}>
      {/* <div id="myVIdeo"></div> */}
      <div
        className="flex  w-fit  flex-col     items-center justify-start   rounded-20"
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
        {typeof onSelect == "function" &&
          item == null &&
          (loading ? (
            <div className="w-full h-full absolute top-0 left-0 rounded-20 flex items-center justify-center   backdrop-blur-md">
              <BtnLoading />{" "}
            </div>
          ) : (
            <div className="  aspect-square shrink-0 md:w-6  items-center justify-center flex  text-gray-500   h-5 w-5 md:h-6">
              {" "}
              <img
                src="/assets/icons/chat/chat_clip.svg"
                alt="PaperClipIcon"
                className="  aspect-square shrink-0 md:w-6 text-gray-500   h-5 w-5 md:h-6"
                onClick={() => {
                  !disabled ? imagePickerRef?.current?.click() : void null;
                }}
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
            <img
              ref={imgRef}
              alt="Crop me"
              src={URL.createObjectURL(selectedFile)}
              //   style={{ transform: ` rotate(${rotation}deg)` }}
              className=" object-contain   bg-slate-800   max-h-[60dvh] xl:max-h-[70dvh]"
            />
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
                {" "}
                <img
                  src="/assets/icons/shared/green_check_icon.svg"
                  alt="CheckIcon"
                  className=" items-center justify-center text-center text-green-600 border-green-600 w-5 dark:text-dark-green"
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
            <img
              src="/assets/icons/adds/red_x_mark.svg"
              alt="XCircleIcon"
              className="  text-red-600 w-5 dark:text-dark-red"
            />
            <p className="text-red-600  text-lg font-medium dark:text-dark-red">بستن</p>
          </div>
        </div>

        <div></div>
      </Modal>
    </div>
  );
};

export default ChatUploader;
