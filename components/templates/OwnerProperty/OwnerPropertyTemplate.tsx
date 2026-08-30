import type { OwnerPropertyTemplateProps } from "@/types/components/templates/owner-property";

const OwnerPropertyTemplate = ({ children }: OwnerPropertyTemplateProps) => (
  <main className="profile-container !pb-48 lg:!pb-36 gap-4 justify-start items-start grid grid-cols-1 md:grid-cols-2 !h-auto">
    {children}
  </main>
);

export default OwnerPropertyTemplate;
