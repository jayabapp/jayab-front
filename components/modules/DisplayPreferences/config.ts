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

export const SEGMENT_CLASS =
  "grid grid-flow-col auto-cols-fr gap-1 rounded-2xl bg-surface-muted p-1";

export const segmentOptionClass = (active: boolean, large: boolean) =>
  `flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 text-sm transition-colors ${
    large ? "h-12" : "h-10"
  } ${
    active
      ? "bg-surface font-bold text-ink shadow-sm ring-1 ring-line-strong"
      : "font-medium text-ink-muted hover:text-ink"
  }`;
