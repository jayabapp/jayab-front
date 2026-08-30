import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyAssistantsStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyAssistantsStepPage = async ({
  params,
}: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyAssistantsStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyAssistantsStepPage;
