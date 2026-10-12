import { getCmsContent } from "@/api_services/home/cms-content.server";
import { resolveLocale } from "@/i18n/config";
import { getLocale } from "next-intl/server";
import { cache } from "react";

export const getLocalizedTermsContent = cache(async () => {
  const locale = resolveLocale(await getLocale());
  return { locale, content: await getCmsContent("terms", locale) };
});
