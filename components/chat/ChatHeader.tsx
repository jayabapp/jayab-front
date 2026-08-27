"use client";

import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { useBlockChatUser } from "@features/chat/hooks/useBlockChatUser";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useRouter } from "next/navigation";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { useState } from "react";

import ConfirmModal from "../Modal/ConfirmModal";
import BtnLoading from "../shared/Button/BtnLoading";
import _STRINGS from "@/utils/LocalStrings";
import Image from "next/image";
import Link from "next/link";

type chatHeaderType = {
  name?: string;
  image?: ImageDto;
  offSetTop?: number;
  description?: string;
  data?: SingleChatDetailsDto;
  is_recipient_online?: boolean;
};

const ChatHeader = ({
  data,
  name,
  image,
  description,
  is_recipient_online,
}: chatHeaderType) => {
  const router = useRouter();
  const [showBlock, setShowBlock] = useState(false);
  const isBlocked = !!data?.is_blocked;

  const showBlockFunc = () => {
    setShowBlock(true);
  };
  const hideBlockFunc = () => {
    setShowBlock(false);
  };

  const { mutate, isPending } = useBlockChatUser(`${data?.id ?? ""}`);

  const blockuser = () => {
    mutate(
      {
        action: isBlocked ? 0 : 1,
        chatId: data?.id,
        target_user_id: data?.recipient?.user_id,
      },
      { onSuccess: hideBlockFunc },
    );
  };

  const goToLink = `/rooms/${data?.property?.slug}`;

  const handleBackClick = () => {
    if (window.history.length <= 1) router.push("/");
    else router.back();
  };
  return (
    <div className="flex fixed  justify-between pr-2 z-50 md:z-30 bg-white  dark:bg-dark-900 w-full left-0  md:left-[10%] md:right-[10%] mx-auto lg:top-0 md:w-[50%]   min-h-[4.25rem]   top-0 xl:top-[4.5rem] pt-4 items-center gap-2 pb-3 shadow-md ">
      <div className="flex items-center w-full gap-2">
        <Image
          src="/assets/icons/shared/chevron.svg"
          alt="بازگشت"
          width={16}
          height={16}
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
              <div
                className={`absolute bottom-0 left-0 z-10 size-2 rounded-full ${is_recipient_online ? "bg-emerald-400" : "bg-neutral-400"}`}
              />
              <Image
                src={
                  image ? NEW_IMAGE_URL(image) : "/assets/icons/logo/logo.svg"
                }
                alt={name || _STRINGS.CHAT}
                width={56}
                height={56}
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
                <p className="text-xs font-extralight md:text-sm">
                  {description}
                </p>
                {!!data?.recipient?.user_mobile_number ? (
                  <div className="w-full flex items-center gap-0.5 ">
                    <Image
                      className="w-5 h-5"
                      src="/assets/icons/chat/basil_user.svg"
                      alt="کاربر"
                      width={20}
                      height={20}
                    />
                    <p className="text-xs !leading-2 opacity-50 mt-1 ">
                      {data?.recipient?.user_mobile_number}
                    </p>
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
      <Image
        onClick={showBlockFunc}
        className={`w-6 h-6 cursor-pointer aspect-square ${
          isBlocked ? "" : "grayscale"
        }   transition-all ml-4 opacity-65 hover:opacity-100 hover:grayscale-0 `}
        src="/assets/icons/chat/chat_block.svg"
        alt="مسدود کردن کاربر"
        width={24}
        height={24}
      />

      <ConfirmModal
        text={
          !!isBlocked
            ? "آیا از آنبلاک کردن کاربر مطمئنید ؟"
            : "آیا از بلاک کردن کاربر مطمئنید ؟"
        }
        isLoading={isPending}
        onConfirm={blockuser}
        isVisible={showBlock}
        onHide={hideBlockFunc}
      />
    </div>
  );
};

export default ChatHeader;
