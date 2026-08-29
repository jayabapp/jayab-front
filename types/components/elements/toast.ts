import type { ReactNode } from "react";

export type NotifyProps = {
  body?: string;
  title?: string;
  loop?: boolean;
  duration?: number;
  id?: string | number;
  children?: ReactNode;
  cb?: () => void | null;
  type?: "success" | "error" | "warn" | "info";
};
