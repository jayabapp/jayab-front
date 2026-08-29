import type { ReactNode } from "react";

export type PopUpDownProps = {
  item?: { containerClass?: string; headerIcon?: string; title?: string; popHieghtType?: "content-height" | "full-height" };
  visible: boolean;
  children?: ReactNode;
  setVisible: (visible: boolean) => void;
  containerClass?: string;
};
