import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyEnvironmentStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyEnvironmentStepPage = async ({
  params,
}: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyEnvironmentStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyEnvironmentStepPage;
