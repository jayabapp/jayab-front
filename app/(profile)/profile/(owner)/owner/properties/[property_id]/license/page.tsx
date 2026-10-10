import { OwnerPropertyStepTemplate } from "@templates/OwnerPropertyEdit";
import { PropertyLicenseForm } from "@modules/PropertyMedia";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPropertyLicensePage = async ({ params }: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPropertyStepTemplate>
        <PropertyLicenseForm propertyId={property_id} />
      </OwnerPropertyStepTemplate>
    </IntlNamespaces>
  );
};

export default OwnerPropertyLicensePage;
