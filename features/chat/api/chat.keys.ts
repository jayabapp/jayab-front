export const chatKeys = {
  all: ["chat"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  list: () => [...chatKeys.lists()] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (chatId: string) => [...chatKeys.details(), chatId] as const,
  messages: (chatId: string) =>
    [...chatKeys.detail(chatId), "messages"] as const,
  unreadCount: () => [...chatKeys.all, "unread-count"] as const,
};
