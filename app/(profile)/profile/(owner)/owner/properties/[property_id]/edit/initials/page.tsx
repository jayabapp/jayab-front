import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyInitialsStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyInitialsStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyInitialsStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyInitialsStepPage;
