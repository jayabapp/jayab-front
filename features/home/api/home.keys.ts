import { canonicalizeQueryKey } from "@lib/query/canonical-key";

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
  content: (key: string) => [...cmsKeys.all, "content", key] as const,
  lists: () => [...cmsKeys.all, "list"] as const,
  list: (filters: ContentListFilters) =>
    [...cmsKeys.lists(), canonicalizeQueryKey(filters)] as const,
  questionsRoot: () => [...cmsKeys.all, "questions"] as const,
  questions: (filters: ContentQuestionFilters) =>
    [...cmsKeys.questionsRoot(), canonicalizeQueryKey(filters)] as const,
};
