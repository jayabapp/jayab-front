import ChatListSkeleton from "@modules/ChatList/parts/ChatListSkeleton";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const ChatListLoading = () => (
  <IntlNamespaces namespaces={["chat"]}>
    <ChatListSkeleton />
  </IntlNamespaces>
);

export default ChatListLoading;
