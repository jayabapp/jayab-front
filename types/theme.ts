export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type ThemeSnapshot = {
  ready: boolean;
  enabled: boolean;
  choice: ThemeChoice;
  resolved: ResolvedTheme;
};
