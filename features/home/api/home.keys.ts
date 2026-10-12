import { canonicalizeQueryKey } from "@lib/query/canonical-key";
import type { Locale } from "@/i18n/config";

export type ContentListFilters = {
  key: string;
  page: number;
  perPage?: number;
};

export type ContentQuestionFilters = {
  contentId?: number;
  page: number;
  perPage: number;
  productId?: number;
};

export const homeKeys = {
  all: ["home"] as const,
  banners: (positions: string[]) =>
    [...homeKeys.all, "banners", [...positions].sort()] as const,
  landings: (placement?: string) =>
    [...homeKeys.all, "landings", placement ?? "all"] as const,
};

export const cmsKeys = {
  all: ["cms"] as const,
  content: (key: string, locale: Locale = "fa") =>
    [...cmsKeys.all, "content", key, locale] as const,
  lists: () => [...cmsKeys.all, "list"] as const,
  list: (filters: ContentListFilters) =>
    [...cmsKeys.lists(), canonicalizeQueryKey(filters)] as const,
  questionsRoot: () => [...cmsKeys.all, "questions"] as const,
  questions: (filters: ContentQuestionFilters) =>
    [...cmsKeys.questionsRoot(), canonicalizeQueryKey(filters)] as const,
};
