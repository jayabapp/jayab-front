import type { OwnerPhotoUpgradeDetailsRouteProps } from "@/types/app/routes";

import OwnerPhotoUpgradeDetailsTemplate from "@templates/OwnerPhotoUpgradeDetails";

const OwnerPhotoUpgradeRequestPage = async ({ params }: OwnerPhotoUpgradeDetailsRouteProps) => {
  const { id } = await params;
  return <OwnerPhotoUpgradeDetailsTemplate requestId={Number(id)} />;
};

export default OwnerPhotoUpgradeRequestPage;
