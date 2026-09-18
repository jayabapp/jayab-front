import type { HostCardProps } from "@/types/components/modules/property-details";
import { Icon } from "@elements/Icon";

import PropertyOwnerBadge from "./PropertyOwnerBadge";
import _STRINGS from "@/utils/LocalStrings";

const HostCard = ({ avatar, isAuthorized, name }: HostCardProps) => (
  <div className="flex flex-col gap-3 rounded-20 border border-neutral-200 p-4">
    <PropertyOwnerBadge avatar={avatar} name={name} />
    {isAuthorized ? (
      <div className="flex items-center gap-2 text-sm text-neutral-800">
        <Icon name="shield" size={20} className="text-success-600" />
        <span>{_STRINGS.VERIFIED}</span>
      </div>
    ) : (
      <></>
    )}
  </div>
);

export default HostCard;
