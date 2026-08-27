import ChatRoomView from "@features/chat/components/ChatRoomView";

const ChatPage = async ({ params }: { params: Promise<{ chat_id: string }> }) => {
  const { chat_id: chatId } = await params;
  return <ChatRoomView chatId={chatId} />;
};

export default ChatPage;
