import type {
  TrustBadge,
  TrustBadgesProps,
} from "@/types/components/modules/property-details";
import { Icon } from "@elements/Icon";

import _STRINGS from "@/utils/LocalStrings";

// FEATURE.md §4.7/§13.4: replaces the old oval-pill row. A center "ممتاز"
// (featured) slot, plus up to two side badges chosen by priority from real
// data only — never a fabricated badge (FEATURE.md §1 explicitly forbids a
// premium badge without real backing data).
const TrustBadges = ({ property }: TrustBadgesProps) => {
  // No dedicated "ممتاز" flag exists on the property-details response today
  // (only `is_promoted` / "نردبان‌شده" does) — keep this false until the
  // backend exposes a real featured flag, rather than reusing `is_promoted`
  // for two different badges.
  const isFeatured = false;

  const sideBadges: Array<TrustBadge | null> = [
    property?.isAuthorized
      ? {
          icon: "shield",
          label: _STRINGS.VERIFIED,
          colorClass: "text-success-600",
        }
      : null,
    property?.isPromoted
      ? { icon: "star", label: _STRINGS.LADDERED, colorClass: "text-warning-600" }
      : null,
    property?.isPetAllowed
      ? { icon: "paw", label: _STRINGS.PET_ALLOWED, colorClass: "text-success-600" }
      : null,
    property?.isEventsAllowed
      ? {
          icon: "party",
          label: _STRINGS.EVENTS_ALLOWED,
          colorClass: "text-success-600",
        }
      : null,
    // Smoking allowed: `options` has no such field yet. Kept as the
    // documented 5th priority so wiring it later only means adding the
    // condition here.
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
              {_STRINGS.PREMIUM}
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
