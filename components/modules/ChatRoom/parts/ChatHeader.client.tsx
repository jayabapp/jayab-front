"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { resolveChatImage } from "@features/chat/presentation/chat.presenter";
import { useBlockChatUser } from "@features/chat/hooks/useBlockChatUser";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";
import { useRouter } from "next/navigation";

import type { ChatHeaderProps } from "@/types/components/modules/chat";

import ChatSecurityNotice from "./ChatSecurityNotice";
import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import Image from "next/image";
import Link from "next/link";

const ChatHeader = ({
  data,
  name,
  image,
  description,
  is_recipient_online,
}: ChatHeaderProps) => {
  const tr = useTranslations();

  const t = useTranslations("common");

  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const [showBlock, setShowBlock] = useState(false);
  const isBlocked = !!data?.is_blocked;

  const showBlockFunc = () => setShowBlock(true);
  const hideBlockFunc = () => setShowBlock(false);

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

  useLayoutEffect(() => {
    const header = headerRef.current;
    const chatContainer = header?.closest<HTMLElement>(".chat-container");
    if (!header || !chatContainer) return;
    const setChatOffsets = () => {
      const headerBottom = Math.ceil(
        header.getBoundingClientRect().bottom -
          chatContainer.getBoundingClientRect().top,
      );
      chatContainer.style.setProperty(
        "--chat-header-bottom",
        `${headerBottom}px`,
      );
      chatContainer.style.setProperty(
        "--chat-body-top-offset",
        `${headerBottom + 44}px`,
      );
    };

    setChatOffsets();
    const observer = new ResizeObserver(setChatOffsets);
    observer.observe(header);
    window.addEventListener("resize", setChatOffsets);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setChatOffsets);
      chatContainer.style.removeProperty("--chat-header-bottom");
      chatContainer.style.removeProperty("--chat-body-top-offset");
    };
  }, []);

  return (
    <div
      ref={headerRef}
      className="fixed end-0 top-0 z-50 mx-auto w-full bg-surface shadow-md md:end-[10%] md:start-[10%] md:z-30 md:w-1/2 xl:top-[4.5rem]"
    >
      <div className="flex min-h-[4.25rem] items-center justify-between gap-2 px-2 pb-3 pt-4">
        <div className="flex w-full items-center gap-2">
          <Image
            src="/assets/icons/shared/chevron.svg"
            alt={tr("common.back")}
            width={16}
            height={16}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBackClick();
            }}
            className="h-4 aspect-square w-4 -rotate-90 justify-start"
          />
          <div className="flex items-center w-full gap-2">
            {image ? (
              <div className="w-10 shrink-0 relative flex items-center aspect-square">
                <div
                  className={`absolute bottom-0 end-0 z-10 size-2 rounded-full ${is_recipient_online ? "bg-emerald-400" : "bg-neutral-400"}`}
                />
                <ContentImage
                  src={
                    image
                      ? resolveChatImage(image)
                      : "/assets/icons/logo/logo.svg"
                  }
                  alt={name || t("chat")}
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
              title={name || t("chat")}
              className="flex h-full flex-col justify-around col-span-3"
            >
              {!!name || !!data?.recipient?.user_mobile_number ? (
                <>
                  {" "}
                  <p className="text-sm md:text-base">{name || t("chat")}</p>
                  <p className="text-xs font-light md:text-sm">{description}</p>
                  {!!data?.recipient?.user_mobile_number ? (
                    <div className="w-full flex items-center gap-0.5 ">
                      <Image
                        width={20}
                        height={20}
                        className="w-5 h-5"
                        alt={tr("common.user")}
                        src="/assets/icons/chat/basil_user.svg"
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
          }   transition-all me-4 opacity-65 hover:opacity-100 hover:grayscale-0 `}
          src="/assets/icons/chat/chat_block.svg"
          alt={tr("chat.blockUser")}
          width={24}
          height={24}
        />
      </div>

      <ChatSecurityNotice />

      <ConfirmModal
        isLoading={isPending}
        onConfirm={blockuser}
        isVisible={showBlock}
        onHide={hideBlockFunc}
        text={!!isBlocked ? tr("chat.confirmUnblock") : tr("chat.confirmBlock")}
      />
    </div>
  );
};

export default ChatHeader;
