"use client";

import { ChatListDto } from "@/api_services/chat/chat.interface";
import { ChatService } from "@/api_services/chat/chat.service";
import ChatListItem from "@/components/chat/ChatListItem";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useChatStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";

const ChatListPage = () => {
  const { chatNotification } = useChatStore((state) => state);
  const [chats, setChats] = useState<ChatListDto[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [ChatService.CHAT_CACHEKEY],
    queryFn: ChatService.GetChatList,

    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (!!data) {
      setChats(data);
    }
  }, [data]);

  useEffect(() => {
    if (chatNotification) {
      if (chats?.find((e) => e?.uuid == chatNotification?.chatroom_id)) {
        setChats((current) =>
          produce(current, (draft) => {
            const i = draft.findIndex((e) => e.uuid === chatNotification.chatroom_id);
            if (i !== -1) {
              draft[i].unread_count = (Number(draft[i].unread_count) || 0) + 1;
              draft[i].last_message.text = chatNotification?.message?.text;
              draft[i].last_message.updated_at = chatNotification?.message?.created_at;
            }
            if (i > 0) {
              const [item] = draft.splice(i, 1);
              draft.unshift(item);
            }
          })
        );
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
