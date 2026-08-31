import type { ReactNode } from "react";

export type AdvisorTemplateProps = {
  children: ReactNode;
};

export type AdvisorRegistrationPageProps = {
  params: Promise<{ subscription_key: string }>;
};
