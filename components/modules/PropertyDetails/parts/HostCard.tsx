import { useTranslations } from "next-intl";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { Icon } from "@elements/Icon";

import type { HostCardProps } from "@/types/components/modules/property-details";

import PropertyOwnerBadge from "./PropertyOwnerBadge";

const HostCard = ({
  name,
  nameLang,
  since,
  avatar,
  isOnline,
  isAuthorized,
}: HostCardProps) => {
  const t = useTranslations("listing");
  const jalali = useJalaliFormat();

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-20 border border-line-strong bg-surface p-4 md:p-5">
      <PropertyOwnerBadge
        name={name}
        avatar={avatar}
        nameLang={nameLang}
        isOnline={isOnline}
      />
      <div className="flex flex-col gap-1 text-sm sm:items-end">
        {since ? (
          <p className="text-ink-subtle">
            {t("hostSince", { date: jalali(since, "jMMMM jYYYY") })}
          </p>
        ) : null}
        {isAuthorized ? (
          <p className="flex items-center gap-1.5 text-ink">
            <Icon name="shield" size={20} className="text-status-success" />
            {t("verified")}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default HostCard;
