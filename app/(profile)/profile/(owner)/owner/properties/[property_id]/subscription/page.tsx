import { OwnerPropertySubscriptionTemplate } from "@templates/OwnerProperty";
import { OwnerPropertySubscription } from "@modules/OwnerPropertySubscription";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const OwnerPropertySubscriptionPage = async ({
  params,
}: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <IntlNamespaces namespaces={["content", "owner"]}>
      <OwnerPropertySubscriptionTemplate>
        <OwnerPropertySubscription propertyId={property_id} />
      </OwnerPropertySubscriptionTemplate>
    </IntlNamespaces>
  );
};

export default OwnerPropertySubscriptionPage;
