import type { ReactNode } from "react";

export type CmsInfoPopupAction = {
  href?: string;
  onClick?: () => void;
  title: string;
};

export type CmsInfoPopupProps = {
  action: CmsInfoPopupAction;
  contentKey: string;
  onHide: () => void | null;
  show: boolean;
};

export type CmsTextWhitespace = "pre-wrap" | "pre-line" | "normal";

export type CmsTextProps = {
  as?: "p" | "div" | "span";
  children: ReactNode;
  className?: string;
  whitespace?: CmsTextWhitespace;
};
