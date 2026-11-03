import type { OwnerPhotoUpgradeDetailsRouteProps } from "@/types/app/routes";

import OwnerPhotoUpgradeDetailsTemplate from "@templates/OwnerPhotoUpgradeDetails";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPhotoUpgradeRequestPage = async ({
  params,
}: OwnerPhotoUpgradeDetailsRouteProps) => {
  const { id } = await params;
  return (
    <IntlNamespaces namespaces={["owner"]}>
      <OwnerPhotoUpgradeDetailsTemplate requestId={Number(id)} />
    </IntlNamespaces>
  );
};

export default OwnerPhotoUpgradeRequestPage;
