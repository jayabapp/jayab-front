import { useTranslations } from "next-intl";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { Icon } from "@elements/Icon";

import type { HostCardProps } from "@/types/components/modules/property-details";

import PropertyOwnerBadge from "./PropertyOwnerBadge";

const HostCard = ({
  name,
  since,
  avatar,
  isOnline,
  isAuthorized,
}: HostCardProps) => {
  const t = useTranslations("listing");
  const jalali = useJalaliFormat();

  return (
    <div className="flex flex-col gap-3 rounded-20 border border-line-strong bg-surface p-4">
      <PropertyOwnerBadge avatar={avatar} name={name} isOnline={isOnline} />
      {since ? (
        <p className="text-sm text-ink-subtle">
          {t("hostSince").replace("{date}", jalali(since, "jMMMM jYYYY"))}
        </p>
      ) : null}
      {isAuthorized ? (
        <div className="flex items-center gap-2 text-sm text-ink">
          <Icon name="shield" size={20} className="text-status-success" />
          <span>{t("verified")}</span>
        </div>
      ) : null}
    </div>
  );
};

export default HostCard;
