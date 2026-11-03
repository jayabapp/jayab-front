import type { ReactNode } from "react";

export type ProfileTemplateProps = {
  children: ReactNode;
};

export type ProfilePageTemplateProps = ProfileTemplateProps & {
  containerClass?: string;
};
