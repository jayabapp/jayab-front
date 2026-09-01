import type { ReactNode } from "react";

export type AccordionProps = {
  children: ReactNode;
  title?: string;
};

export type SimpleAccordionProps = {
  ExtraElement?: unknown[];
  children: ReactNode;
  isOpenFirst?: boolean;
  item?: {
    disableBorderB?: boolean;
    headClass?: string;
    invertIconDark?: boolean;
    parenClass?: string;
    parentClass?: string;
    titleClass?: string;
  };
  title: string;
  titleIcon?: ReactNode;
};
