import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyPriceStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyPriceStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyPriceStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyPriceStepPage;
