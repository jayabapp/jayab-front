import { resolveChatImage } from "@features/chat/presentation/chat.presenter";
import type { ChatReplyProps } from "@/types/components/modules/chat";
import { ContentImage } from "@/components/elements/Image";

import Image from "next/image";

const ChatReply = ({ data, cancleButton }: ChatReplyProps) => {
  return (
    <div className="flex items-center border-r-4 border-brand-50  gap-2 p-0.5  my-1 relative">
      {data?.post ? (
        <ContentImage
          width={44}
          height={44}
          sizes="44px"
          alt={data?.post?.title || ""}
          src={resolveChatImage(data?.post?.cover)}
          className="rounded-md object-cover w-11 aspect-square"
        />
      ) : (
        <></>
      )}
      <div className="flex flex-col items-start pr-2 text-start gap-0.5 justify-between">
        <p className="text-xs font-medium">
          {data?.participant?.user?.full_name}
        </p>
        <p className="text-xs">{data?.text}</p>
      </div>
      <Image
        width={12}
        height={12}
        alt=""
        onClick={() => {
          cancleButton ? cancleButton() : null;
        }}
        className=" absolute left-4 top-4 opacity-75  w-3 cursor-pointer aspect-square  "
        src="/assets/icons/shared/close.svg"
      />
    </div>
  );
};

export default ChatReply;
