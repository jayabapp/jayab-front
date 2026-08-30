import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyBedroomStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyBedroomStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate containerClass="md:px-[5%]">
      <PropertyBedroomStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyBedroomStepPage;
