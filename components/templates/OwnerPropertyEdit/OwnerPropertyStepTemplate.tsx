import type { OwnerPropertyStepTemplateProps } from "@/types/components/templates/owner-property";

const OwnerPropertyStepTemplate = ({
  children,
  containerClass,
}: OwnerPropertyStepTemplateProps) => (
  <main
    id="homeParent"
    className={`profile-container items-center transition-all duration-500 ease-in-out flex flex-col gap-6 ${containerClass ?? ""}`}
  >
    {children}
  </main>
);

export default OwnerPropertyStepTemplate;
