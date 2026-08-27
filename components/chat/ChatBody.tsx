"use client";

import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { useEffect, useRef } from "react";
import { NewSingleChatDto } from "@/api_services/chat/chat.interface";
import { useChatStore } from "@/store";

import PrivateOthersMessage from "./PrivateOthersMessage";
import IsTypingEffect from "./IsTypingEffect";
import MyMessageItem from "./MyMessageItem";

interface ChatBodyProps {
  hasNextPage: boolean;
  data: NewSingleChatDto[];
  isFetchingNextPage: boolean;
  singleChatData: SingleChatDetailsDto;
  fetchNextPage: () => Promise<unknown>;
}

const ChatBody = ({
  data,
  hasNextPage,
  fetchNextPage,
  singleChatData,
  isFetchingNextPage,
}: ChatBodyProps) => {
  const isTyping = useChatStore((state) => state.isTyping);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousLengthRef = useRef(0);
  const initialScrollDoneRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (!initialScrollDoneRef.current && data.length > 0) {
      container.scrollTop = container.scrollHeight;
      initialScrollDoneRef.current = true;
    } else if (
      data.length > previousLengthRef.current &&
      container.scrollTop > container.scrollHeight - 500
    ) {
      container.scrollTop = container.scrollHeight;
    }
    previousLengthRef.current = data.length;
  }, [data.length]);

  const loadOlderMessages = async () => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;
    const previousHeight = container.scrollHeight;
    await fetchNextPage();
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight - previousHeight;
    });
  };

  return (
    <div className="flex flex-1 items-end overflow-y-hidden px-4 pb-4 md:mb-0">
      <div
        ref={scrollContainerRef}
        onScroll={(event) => {
          if (event.currentTarget.scrollTop < 80) void loadOlderMessages();
        }}
        className="grid max-h-[90dvh] w-full grid-cols-3 items-end justify-center gap-6 overflow-y-scroll pb-4 pt-24 md:pt-36"
      >
        {isFetchingNextPage ? (
          <div
            className="col-span-full flex flex-col gap-2"
            aria-label="در حال دریافت پیام‌های قبلی"
          >
            <div className="h-12 w-1/2 animate-pulse rounded-xl bg-neutral-200" />
            <div className="mr-auto h-12 w-2/5 animate-pulse rounded-xl bg-white" />
          </div>
        ) : (
          <></>
        )}
        {data.map((message) =>
          singleChatData.self.participant_id === message.participant_id ? (
            <MyMessageItem
              data={message}
              key={message.clientMessageId ?? message.id}
            />
          ) : (
            <PrivateOthersMessage
              data={message}
              key={message.clientMessageId ?? message.id}
            />
          ),
        )}
        {isTyping?.chatroom_id === singleChatData.id && isTyping?.is_typing ? (
          <div className="col-span-4 flex w-full justify-end">
            <IsTypingEffect />
          </div>
        ) : (
          <></>
        )}
        <div className="col-span-full h-12 bg-transparent" />
      </div>
    </div>
  );
};

export default ChatBody;
