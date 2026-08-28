"use client";

import { useDeleteMessage } from "../hooks/useDeleteMessage";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatRealtime } from "../hooks/useChatRealtime";
import { useSearchParams } from "next/navigation";
import { useChatDetails } from "../hooks/useChatDetails";
import { useChatStore } from "@/store";

import type { ProductChatType } from "@/api_services/chat/chat.interface";

import ChatRoomSkeleton from "./ChatRoomSkeleton";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ChatFooter from "@/components/chat/ChatFooter";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatBody from "@/components/chat/ChatBody";
import _STRINGS from "@/utils/LocalStrings";

const ChatRoomView = ({ chatId }: { chatId: string }) => {
  const searchParams = useSearchParams();
  const chatProduct = useChatStore(
    (state) => state.chatProduct,
  ) as ProductChatType | null;
  const chatDelete = useChatStore((state) => state.chatDelete);
  const detailsQuery = useChatDetails(chatId);
  const messagesQuery = useChatMessages(chatId);
  const { connecting, usersStatus } = useChatRealtime(chatId);
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

  if (detailsQuery.isPending || messagesQuery.isPending)
    return <ChatRoomSkeleton />;
  if (detailsQuery.isError || messagesQuery.isError || !details) {
    return (
      <div className="container flex min-h-[60dvh] flex-col items-center justify-center gap-4">
        <p>{_STRINGS.ERROR}</p>
        <button
          className="rounded-xl bg-brand-600 px-6 py-2 text-white"
          onClick={() =>
            void Promise.all([detailsQuery.refetch(), messagesQuery.refetch()])
          }
        >
          {_STRINGS.TRY_AGAIN}
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container relative col-span-4 flex h-[100dvh] max-h-[100dvh] flex-col overflow-y-clip bg-neutral-100 md:w-1/2">
      <ChatHeader
        is_recipient_online={isRecipientOnline}
        name={details.property.title}
        data={details}
        image={details.property.feature_image}
      />
      {connecting ? (
        <div className="absolute top-20 z-40 w-full bg-amber-100 py-1 text-center text-xs text-amber-800">
          {_STRINGS.CHAT_RECONNECTING}
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
        text={_STRINGS.ARE_U_SURE_DELETE_MESSAGE}
        onHide={closeDelete}
      />
    </div>
  );
};

export default ChatRoomView;
