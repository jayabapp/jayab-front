import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyLicenseForm } from "@modules/PropertyMedia";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const OwnerPropertyLicensePage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyStepTemplate>
      <PropertyLicenseForm propertyId={property_id} />
    </OwnerPropertyStepTemplate>
  );
};

export default OwnerPropertyLicensePage;
