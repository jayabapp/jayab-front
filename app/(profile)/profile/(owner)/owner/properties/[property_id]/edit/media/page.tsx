import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyMediaStep } from "@modules/PropertyMedia";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyMediaStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyMediaStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyMediaStepPage;
