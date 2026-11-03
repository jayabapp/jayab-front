import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyBedroomStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const PropertyBedroomStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyStepTemplate containerClass="md:px-[5%]">
        <PropertyBedroomStep propertyId={property_id} />
      </OwnerPropertyStepTemplate>
    </IntlNamespaces>
  );
};

export default PropertyBedroomStepPage;
