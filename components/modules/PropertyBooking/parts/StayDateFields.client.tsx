"use client";

import { formatJalaliWeekday } from "@features/reservations/mappers/reservation-dates";
import { formatJalaliDay } from "@features/reservations/mappers/reservation-dates";
import { Icon } from "@elements/Icon";

import type { StayDateFieldsProps } from "@/types/components/modules/property-booking";

import _STRINGS from "@/utils/LocalStrings";

const FIELD_BASE =
  "flex flex-1 cursor-pointer flex-col items-start gap-0.5 px-3 py-2.5 text-start transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 disabled:cursor-not-allowed";

const StayDateFields = ({
  end,
  start,
  onOpen,
  expanded,
  disabled,
  activeField,
}: StayDateFieldsProps) => {
  const fields = [
    { id: "checkIn", label: _STRINGS.CHECKIN_DATE, value: start },
    { id: "checkOut", label: _STRINGS.CHECKOUT_DATE, value: end },
  ] as const;

  return (
    <div className="flex divide-x divide-x-reverse divide-neutral-200 overflow-hidden rounded-10 border border-neutral-200">
      {fields.map((field) => (
        <button
          key={field.id}
          type="button"
          disabled={disabled}
          aria-expanded={!!expanded}
          onClick={() => onOpen(field.id)}
          className={`${FIELD_BASE} ${
            activeField === field.id
              ? "bg-neutral-50 ring-2 ring-inset ring-neutral-900"
              : ""
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Icon name="calendar" size={16} />
            {field.label}
          </span>
          <span
            className={`text-sm ${field.value ? "font-semibold text-neutral-900" : "text-neutral-400"}`}
          >
            {field.value ? formatJalaliDay(field.value) : _STRINGS.EMPTY_DATE}
          </span>
          {field.value ? (
            <span className="text-xs text-neutral-500">
              {formatJalaliWeekday(field.value)}
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
