"use client";

import { isEnabledLocale, LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";

export const useLocaleSwitch = (canSwitch = true) => {
  const locale = resolveLocale(useLocale());

  const setLocale = (next: unknown): boolean => {
    if (!canSwitch || !isEnabledLocale(next)) return false;
    if (next === locale) return true;
    try {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
      const saved = document.cookie
        .split(";")
        .some((cookie) => cookie.trim() === `${LOCALE_COOKIE}=${next}`);
      if (!saved) return false;
      window.location.reload();
      return true;
    } catch {
      return false;
    }
  };

  return { locale, setLocale };
};
