import { ChatRoomTemplate } from "@templates/ChatRoom";

const ChatPage = async ({
  params,
}: {
  params: Promise<{ chat_id: string }>;
}) => {
  const { chat_id: chatId } = await params;
  return <ChatRoomTemplate chatId={chatId} />;
};

export default ChatPage;
