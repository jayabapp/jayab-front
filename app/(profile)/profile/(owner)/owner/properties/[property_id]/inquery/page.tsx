import { OwnerPropertyInquiryTemplate } from "@templates/OwnerProperty";
import { OwnerPropertyInquiry } from "@modules/OwnerPropertyInquiry";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const OwnerPropertyInquiryPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyInquiryTemplate>
      <OwnerPropertyInquiry propertyId={property_id} />
    </OwnerPropertyInquiryTemplate>
  );
};

export default OwnerPropertyInquiryPage;
