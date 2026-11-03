import type { ReactNode } from "react";

export type OwnerPropertyTemplateProps = {
  children: ReactNode;
};

export type OwnerPropertyStepTemplateProps = OwnerPropertyTemplateProps & {
  containerClass?: string;
};

export type OwnerPropertyPageProps = {
  params: Promise<{ property_id: string }>;
};
