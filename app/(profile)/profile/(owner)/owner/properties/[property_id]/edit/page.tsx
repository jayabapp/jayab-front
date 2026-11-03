import { OwnerPropertyEditTemplate } from "@templates/OwnerPropertyEdit";
import { OwnerPropertyEditHub } from "@modules/OwnerPropertyEditor";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPropertyEditPage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyEditTemplate>
        <OwnerPropertyEditHub propertyId={property_id} />
      </OwnerPropertyEditTemplate>
    </IntlNamespaces>
  );
};

export default OwnerPropertyEditPage;
