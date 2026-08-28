import type { SupportTemplateProps } from "@/types/components/templates/support";

const SupportTicketTemplate = ({ children }: SupportTemplateProps) => (
  <main
    id="homeParent"
    className="profile-container flex flex-col gap-4 !pb-24 transition-all duration-500 ease-in-out"
  >
    {children}
  </main>
);

export default SupportTicketTemplate;
