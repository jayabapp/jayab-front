import type { HTMLAttributes, ReactNode } from "react";

export type ElementToImageProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};
