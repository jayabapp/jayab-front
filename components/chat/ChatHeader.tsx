import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import _STRINGS from "@/utils/LocalStrings";
import { isIOS } from "react-device-detect";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";

type chatType = {
  image?: ImageDto;
  description?: string;
  name?: string;
  offSetTop?: number;
  is_recipient_online?: boolean;
};

const ChatHeader = ({ image, description, name, offSetTop, is_recipient_online }: chatType) => {
  const router = useRouter();

  return (
    <div
      style={
        isIOS && offSetTop
          ? {
              top: offSetTop,
            }
          : {}
      }
      className="flex fixed  pr-2 z-30 bg-white  dark:bg-dark-900 w-full left-0  md:left-[10%] md:right-[10%] mx-auto lg:top-0 md:w-[50%]    top-0 xl:top-[4.5rem] pt-4 items-center gap-2 pb-3 shadow-md "
    >
      <img
        src="/assets/icons/shared/chevron.svg"
        onClick={() => {
          router.back();
        }}
        className=" dark:invert h-4 aspect-square w-4 -rotate-90  justify-start  "
      />
      <div className="grid grid-cols-4  gap-2">
        {image ? (
          <div className="w-8 relative flex items-center aspect-square">
            <div
              className={` z-2 w-2 h-2  aspect-square rounded-full absolute left-0 bottom-0 animate-pulse ${
                is_recipient_online ? "bg-emerald-400" : "bg-red-400"
              } `}
            ></div>

            <img
              src={image ? NEW_IMAGE_URL(image) : "/assets/icons/logo/logo.svg"}
              className="w-8 col-span-1 md:w-14 rounded-full  clear-left  aspect-square"
            />
          </div>
        ) : (
          <></>
        )}
        <div className="flex h-full flex-col justify-around col-span-3">
          <p className="text-sm md:text-base">{name || _STRINGS?.CHAT}</p>
          <p className="text-xs font-extralight md:text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
