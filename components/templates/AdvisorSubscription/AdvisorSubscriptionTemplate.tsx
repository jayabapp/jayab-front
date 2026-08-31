import type { AdvisorTemplateProps } from "@/types/components/templates/advisors";

const AdvisorSubscriptionTemplate = ({ children }: AdvisorTemplateProps) => (
  <main className="profile-container flex flex-col gap-4">{children}</main>
);

export default AdvisorSubscriptionTemplate;
