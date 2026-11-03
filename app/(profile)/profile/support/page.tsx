import { SupportListModule } from "@modules/SupportList";
import SupportTemplate from "@templates/SupportTemplate";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const SupportPage = () => (
  <IntlNamespaces namespaces={["profile"]}>
    <SupportTemplate>
      <SupportListModule />
    </SupportTemplate>
  </IntlNamespaces>
);

export default SupportPage;
