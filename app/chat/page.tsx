"use client";

import { ChatService } from "@/api_services/chat/chat.service";
import ChatListItem from "@/components/chat/ChatListItem";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ChatListPage = () => {
  const { data: chats, isLoading } = useQuery({
    queryKey: [ChatService.CHAT_CACHEKEY],
    queryFn: ChatService.GetChatList,
  });
  return (
    <div
      id="homeParent"
      className="  container  flex flex-col  w-full md:w-2/3 gap-4  transition-all duration-500 ease-in-out "
    >
      {isLoading ? (
        <LottieLoading />
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
