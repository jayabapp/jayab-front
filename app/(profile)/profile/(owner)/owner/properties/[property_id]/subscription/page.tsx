import { OwnerPropertySubscriptionTemplate } from "@templates/OwnerProperty";
import { OwnerPropertySubscription } from "@modules/OwnerPropertySubscription";

import type { OwnerPropertyPageProps } from "@/types/components/templates/owner-property";

const OwnerPropertySubscriptionPage = async ({
  params,
}: OwnerPropertyPageProps) => {
  const { property_id } = await params;

  return (
    <OwnerPropertySubscriptionTemplate>
      <OwnerPropertySubscription propertyId={property_id} />
    </OwnerPropertySubscriptionTemplate>
  );
};

export default OwnerPropertySubscriptionPage;
