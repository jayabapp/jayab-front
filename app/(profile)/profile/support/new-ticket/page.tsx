import { SupportCreateModule } from "@modules/SupportCreate";
import SupportTemplate from "@templates/SupportTemplate";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const NewTicket = () => (
  <IntlNamespaces namespaces={["profile", "validation"]}>
    <SupportTemplate>
      <SupportCreateModule dataKey="TICKET" />
    </SupportTemplate>
  </IntlNamespaces>
);

export default NewTicket;
