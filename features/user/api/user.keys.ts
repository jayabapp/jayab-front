export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  referral: () => [...userKeys.all, "referral"] as const,
  subscriptions: () => [...userKeys.all, "subscriptions"] as const,
  subscriptionList: (filters: { from?: string; to?: string }) =>
    [...userKeys.subscriptions(), filters] as const,
  bookmarks: () => [...userKeys.all, "bookmarks"] as const,
};
