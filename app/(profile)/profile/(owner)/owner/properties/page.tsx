import { OwnerPropertyList } from "@modules/OwnerPropertyList";

import OwnerPropertiesTemplate from "@templates/OwnerProperties";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPropertiesPage = () => (
  <IntlNamespaces namespaces={["content", "owner"]}>
    <OwnerPropertiesTemplate>
      <OwnerPropertyList />
    </OwnerPropertiesTemplate>
  </IntlNamespaces>
);

export default OwnerPropertiesPage;
