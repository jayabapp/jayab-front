import { AdvisorSubscriptionTemplate } from "@templates/AdvisorSubscription";
import { AdvisorSubscription } from "@modules/AdvisorSubscription";

import IntlNamespaces from "@/i18n/IntlNamespaces";

const AdvisorSubscriptionPage = () => (
  <IntlNamespaces namespaces={["advisor", "owner"]}>
    <AdvisorSubscriptionTemplate>
      <AdvisorSubscription />
    </AdvisorSubscriptionTemplate>
  </IntlNamespaces>
);

export default AdvisorSubscriptionPage;
