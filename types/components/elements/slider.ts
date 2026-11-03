import type { CSSProperties } from "react";

export type RangeWithTitleProps = {
  max: number;
  showMark?: boolean;
  min: number;
  value: number;
  marks?: Record<string, { label: number | string; style: CSSProperties }>;
  setValue: (value: number) => void | null;
  className?: string;
  step?: number;
  item?: { pathColor?: string; visibleDot?: boolean; reverse?: boolean };
};
