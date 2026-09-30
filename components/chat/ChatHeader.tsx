"use client";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { ChatService } from "@/api_services/chat/chat.service";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ConfirmModal from "../Modal/ConfirmModal";
import BtnLoading from "../shared/Button/BtnLoading";
import ChatSecurityNotice from "./ChatSecurityNotice";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const [showBlock, setShowBlock] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const showBlockFunc = () => {
    setShowBlock(true);
  };
  const hideBlockFunc = () => {
    setShowBlock(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ChatService.blockUserChat,
    onSuccess: () => {
      setShowBlock(false);
      setIsBlocked((e) => !e);
    },
  });

  const blockuser = () => {
    mutate({ action: !!isBlocked ? 0 : 1, chatId: data?.id, target_user_id: data?.recipient?.user_id });
  };

  useEffect(() => {
    if (data?.is_blocked) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [data]);

  const goToLink =
    // data?.property?.owner?.user?.id == data?.self?.user_id
    //   ? `/profile/owner/properties/${data?.property?.id}`
    //   :
    `/rooms/${data?.property?.slug}`;

  const handleBackClick = () => {
    // Check if there's history to go back to (external link case)
    if (window.history.length <= 1) {
      router.push("/");
    } else {
      router.back();
    }
  };

  useLayoutEffect(() => {
    const header = headerRef.current;
    const chatContainer = header?.closest<HTMLElement>(".chat-container");
    if (!header || !chatContainer) return;

    const setChatBodyOffset = () => {
      const headerBottom = Math.ceil(
        header.getBoundingClientRect().bottom - chatContainer.getBoundingClientRect().top,
      );
      chatContainer.style.setProperty("--chat-body-top-offset", `${headerBottom + 16}px`);
    };

    setChatBodyOffset();
    const observer = new ResizeObserver(setChatBodyOffset);
    observer.observe(header);
    window.addEventListener("resize", setChatBodyOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setChatBodyOffset);
      chatContainer.style.removeProperty("--chat-body-top-offset");
    };
  }, []);

  return (
    <div
      ref={headerRef}
      // style={
      //   isIOS && offSetTop
      //     ? {
      //         top: offSetTop,
      //       }
      //     : {}
      // }
      className="fixed z-50 mx-auto w-full bg-white shadow-md dark:bg-dark-900 left-0 top-0 md:left-[10%] md:right-[10%] md:z-30 md:w-[50%] xl:top-[4.5rem]"
    >
      <div className="flex min-h-[4.25rem] items-center justify-between gap-2 pb-3 pt-4 pr-2">
        <div className="flex items-center w-full gap-2">
        {" "}
        <img
          src="/assets/icons/shared/chevron.svg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleBackClick();
          }}
          className=" dark:invert h-4 aspect-square w-4 -rotate-90  justify-start  "
        />
        <div className="flex items-center   w-full gap-2">
          {image ? (
            <div className="w-10 shrink-0 relative flex items-center aspect-square">
              {/* <div
                className={` z-2 w-2 h-2  aspect-square rounded-full absolute left-0 bottom-0 animate-pulse ${
                  is_recipient_online ? "bg-emerald-400" : "bg-red-400"
                } `}
              ></div> */}

              <img
                src={image ? NEW_IMAGE_URL(image) : "/assets/icons/logo/logo.svg"}
                className="w-10 col-span-1 md:w-14 rounded-full  clear-left  aspect-square"
              />
            </div>
          ) : (
            <></>
          )}
          <Link
            href={goToLink}
            title={name || _STRINGS.CHAT}
            className="flex h-full flex-col justify-around col-span-3"
          >
            {!!name || !!data?.recipient?.user_mobile_number ? (
              <>
                {" "}
                <p className="text-sm md:text-base">{name || _STRINGS?.CHAT}</p>
                <p className="text-xs font-extralight md:text-sm">{description}</p>
                {!!data?.recipient?.user_mobile_number ? (
                  <div className="w-full flex items-center gap-0.5 ">
                    <img className="w-5 h-5" src="/assets/icons/chat/basil_user.svg" />
                    <p className="text-xs !leading-2 opacity-50 mt-1 ">{data?.recipient?.user_mobile_number}</p>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                <BtnLoading />
              </>
            )}
          </Link>
        </div>
      </div>
        <img
          onClick={showBlockFunc}
          className={`w-6 h-6 cursor-pointer aspect-square ${
            isBlocked ? "" : "grayscale"
          }   transition-all ml-4 opacity-65 hover:opacity-100 hover:grayscale-0 `}
          src="/assets/icons/chat/chat_block.svg"
        />
      </div>

      <ChatSecurityNotice />

      <ConfirmModal
        text={!!isBlocked ? "آیا از آنبلاک کردن کاربر مطمئنید ؟" : "آیا از بلاک کردن کاربر مطمئنید ؟"}
        isLoading={isPending}
        onConfirm={blockuser}
        isVisible={showBlock}
        onHide={hideBlockFunc}
      />
    </div>
  );
};

export default ChatHeader;
