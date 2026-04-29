"use client";

import { ChatListDto } from "@/api_services/chat/chat.interface";
import { ChatService } from "@/api_services/chat/chat.service";
import ChatListItem from "@/components/chat/ChatListItem";
import Button from "@/components/shared/Button/Button";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useAuthStore, useChatStore } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ChatListPage = () => {
  const { chatNotification, chatsPageData } = useChatStore((state) => state);
  const { isLogin } = useAuthStore();
  const router = useRouter();
  const [chats, setChats] = useState<ChatListDto[]>([]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [ChatService.CHAT_CACHEKEY, isLogin],
    queryFn: ChatService.GetChatList,

    gcTime: 0,
    staleTime: 0,
    enabled: !!isLogin,
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
          }),
        );
      } else {
        refetch();
      }
    }
  }, [chatNotification]);

  const goToLogin = () => {
    router.push("/auth");
  };
  return (
    <div
      id="homeParent"
      className="  container  flex flex-col  w-full md:w-2/3 gap-4  transition-all duration-500 ease-in-out "
    >
      {!!chatsPageData && !!isLoading && isEmpty(chats) ? (
        <>
          {chatsPageData?.map((e: any) => (
            <ChatListItem
              // onClickCb={() => {
              //   useChatStore.setState({ chatsPageData: chats });
              // }}
              item={e}
              key={`historyChatItem${e?.id}`}
            />
          ))}
        </>
      ) : isLoading ? (
        <LottieLoading />
      ) : isEmpty(chats) ? (
        <EmptyList />
      ) : (
        <>
          {chats?.map((e) => (
            <ChatListItem
              onClickCb={() => {
                useChatStore.setState({ chatsPageData: chats });
              }}
              item={e}
              key={`chatItem${e?.id}`}
            />
          ))}
        </>
      )}

      {!isLogin ? (
        <Button
          containerClass="   mt-8 w-full"
          width="w-full"
          title={_STRINGS?.LOGIN_TO_UR_ACCOUNT}
          onClick={() => {
            goToLogin();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatListPage;
