import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type {TrustBadgesProps} from "@/types/components/modules/property-details";
import type {TrustBadge} from "@/types/components/modules/property-details";

const TrustBadges = ({ property }: TrustBadgesProps) => {
  const t = useTranslations();

  const isFeatured = false;

  const sideBadges: Array<TrustBadge | null> = [
    property?.isAuthorized
      ? {
          icon: "shield",
          label: t("listing.verified"),
          colorClass: "text-success-600",
        }
      : null,
    property?.isPromoted
      ? {
          icon: "star",
          label: t("common.laddered"),
          colorClass: "text-warning-600",
        }
      : null,
    property?.isPetAllowed
      ? {
          icon: "paw",
          label: t("listing.petAllowed"),
          colorClass: "text-success-600",
        }
      : null,
    property?.isEventsAllowed
      ? {
          icon: "party",
          label: t("listing.eventsAllowed"),
          colorClass: "text-success-600",
        }
      : null,
    null,
  ].filter((item): item is TrustBadge => Boolean(item));

  const [firstSide, secondSide] = sideBadges;

  if (!isFeatured && !firstSide) return <></>;

  return (
    <div className="grid grid-cols-3 items-start gap-2 border-t border-neutral-100 pt-3">
      <TrustBadgeSlot badge={firstSide} />

      <div className="flex flex-col items-center gap-1 text-center">
        {isFeatured ? (
          <>
            <Icon name="sparkles" size={32} className="text-brand-600" />
            <span className="text-sm font-bold text-neutral-900">
              {t("listing.premium")}
            </span>
          </>
        ) : (
          <></>
        )}
      </div>

      <TrustBadgeSlot badge={secondSide} />
    </div>
  );
};

const TrustBadgeSlot = ({ badge }: { badge?: TrustBadge | null }) => {
  if (!badge) return <div />;
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <Icon name={badge.icon} size={24} className={badge.colorClass} />
      <span className="text-xs font-medium text-neutral-800">
        {badge.label}
      </span>
    </div>
  );
};

export default TrustBadges;
