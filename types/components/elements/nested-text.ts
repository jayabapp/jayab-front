import type { ReactNode } from "react";

export type NestedTextProps = {
  Icon?: ReactNode;
  align?: "start" | "center" | "end";
  containerClassName?: string;
  divider?: "none" | "solid" | "dashed";
  dividerClassName?: string;
  formatNumber?: boolean;
  locale?: "fa" | "en";
  maximumFractionDigits?: number;
  title: string;
  titleClassName?: string;
  titleIconContainerClassName?: string;
  unit?: string;
  unitClassName?: string;
  value?: number | string;
  valueClassName?: string;
  valueUnitContainerClassName?: string;
  variant?: "inline" | "stacked";
};
