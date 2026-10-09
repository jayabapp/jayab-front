import type { ResolvedTheme, ThemeChoice } from "@/types/theme";

export const THEME_CHOICES: readonly ThemeChoice[] = [
  "light",
  "dark",
  "system",
];
export const THEME_COOKIE = "jayab_theme";
export const THEME_CHANNEL = "jayab-theme";

export const THEME_ENABLED = process.env.NEXT_PUBLIC_THEME_ENABLED === "1";

export const THEME_COOKIE_PATTERN = `(?:^|;\\s*)${THEME_COOKIE}=(${THEME_CHOICES.join("|")})(?:;|$)`;

export const parseThemeChoice = (value: unknown): ThemeChoice | null =>
  THEME_CHOICES.find((choice) => choice === value) ?? null;

export const readCookieChoice = (cookies: string): ThemeChoice | null =>
  parseThemeChoice(cookies.match(new RegExp(THEME_COOKIE_PATTERN))?.[1]);

export const resolveTheme = (
  choice: ThemeChoice | null,
  prefersDark: boolean,
  enabled: boolean = THEME_ENABLED,
): ResolvedTheme => {
  if (!enabled) return "light";
  const effective = choice ?? "system";
  return effective === "system" ? (prefersDark ? "dark" : "light") : effective;
};
