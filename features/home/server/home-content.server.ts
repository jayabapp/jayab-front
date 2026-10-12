import { getLocale, getTranslations } from "next-intl/server";
import { resolveHomeContent } from "../mappers/home-content.mapper";
import { getCmsContent } from "@/api_services/home/cms-content.server";
import { resolveLocale } from "@/i18n/config";
import { cache } from "react";

export const getLocalizedHomeContent = cache(async () => {
  const locale = resolveLocale(await getLocale());
  const [data, t] = await Promise.all([
    getCmsContent("homeContent", locale),
    getTranslations({ locale, namespace: "content" }),
  ]);
  const fallback = {
    title: t("homeContentTitle"),
    small_text: t("homeContentHeading"),
    full_text: t("homeTitle"),
  };
  return {
    content: resolveHomeContent(data, locale, fallback),
    fallback,
    locale,
  };
});
