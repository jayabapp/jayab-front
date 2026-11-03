import OwnerPhotoUpgradeListTemplate from "@templates/OwnerPhotoUpgradeList";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPhotoUpgradeRequestsPage = () => (
  <IntlNamespaces namespaces={["owner"]}>
    <OwnerPhotoUpgradeListTemplate />
  </IntlNamespaces>
);

export default OwnerPhotoUpgradeRequestsPage;
