import type { LegacyRef, MouseEvent, ReactNode } from "react";

export enum BtnVariants {
  solid = "btn-primary",
  outline = "btn-brand-outlined",
  Faded = "btn-brand-faded",
  flat = "btn-brand-flat",
}

export enum BtnColors {
  primary = "bg-action !ring-action/50",
  danger = "bg-danger-500 !ring-danger-500/50 !text-status-danger !border-status-danger",
  light = "bg-surface-hover/75 !ring-line/50",
  themeLight = "bg-selected !ring-selected-line/50",
}

export type ButtonProps = {
  title?: ReactNode;
  variant?: keyof typeof BtnVariants;
  color?: keyof typeof BtnColors;
  containerClass?: string;
  roundedClass?: string;
  /** Extra classes on the <button> itself, for skins the enums don't cover. */
  btnClass?: string;
  width?: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (event?: MouseEvent) => void;
  loading?: boolean;
  loadingIndicator?: ReactNode;
  preserveStyleWhileLoading?: boolean;
  disabled?: boolean;
  passRef?: LegacyRef<HTMLButtonElement>;
};
