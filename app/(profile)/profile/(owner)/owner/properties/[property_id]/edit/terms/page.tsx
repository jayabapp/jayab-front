import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyTermsStep } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const PropertyTermsStepPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyTermsStep propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default PropertyTermsStepPage;
