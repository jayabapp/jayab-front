import { OwnerPropertyEditTemplate } from "@templates/OwnerPropertyEdit";
import { OwnerPropertyEditHub } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const OwnerPropertyEditPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertyEditTemplate>
      <OwnerPropertyEditHub propertyId={property_id} />
    </OwnerPropertyEditTemplate>
  );
};

export default OwnerPropertyEditPage;
