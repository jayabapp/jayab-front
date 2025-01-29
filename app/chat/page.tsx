"use client";

import { ChatListDto } from "@/api_services/chat/chat.interface";
import { ChatService } from "@/api_services/chat/chat.service";
import ChatListItem from "@/components/chat/ChatListItem";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useChatStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";

const ChatListPage = () => {
  const { chatNotification } = useChatStore((state) => state);
  const [chats, setChats] = useState<ChatListDto[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [ChatService.CHAT_CACHEKEY],
    queryFn: ChatService.GetChatList,
  });

  useEffect(() => {
    if (!!data) {
      setChats(data);
    }
  }, [data]);

  useEffect(() => {
    if (!!chatNotification?.chatroom_id && chats) {
      if (chats?.find((e) => e?.uuid == chatNotification?.chatroom_id)) {
        const comingChatMessage = chats?.find((e) => e?.uuid == chatNotification?.chatroom_id);
        const newChats = chats?.filter((e) => e?.uuid != chatNotification?.chatroom_id);
        if (!!comingChatMessage) {
          comingChatMessage.unread_count = `${Number(comingChatMessage?.unread_count) + 1} `;
          setChats([comingChatMessage, ...newChats]);
        }
      } else {
        refetch();
      }
    }
  }, [chatNotification]);

  return (
    <div
      id="homeParent"
      className="  container  flex flex-col  w-full md:w-2/3 gap-4  transition-all duration-500 ease-in-out "
    >
      {isLoading ? (
        <LottieLoading />
      ) : isEmpty(chats) ? (
        <EmptyList />
      ) : (
        <>
          {chats?.map((e) => (
            <ChatListItem item={e} key={`chatItem${e?.id}`} />
          ))}
        </>
      )}
    </div>
  );
};

export default ChatListPage;
