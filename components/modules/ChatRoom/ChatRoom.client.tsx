"use client";

import { isChatAccountMismatch } from "@features/chat/lib/chat-error";
import { useDeleteMessage } from "@features/chat/hooks/useDeleteMessage";
import { useChatMessages } from "@features/chat/hooks/useChatMessages";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useChatRealtime } from "@features/chat/hooks/useChatRealtime";
import { useChatDetails } from "@features/chat/hooks/useChatDetails";
import { useChatStore } from "@/store";

import type { ChatRoomProps } from "@/types/components/modules/chat";

import ChatAccessDenied from "./parts/ChatAccessDenied.client";
import ChatRoomSkeleton from "./parts/ChatRoomSkeleton";
import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import ChatFooter from "./parts/ChatFooter.client";
import ChatHeader from "./parts/ChatHeader.client";
import ChatBody from "./parts/ChatBody.client";

const ChatRoomView = ({ chatId }: ChatRoomProps) => {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const chatProduct = useChatStore((state) => state.chatProduct);
  const chatDelete = useChatStore((state) => state.chatDelete);
  const detailsQuery = useChatDetails(chatId);
  const hasVerifiedChatAccess =
    detailsQuery.isSuccess && detailsQuery.isFetchedAfterMount;
  const messagesQuery = useChatMessages(chatId, hasVerifiedChatAccess);
  const { connecting, usersStatus } = useChatRealtime(
    chatId,
    hasVerifiedChatAccess,
  );
  const deleteMessage = useDeleteMessage(chatId);

  const clearProduct = () => {
    useChatStore.setState({ chatProduct: null });
  };
  const closeDelete = () => useChatStore.setState({ chatDelete: null });
  const details = detailsQuery.data;
  const isRecipientOnline =
    usersStatus?.user_id === details?.recipient?.user_id
      ? usersStatus.is_online
      : details?.is_recipient_online;

  if (isChatAccountMismatch(detailsQuery.error, messagesQuery.error))
    return <ChatAccessDenied chatId={chatId} />;
  if (
    detailsQuery.isPending ||
    !detailsQuery.isFetchedAfterMount ||
    (hasVerifiedChatAccess && messagesQuery.isPending)
  )
    return <ChatRoomSkeleton />;
  if (detailsQuery.isError || messagesQuery.isError || !details) {
    return (
      <div className="container flex min-h-[60dvh] flex-col items-center justify-center gap-4">
        <p>{t("common.error")}</p>
        <button
          className="rounded-xl bg-action px-6 py-2 text-on-action"
          onClick={() =>
            void Promise.all([detailsQuery.refetch(), messagesQuery.refetch()])
          }
        >
          {t("common.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container relative col-span-4 flex h-[100dvh] max-h-[100dvh] flex-col overflow-y-clip bg-surface-muted md:w-1/2">
      <ChatHeader
        is_recipient_online={isRecipientOnline}
        name={details.property.title}
        data={details}
        image={details.property.feature_image}
      />
      {connecting ? (
        <div className="absolute top-[var(--chat-header-bottom,12rem)] z-40 w-full bg-status-warning-bg py-1 text-center text-xs text-status-warning">
          {t("chat.chatReconnecting")}
        </div>
      ) : (
        <></>
      )}
      <ChatBody
        singleChatData={details}
        data={messagesQuery.messages}
        hasNextPage={messagesQuery.hasNextPage}
        fetchNextPage={messagesQuery.fetchNextPage}
        isFetchingNextPage={messagesQuery.isFetchingNextPage}
      />
      <ChatFooter
        chatId={chatId}
        product={chatProduct}
        singleChatData={details}
        cancleButton={clearProduct}
        showProduct={searchParams.get("product") === "true"}
      />
      <ConfirmModal
        isLoading={deleteMessage.isPending}
        onConfirm={() => {
          if (chatDelete?.id)
            deleteMessage.mutate(
              { id: chatId, chatId: chatDelete.id },
              { onSuccess: closeDelete },
            );
        }}
        isVisible={!!chatDelete}
        text={t("chat.areUSureDeleteMessage")}
        onHide={closeDelete}
      />
    </div>
  );
};

export default ChatRoomView;
