import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { TrustBadgesProps } from "@/types/components/modules/property-details";
import type { TrustBadge } from "@/types/components/modules/property-details";

const TrustBadges = ({ property }: TrustBadgesProps) => {
  const t = useTranslations();

  const badges = [
    property?.isAuthorized
      ? {
          icon: "shield",
          label: t("listing.verified"),
          iconClass: "text-status-success",
        }
      : null,
    property?.isPromoted
      ? {
          icon: "chevrons-up",
          label: t("common.laddered"),
          iconClass: "text-link",
        }
      : null,
  ].filter((item): item is TrustBadge => Boolean(item));

  if (!badges.length) return <></>;

  return (
    <ul className="inline-flex h-9 w-fit max-w-full list-none items-stretch rounded-full border border-line-strong bg-surface shadow-sm md:h-11">
      {badges.map((badge, index) => (
        <li
          key={badge.icon}
          className={`flex items-center gap-2 whitespace-nowrap px-3.5 text-xs font-bold text-ink md:text-sm ${
            index ? "border-s border-line" : ""
          }`}
        >
          <Icon name={badge.icon} size={20} className={badge.iconClass} />
          {badge.label}
        </li>
      ))}
    </ul>
  );
};

export default TrustBadges;
