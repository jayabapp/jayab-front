import type { ReactNode } from "react";

export type ChromeSlotMatch = "exact" | "includes";

export type ChromeSlotProps = {
  children: ReactNode;
  hiddenOn: string[];
  match?: ChromeSlotMatch;
};

export type MainLayoutProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  overlays: ReactNode;
  mobileFooter: ReactNode;
  headerHiddenOn: string[];
  footerHiddenOn: string[];
  mobileFooterHiddenOn: string[];
};

export type ProfileLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export type AuthHeaderProps = {
  title: string;
  backRoute?: string;
  disableBack?: boolean;
};
