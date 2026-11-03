import { OwnerPropertyInquiryTemplate } from "@templates/OwnerProperty";
import { OwnerPropertyInquiry } from "@modules/OwnerPropertyInquiry";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPropertyInquiryPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["content", "owner", "reserve"]}>
      <OwnerPropertyInquiryTemplate>
        <OwnerPropertyInquiry propertyId={property_id} />
      </OwnerPropertyInquiryTemplate>
    </IntlNamespaces>
  );
};

export default OwnerPropertyInquiryPage;
