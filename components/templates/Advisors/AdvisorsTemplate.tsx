import type { AdvisorTemplateProps } from "@/types/components/templates/advisors";

const AdvisorsTemplate = ({ children }: AdvisorTemplateProps) => (
  <main className="w-full container">{children}</main>
);

export default AdvisorsTemplate;
