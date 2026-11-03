import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyLocationStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const PropertyLocationStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyStepTemplate containerClass="md:!px-3 lg:!px-4 xl:!px-[15%] !px-0">
        <PropertyLocationStep propertyId={property_id} />
      </OwnerPropertyStepTemplate>
    </IntlNamespaces>
  );
};

export default PropertyLocationStepPage;
