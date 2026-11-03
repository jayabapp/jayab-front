import type { Locale } from "@/i18n/config";

export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  referral: () => [...userKeys.all, "referral"] as const,
  subscriptions: () => [...userKeys.all, "subscriptions"] as const,
  subscriptionList: (filters: { from?: string; to?: string }) =>
    [...userKeys.subscriptions(), filters] as const,
  bookmarks: (locale?: Locale) =>
    locale
      ? ([...userKeys.all, "bookmarks", locale] as const)
      : ([...userKeys.all, "bookmarks"] as const),
};
