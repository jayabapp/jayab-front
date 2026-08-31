import type { ChatRoomProps } from "@/types/components/modules/chat";
import { ChatRoom } from "@modules/ChatRoom";

const ChatRoomTemplate = ({ chatId }: ChatRoomProps) => (
  <ChatRoom chatId={chatId} />
);

export default ChatRoomTemplate;
