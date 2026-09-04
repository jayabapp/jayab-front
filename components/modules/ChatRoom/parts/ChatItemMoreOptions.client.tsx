"use client";

import type { TChatItemMoreProps } from "@/types/components/modules/chat";
import { Tooltip } from "react-tooltip";
import { useChatStore } from "@/store";

import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";
import Image from "next/image";

const ChatItemMoreOptions = ({
  show,
  refer,
  close,
  data,
  mine,
}: TChatItemMoreProps) => {
  const copyToClipboard = () => {
    close();
    navigator?.clipboard.writeText(`${data?.text}`);
    Notify({ body: _STRINGS.COPY_SUCCESS, type: "success" });
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
      className={`    mt-2   !rounded-xl !bg-white     z-[50]  focus:outline-none  overflow-scroll`}
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
            className={`hover:bg-brand-600/80     cursor-pointer hover:text-white text-neutral-600  group flex w-full gap-2 items-center rounded-md px-0.5 py-0.5 text-sm font-light no-underline`}
          >
            <Image
              width={24}
              height={24}
              alt="ClipboardDocumentIcon"
              className={`w-6 h-6 aspect-square`}
              src="/assets/icons/chat/chat_copy.svg"
            />
            <p> {_STRINGS.COPY}</p>
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
              className={`hover:bg-brand-600/80 cursor-pointer hover:text-white text-neutral-600  group flex w-full gap-2 items-center rounded-md px-0.5 py-0.5 text-sm font-light no-underline`}
            >
              <Image
                width={24}
                height={24}
                alt="TrashIcon"
                src="/assets/icons/uploader/TrashIcon.svg"
                className={`w-6  opacity-30 h-6 aspect-square   `}
              />
              <p> {_STRINGS.DELETE}</p>
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
