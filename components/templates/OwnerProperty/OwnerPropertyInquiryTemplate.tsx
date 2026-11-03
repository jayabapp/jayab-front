import type { OwnerPropertyTemplateProps } from "@/types/components/templates/owner-property";

const OwnerPropertyInquiryTemplate = ({
  children,
}: OwnerPropertyTemplateProps) => (
  <main className="profile-container grid gap-4 md:grid-cols-2 flex-col items-start justify-center !h-auto">
    {children}
  </main>
);

export default OwnerPropertyInquiryTemplate;
