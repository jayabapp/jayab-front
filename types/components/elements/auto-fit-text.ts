import type { CSSProperties } from "react";

export type AutoFitTextProps = {
  className?: string;
  maxFontSize?: number;
  minFontSize?: number;
  style?: CSSProperties;
  text: string;
};
