import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyMediaStep } from "@modules/PropertyMedia";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const PropertyMediaStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyStepTemplate>
        <PropertyMediaStep propertyId={property_id} />
      </OwnerPropertyStepTemplate>
    </IntlNamespaces>
  );
};

export default PropertyMediaStepPage;
