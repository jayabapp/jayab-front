"use client";

import type { GuestStepperProps } from "@/types/components/modules/property-booking";
import { Icon } from "@elements/Icon";

import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";

const BUTTON_CLASS =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 text-neutral-900 md:size-8 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const GuestStepper = ({
  id,
  max,
  std,
  value,
  onChange,
  extraGuestFee,
}: GuestStepperProps) => {
  const isAtMax = value !== null && value >= max;
  const extra = value !== null ? value - std : 0;

  return (
    <div className="flex flex-col gap-1.5 rounded-10 border border-neutral-200 px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="users" size={20} className="text-neutral-500" />
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500">
              {_STRINGS.GUEST_COUNT}
            </span>
            <span
              className={`text-sm ${value !== null ? "font-semibold text-neutral-900" : "text-neutral-400"}`}
            >
              {value !== null
                ? `${value} ${_STRINGS.PERSON}`
                : _STRINGS.GUEST_COUNT_PLACEHOLDER}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id={id}
            type="button"
            disabled={isAtMax}
            className={BUTTON_CLASS}
            aria-label={_STRINGS.ADD_GUEST}
            onClick={() => onChange(value === null ? 1 : value + 1)}
          >
            <Icon name="plus" size={16} />
          </button>
          <span className="min-w-4 text-center text-sm font-semibold">
            {value ?? ""}
          </span>
          <button
            type="button"
            className={BUTTON_CLASS}
            disabled={value === null}
            aria-label={_STRINGS.REMOVE_GUEST}
            onClick={() => onChange(value && value > 1 ? value - 1 : null)}
          >
            <Icon name="minus" size={16} />
          </button>
        </div>
      </div>

      {extra > 0 && extraGuestFee ? (
        <p className="text-xs text-warning-600">
          {_STRINGS.OVER_STANDARD_NOTE.replace("{count}", `${extra}`).replace(
            "{fee}",
            `${numberWithCommas(extraGuestFee)}`,
          )}
        </p>
      ) : null}
      {isAtMax ? (
        <p className="text-xs text-neutral-500">
          {_STRINGS.MAX_CAPACITY_NOTE.replace("{count}", `${max}`)}
        </p>
      ) : null}
    </div>
  );
};

export default GuestStepper;
