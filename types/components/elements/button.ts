import type { LegacyRef, MouseEvent, ReactNode } from "react";

export enum BtnVariants {
  solid = "btn-primary",
  outline = "btn-brand-outlined",
  Faded = "btn-brand-faded",
  flat = "btn-brand-flat",
}

export enum BtnColors {
  primary = "bg-brand-600 !ring-brand-600/50",
  danger = "bg-danger-500 !ring-danger-500/50 !text-danger-500 !border-danger-500",
  light = "bg-neutral-200/75 !ring-neutral-200/75/50",
  themeLight = "bg-brand-100 !ring-brand-100/50",
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
