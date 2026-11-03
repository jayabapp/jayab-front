import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyEnvironmentStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const PropertyEnvironmentStepPage = async ({
  params,
}: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyStepTemplate>
        <PropertyEnvironmentStep propertyId={property_id} />
      </OwnerPropertyStepTemplate>
    </IntlNamespaces>
  );
};

export default PropertyEnvironmentStepPage;
