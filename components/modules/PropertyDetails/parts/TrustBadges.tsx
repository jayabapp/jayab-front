import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type {TrustBadgesProps} from "@/types/components/modules/property-details";
import type {TrustBadge} from "@/types/components/modules/property-details";

const TrustBadges = ({ property }: TrustBadgesProps) => {
  const t = useTranslations();

  const candidates: Array<TrustBadge | null> = [
    property?.isAuthorized
      ? {
          icon: "shield",
          label: t("listing.verified"),
          colorClass: "text-status-success",
        }
      : null,
    property?.isPromoted
      ? {
          icon: "star",
          label: t("common.laddered"),
          colorClass: "text-status-warning",
        }
      : null,
    property?.isPetAllowed
      ? {
          icon: "paw",
          label: t("listing.petAllowed"),
          colorClass: "text-status-success",
        }
      : null,
    property?.isEventsAllowed
      ? {
          icon: "party",
          label: t("listing.eventsAllowed"),
          colorClass: "text-status-success",
        }
      : null,
  ];
  const badges = candidates.filter((item): item is TrustBadge =>
    Boolean(item),
  );

  if (!badges.length) return <></>;

  return (
    <ul className="flex list-none flex-wrap items-center gap-x-5 gap-y-2">
      {badges.map((badge) => (
        <li
          key={badge.icon}
          className="flex items-center gap-1.5 text-sm text-ink-muted"
        >
          <Icon name={badge.icon} size={20} className={badge.colorClass} />
          {badge.label}
        </li>
      ))}
    </ul>
  );
};

export default TrustBadges;
