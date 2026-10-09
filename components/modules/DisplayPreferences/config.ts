import { enabledLocales } from "@/i18n/config";
import { THEME_ENABLED } from "@lib/theme/config";

const CONTROLS_ENABLED =
  process.env.NEXT_PUBLIC_DISPLAY_CONTROLS_ENABLED === "1";

export const SHOW_THEME_CONTROL = CONTROLS_ENABLED && THEME_ENABLED;
export const SHOW_LOCALE_CONTROL =
  CONTROLS_ENABLED && enabledLocales.length > 1;
export const DISPLAY_PREFERENCES_VISIBLE =
  SHOW_THEME_CONTROL || SHOW_LOCALE_CONTROL;

const LOCALE_LOCKED_PATHS = [
  /^\/auth(\/|$)/,
  /^\/chat\/[^/]+/,
  /^\/profile\/edit(\/|$)/,
  /^\/profile\/support\/new-ticket(\/|$)/,
  /^\/profile\/owner\/properties\/[^/]+\/edit(\/|$)/,
];

export const isLocaleSwitchLocked = (pathname: string | null) =>
  !!pathname && LOCALE_LOCKED_PATHS.some((pattern) => pattern.test(pathname));
