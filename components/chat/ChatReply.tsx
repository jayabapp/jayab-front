import React from "react";

import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { SingleChatDto } from "@/api_services/chat/chat.interface";

export interface ChatReplyDto {
  data: SingleChatDto | any;
  cancleButton: () => void | null;
}

const ChatReply = ({ data, cancleButton }: ChatReplyDto) => {
  return (
    <div className="flex items-center border-r-4 border-primary-50  gap-2 p-0.5  my-1 relative">
      {data?.post ? (
        <img src={NEW_IMAGE_URL(data?.post?.cover)} className="rounded-md object-cover w-11 aspect-square" />
      ) : (
        <></>
      )}
      <div className="flex flex-col items-start pr-2 text-start gap-0.5 justify-between">
        <p className="text-xs font-medium">{data?.participant?.user?.full_name}</p>
        <p className="text-xs">{data?.text}</p>
      </div>
      <img
        onClick={() => {
          cancleButton ? cancleButton() : null;
        }}
        className=" absolute left-4 top-4 opacity-75  w-3 cursor-pointer aspect-square  dark:invert"
        src="/assets/icons/shared/close.svg"
      />
    </div>
  );
};

export default ChatReply;
