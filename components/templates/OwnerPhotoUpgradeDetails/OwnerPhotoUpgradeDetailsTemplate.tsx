import type { OwnerPhotoUpgradeDetailsTemplateProps } from "@/types/components/templates/owner-photo-upgrade";

import OwnerPhotoUpgradeDetails from "@modules/OwnerPhotoUpgrade/OwnerPhotoUpgradeDetails.client";

const OwnerPhotoUpgradeDetailsTemplate = ({
  requestId,
}: OwnerPhotoUpgradeDetailsTemplateProps) => (
  <OwnerPhotoUpgradeDetails requestId={requestId} />
);

export default OwnerPhotoUpgradeDetailsTemplate;
