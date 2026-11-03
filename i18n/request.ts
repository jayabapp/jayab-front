import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

import {
  defaultLocale,
  enabledLocales,
  LOCALE_COOKIE,
  resolveLocale,
} from "@/i18n/config";

// Static allowlist: only bundles for the three known locales can ever be
// imported, whatever the cookie says.
const messageLoaders = {
  fa: () => import("@/messages/fa.json").then((module) => module.default),
  ar: () => import("@/messages/ar.json").then((module) => module.default),
  en: () => import("@/messages/en.json").then((module) => module.default),
};

export default getRequestConfig(async () => {
  // fa-only must not touch cookies(): reading it opts the whole root layout
  // into dynamic rendering and would change caching for every page.
  const locale =
    enabledLocales.length === 1
      ? defaultLocale
      : resolveLocale((await cookies()).get(LOCALE_COOKIE)?.value);

  // No Persian "fallback" that returns a raw key: all three files must have the
  // same keys (checked in CI, feature 04), so a missing key is a release bug.
  return {
    locale,
    timeZone: "Asia/Tehran",
    messages: await messageLoaders[locale](),
  };
});
