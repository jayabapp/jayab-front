import { ChatRoomTemplate } from "@templates/ChatRoom";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const ChatPage = async ({
  params,
}: {
  params: Promise<{ chat_id: string }>;
}) => {
  const { chat_id: chatId } = await params;
  return (
    <IntlNamespaces namespaces={["chat", "owner"]}>
      <ChatRoomTemplate chatId={chatId} />
    </IntlNamespaces>
  );
};

export default ChatPage;
