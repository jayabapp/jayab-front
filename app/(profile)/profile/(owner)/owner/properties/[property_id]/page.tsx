import { OwnerPropertyOverview } from "@modules/OwnerPropertyOverview";
import { OwnerPropertyTemplate } from "@templates/OwnerProperty";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const OwnerPropertyPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;
  return (
    <OwnerPropertyTemplate>
      <OwnerPropertyOverview propertyId={property_id} />
    </OwnerPropertyTemplate>
  );
};

export default OwnerPropertyPage;
