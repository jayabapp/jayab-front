"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { TripFilterPillProps } from "@/types/components/modules/property-search-filters";
import type { TripSegmentProps } from "@/types/components/modules/property-search-filters";

const Segment = ({ icon, title, value, onOpen, onClear }: TripSegmentProps) => {
  const t = useTranslations("listing");

  return (
    <div
      className={`flex items-center ${value ? "bg-selected font-semibold text-on-selected" : "text-ink"}`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full cursor-pointer items-center gap-1 ps-2.5 pe-1.5 md:ps-3"
      >
        <Icon name={icon} size={16} className="text-link" />
        <span>{value ?? title}</span>
        {value ? null : (
          <Icon name="chevron-down" size={16} className="size-3.5 text-ink-subtle" />
        )}
      </button>
      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={t("removeFilterNamed", { title })}
          className="me-1.5 flex size-4 cursor-pointer items-center justify-center rounded-full border border-action"
        >
          <Icon name="x" size={16} className="size-3" />
        </button>
      ) : (
        <span className="pe-1" />
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
    <div className="flex h-7 shrink-0 items-stretch overflow-hidden rounded-full border border-line-strong bg-surface text-[11px] font-medium md:h-9 md:text-xs">
      <Segment
        icon="calendar"
        value={dateLabel}
        onOpen={onDateClick}
        onClear={onClearDate}
        title={t("listing.tripDate")}
      />
      <span aria-hidden="true" className="my-1.5 w-px bg-line md:my-2" />
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
