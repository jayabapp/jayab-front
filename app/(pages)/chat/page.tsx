import { ChatListTemplate } from "@templates/ChatList";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const ChatListPage = () => (
  <IntlNamespaces namespaces={["chat"]}>
    <ChatListTemplate />
  </IntlNamespaces>
);

export default ChatListPage;
