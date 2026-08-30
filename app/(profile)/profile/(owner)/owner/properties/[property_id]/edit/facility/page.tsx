import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyFacilityStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyFacilityStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate containerClass="md:px-[5%]">
      <PropertyFacilityStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyFacilityStepPage;
