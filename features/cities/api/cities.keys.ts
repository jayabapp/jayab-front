import type { Locale } from "@/i18n/config";

export const cityKeys = {
  all: ["city"] as const,
  tree: (locale: Locale) =>
    [...cityKeys.all, "tree", { depth: "full", isParent: true }, locale] as const,
};
