"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useChats } from "@features/chat/hooks/useChats";

import type { ChatListProps } from "@/types/components/modules/chat";

import ChatListSkeleton from "./parts/ChatListSkeleton";
import ChatListItem from "./parts/ChatListItem.client";
import EmptyState from "@elements/EmptyState";
import Button from "@elements/Button";

const ChatListView = ({ profile = false }: ChatListProps) => {
  const t = useTranslations("common");

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
          width="w-full"
          title={t("tryAgain")}
          onClick={() => void refetch()}
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
          title={t("loginToUrAccount")}
          onClick={() => router.push("/auth")}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ChatListView;
