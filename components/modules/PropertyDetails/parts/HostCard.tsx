import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { HostCardProps } from "@/types/components/modules/property-details";

import PropertyOwnerBadge from "./PropertyOwnerBadge";
import moment from "moment-jalaali";

const formatHostSince = (since: string | Date) =>
  moment(since).format("jMMMM jYYYY");

const HostCard = ({
  name,
  since,
  avatar,
  isOnline,
  isAuthorized,
}: HostCardProps) => {
  const t = useTranslations("listing");

  return (
    <div className="flex flex-col gap-3 rounded-20 border border-neutral-200 bg-white p-4">
      <PropertyOwnerBadge avatar={avatar} name={name} isOnline={isOnline} />
      {since ? (
        <p className="text-sm text-neutral-500">
          {t("hostSince").replace("{date}", formatHostSince(since))}
        </p>
      ) : null}
      {isAuthorized ? (
        <div className="flex items-center gap-2 text-sm text-neutral-800">
          <Icon name="shield" size={20} className="text-success-600" />
          <span>{t("verified")}</span>
        </div>
      ) : null}
    </div>
  );
};

export default HostCard;
