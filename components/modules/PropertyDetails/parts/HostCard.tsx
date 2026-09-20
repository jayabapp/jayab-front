import type { HostCardProps } from "@/types/components/modules/property-details";
import { Icon } from "@elements/Icon";

import PropertyOwnerBadge from "./PropertyOwnerBadge";
import HostActions from "./HostActions.client";
import _STRINGS from "@/utils/LocalStrings";

const HostCard = ({
  name,
  since,
  avatar,
  property,
  isAuthorized,
}: HostCardProps) => (
  <div className="flex flex-col gap-3 rounded-20 border border-neutral-200 p-4">
    <PropertyOwnerBadge avatar={avatar} name={name} />
    {since ? (
      <p className="text-sm text-neutral-500">
        میزبان جایاب از{" "}
        {new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
          month: "long",
          year: "numeric",
        }).format(new Date(since))}
      </p>
    ) : null}
    {isAuthorized ? (
      <div className="flex items-center gap-2 text-sm text-neutral-800">
        <Icon name="shield" size={20} className="text-success-600" />
        <span>{_STRINGS.VERIFIED}</span>
      </div>
    ) : null}
    <HostActions property={property} />
  </div>
);

export default HostCard;
