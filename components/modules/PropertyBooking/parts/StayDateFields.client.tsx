"use client";

import { formatJalaliWeekday } from "@features/reservations/mappers/reservation-dates";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { formatJalaliDay } from "@features/reservations/mappers/reservation-dates";
import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { StayDateFieldsProps } from "@/types/components/modules/property-booking";

const FIELD_BASE =
  "flex flex-1 cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5 text-start transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus disabled:cursor-not-allowed";

const StayDateFields = ({
  end,
  start,
  onOpen,
  expanded,
  disabled,
  activeField,
}: StayDateFieldsProps) => {
  const t = useTranslations("reserve");
  const jalali = useJalaliFormat();

  const fields = [
    { id: "checkIn", label: t("checkinDate"), value: start },
    { id: "checkOut", label: t("checkoutDate"), value: end },
  ] as const;

  return (
    <div className="flex divide-x divide-x-reverse divide-control overflow-hidden rounded-10 border border-control">
      {fields.map((field) => (
        <button
          key={field.id}
          type="button"
          disabled={disabled}
          aria-expanded={!!expanded}
          onClick={() => onOpen(field.id)}
          className={`${FIELD_BASE} ${
            activeField === field.id
              ? "bg-surface-muted ring-2 ring-inset ring-neutral-900"
              : ""
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
            <Icon name="calendar" size={16} />
            {field.label}
          </span>
          <span
            className={`text-sm ${field.value ? "font-semibold text-ink" : "text-ink-subtle"}`}
          >
            {field.value
              ? formatJalaliDay(field.value, jalali)
              : t("emptyDate")}
          </span>
          {field.value ? (
            <span className="text-xs text-ink-subtle">
              {formatJalaliWeekday(field.value, jalali)}
            </span>
          ) : (
            <></>
          )}
        </button>
      ))}
    </div>
  );
};

export default StayDateFields;
