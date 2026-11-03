import { OwnerPropertyOverview } from "@modules/OwnerPropertyOverview";
import { OwnerPropertyTemplate } from "@templates/OwnerProperty";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPropertyPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;
  return (
    <IntlNamespaces namespaces={["content", "owner", "reserve"]}>
      <OwnerPropertyTemplate>
        <OwnerPropertyOverview propertyId={property_id} />
      </OwnerPropertyTemplate>
    </IntlNamespaces>
  );
};

export default OwnerPropertyPage;
