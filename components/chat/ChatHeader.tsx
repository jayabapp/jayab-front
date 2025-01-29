"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import _STRINGS from "@/utils/LocalStrings";
import { isIOS } from "react-device-detect";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import ConfirmModal from "../Modal/ConfirmModal";
import { useMutation } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";

type chatHeaderType = {
  image?: ImageDto;
  description?: string;
  name?: string;
  offSetTop?: number;
  is_recipient_online?: boolean;
  data?: SingleChatDetailsDto;
};

const ChatHeader = ({ image, description, name, offSetTop, is_recipient_online, data }: chatHeaderType) => {
  const router = useRouter();
  const [showBlock, setShowBlock] = useState(false);

  const showBlockFunc = () => {
    setShowBlock(true);
  };
  const hideBlockFunc = () => {
    setShowBlock(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ChatService.blockUserChat,
    onSuccess: () => {
      router.push("/chat");
    },
  });

  const blockuser = () => {
    mutate({ action: !!data?.is_blocked ? 0 : 1, chatId: data?.id, target_user_id: data?.recipient?.user_id });
  };

  return (
    <div
      style={
        isIOS && offSetTop
          ? {
              top: offSetTop,
            }
          : {}
      }
      className="flex fixed  justify-between pr-2 z-30 bg-white  dark:bg-dark-900 w-full left-0  md:left-[10%] md:right-[10%] mx-auto lg:top-0 md:w-[50%]    top-0 xl:top-[4.5rem] pt-4 items-center gap-2 pb-3 shadow-md "
    >
      <div className="flex items-center gap-2">
        {" "}
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
      <img
        onClick={showBlockFunc}
        className={`w-6 h-6 cursor-pointer aspect-square ${
          data?.is_blocked ? "" : "grayscale"
        }   transition-all ml-4 opacity-65 hover:opacity-100 hover:grayscale-0 `}
        src="/assets/icons/chat/chat_block.svg"
      />

      <ConfirmModal
        text={!!data?.is_blocked ? "آیا از آنبلاک کردن یوزر مطمئنید ؟" : "آیا از بلاک کردن یوزر مطمئنید ؟"}
        isLoading={isPending}
        onConfirm={blockuser}
        isVisible={showBlock}
        onHide={hideBlockFunc}
      />
    </div>
  );
};

export default ChatHeader;
