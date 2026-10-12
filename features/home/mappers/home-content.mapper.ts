import type { ContentByKeyDto } from "@/api_services/home/home.interface";
import type { Locale } from "@/i18n/config";

export type HomeContentFallback = Pick<
  ContentByKeyDto,
  "title" | "small_text" | "full_text"
>;

export const resolveHomeContent = (
  data: ContentByKeyDto | null,
  locale: Locale,
  fallback: HomeContentFallback,
): ContentByKeyDto | null => {
  if (!data || locale === "fa" || data.content_locale === locale) return data;
  return {
    ...data,
    ...fallback,
    html: "",
    seo: {
      ...data.seo,
      metaTitle: fallback.small_text,
      metaDescription: fallback.full_text,
    },
    content_locale: locale,
  };
};
