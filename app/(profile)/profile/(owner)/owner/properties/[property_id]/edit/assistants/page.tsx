import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyAssistantsStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const PropertyAssistantsStepPage = async ({
  params,
}: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyStepTemplate>
        <PropertyAssistantsStep propertyId={property_id} />
      </OwnerPropertyStepTemplate>
    </IntlNamespaces>
  );
};

export default PropertyAssistantsStepPage;
