import type { SupportTemplateProps } from "@/types/components/templates/support";

const SupportTemplate = ({ children }: SupportTemplateProps) => (
  <main
    id="homeParent"
    className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
  >
    {children}
  </main>
);

export default SupportTemplate;
