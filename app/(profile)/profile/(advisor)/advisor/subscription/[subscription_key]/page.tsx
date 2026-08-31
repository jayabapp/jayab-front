import { AdvisorRegistrationTemplate } from "@templates/AdvisorSubscription";
import { AdvisorProfileForm } from "@modules/AdvisorSubscription";

import type { AdvisorRegistrationPageProps } from "@/types/components/templates/advisors";

const AdvisorRegistrationPage = async ({
  params,
}: AdvisorRegistrationPageProps) => {
  const { subscription_key } = await params;

  return (
    <AdvisorRegistrationTemplate>
      <AdvisorProfileForm subscriptionKey={subscription_key} />
    </AdvisorRegistrationTemplate>
  );
};

export default AdvisorRegistrationPage;
