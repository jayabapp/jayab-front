"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { TripFilterPillProps } from "@/types/components/modules/property-search-filters";
import type { TripSegmentProps } from "@/types/components/modules/property-search-filters";

const Segment = ({ icon, title, value, onOpen, onClear }: TripSegmentProps) => {
  const t = useTranslations("common");

  return (
    <div
      className={`flex items-center ${value ? "bg-selected font-semibold text-on-selected" : "text-ink"}`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full cursor-pointer items-center gap-1.5 ps-3.5 pe-2"
      >
        <Icon name={icon} size={20} className="text-link" />
        <span>{value ?? title}</span>
        {value ? null : (
          <Icon name="chevron-down" size={16} className="text-ink-subtle" />
        )}
      </button>
      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={`${t("removeFilters")} ${title}`}
          className="me-2 flex size-5 cursor-pointer items-center justify-center rounded-full border border-action"
        >
          <Icon name="x" size={16} />
        </button>
      ) : (
        <span className="pe-1.5" />
      )}
    </div>
  );
};

const TripFilterPill = ({
  dateLabel,
  guestLabel,
  onDateClick,
  onGuestClick,
  onClearDate,
  onClearGuests,
}: TripFilterPillProps) => {
  const t = useTranslations();

  return (
    <div className="flex h-10 shrink-0 items-stretch overflow-hidden rounded-full border border-line-strong bg-surface text-sm font-medium md:h-11">
      <Segment
        icon="calendar"
        value={dateLabel}
        onOpen={onDateClick}
        onClear={onClearDate}
        title={t("listing.tripDate")}
      />
      <span aria-hidden="true" className="my-2.5 w-px bg-line" />
      <Segment
        icon="users"
        value={guestLabel}
        onOpen={onGuestClick}
        onClear={onClearGuests}
        title={t("common.pplCount")}
      />
    </div>
  );
};

export default TripFilterPill;
