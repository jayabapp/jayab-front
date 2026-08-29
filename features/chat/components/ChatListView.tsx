"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useChats } from "../hooks/useChats";

import ChatListSkeleton from "./ChatListSkeleton";
import ChatListItem from "@/components/chat/ChatListItem";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const ChatListView = ({ profile = false }: { profile?: boolean }) => {
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
