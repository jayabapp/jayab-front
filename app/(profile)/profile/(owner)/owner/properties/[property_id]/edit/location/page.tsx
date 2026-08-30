import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyLocationStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyLocationStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate containerClass="md:!px-3 lg:!px-4 xl:!px-[15%] !px-0">
      <PropertyLocationStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyLocationStepPage;
