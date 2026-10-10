"use client";

import { useTranslations } from "next-intl";
import { useChatStore } from "@/store";
import { Tooltip } from "react-tooltip";

import type { TChatItemMoreProps } from "@/types/components/modules/chat";

import Notify from "@elements/Toast";
import Image from "next/image";

const ChatItemMoreOptions = ({
  show,
  refer,
  close,
  data,
  mine,
}: TChatItemMoreProps) => {
  const t = useTranslations("chat");

  const copyToClipboard = () => {
    close();
    navigator?.clipboard.writeText(`${data?.text}`);
    Notify({ body: t("copySuccess"), type: "success" });
  };

  const deleteMessage = () => {
    useChatStore.setState({ chatDelete: data });
    close();
  };
  return (
    <Tooltip
      clickable
      events={["click"]}
      isOpen={show}
      anchorSelect={`.my-anchor-element${data?.id}`}
      className={`mt-2 !rounded-xl !bg-surface z-[50] focus:outline-none overflow-scroll`}
    >
      <div ref={refer} className="flex flex-col justify-center items-start ">
        <div
          onClick={(f) => {
            f.preventDefault();
            f.stopPropagation();
            copyToClipboard();
          }}
          className="px-0.5 py-0.5 z-[100] w-full cursor-pointer "
        >
          <div
            className={`hover:bg-action/80 cursor-pointer hover:text-on-action text-ink-muted  group flex w-full gap-2 items-center rounded-md px-0.5 py-0.5 text-sm font-light no-underline`}
          >
            <Image
              width={24}
              height={24}
              alt="ClipboardDocumentIcon"
              className={`w-6 h-6 aspect-square`}
              src="/assets/icons/chat/chat_copy.svg"
            />
            <p> {t("copy")}</p>
          </div>
        </div>
        {!!mine ? (
          <div className="px-0.5 py-0.5 z-[100] w-full  ">
            <div
              onClick={(f) => {
                f.preventDefault();
                f.stopPropagation();
                deleteMessage();
              }}
              className={`hover:bg-action/80 cursor-pointer hover:text-on-action text-ink-muted  group flex w-full gap-2 items-center rounded-md px-0.5 py-0.5 text-sm font-light no-underline`}
            >
              <Image
                width={24}
                height={24}
                alt="TrashIcon"
                src="/assets/icons/uploader/TrashIcon.svg"
                className={`w-6 opacity-30 h-6 aspect-square`}
              />
              <p> {t("delete")}</p>
            </div>
          </div>
        ) : (
          <></>
        )}{" "}
      </div>
    </Tooltip>
  );
};

export default ChatItemMoreOptions;
