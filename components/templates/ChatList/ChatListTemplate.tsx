import type { ChatListProps } from "@/types/components/modules/chat";
import { ChatList } from "@modules/ChatList";

const ChatListTemplate = ({ profile = false }: ChatListProps) => (
  <ChatList profile={profile} />
);

export default ChatListTemplate;
