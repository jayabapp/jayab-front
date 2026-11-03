import { AdvisorRegistrationTemplate } from "@templates/AdvisorSubscription";
import { AdvisorProfileForm } from "@modules/AdvisorSubscription";

import type { AdvisorRegistrationPageProps } from "@/types/components/templates/advisors";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const AdvisorRegistrationPage = async ({
  params,
}: AdvisorRegistrationPageProps) => {
  const { subscription_key } = await params;

  return (
    <IntlNamespaces namespaces={["advisor", "owner"]}>
      <AdvisorRegistrationTemplate>
        <AdvisorProfileForm subscriptionKey={subscription_key} />
      </AdvisorRegistrationTemplate>
    </IntlNamespaces>
  );
};

export default AdvisorRegistrationPage;
