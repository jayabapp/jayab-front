"use client";

import type { ChatListProps } from "@/types/components/modules/chat";
import { useChats } from "@features/chat/hooks/useChats";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

import ChatListSkeleton from "./parts/ChatListSkeleton";
import ChatListItem from "./parts/ChatListItem.client";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const ChatListView = ({ profile = false }: ChatListProps) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const router = useRouter();
  const { data: chats = [], isPending, isError, refetch } = useChats(isLogin);

  return (
    <div
      id="homeParent"
      className={`${profile ? "profile-container" : "container md:w-2/3"} flex w-full flex-col gap-4 transition-all`}
    >
      {isPending && isLogin ? <ChatListSkeleton /> : <></>}
      {isError ? (
        <Button
          title={_STRINGS.TRY_AGAIN}
          onClick={() => void refetch()}
          width="w-full"
        />
      ) : !isPending && chats.length === 0 && isLogin ? (
        <EmptyState />
      ) : (
        chats.map((chat) => <ChatListItem item={chat} key={chat.id} />)
      )}
      {!isLogin ? (
        <Button
          width="w-full"
          containerClass="mt-8 w-full"
          title={_STRINGS.LOGIN_TO_UR_ACCOUNT}
          onClick={() => router.push("/auth")}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatListView;
