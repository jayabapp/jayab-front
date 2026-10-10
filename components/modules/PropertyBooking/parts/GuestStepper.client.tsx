"use client";

import { useFormatNumber } from "@hooks/useFormatNumber";
import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { GuestStepperProps } from "@/types/components/modules/property-booking";


const BUTTON_CLASS =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-strong text-ink md:size-8 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const GuestStepper = ({
  id,
  max,
  std,
  value,
  onChange,
  extraGuestFee,
}: GuestStepperProps) => {
  const t = useTranslations();
  const formatNumber = useFormatNumber();

  const isAtMax = value !== null && value >= max;
  const extra = value !== null ? value - std : 0;

  return (
    <div className="flex flex-col gap-1.5 rounded-10 border border-line px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="users" size={20} className="text-ink-subtle" />
          <div className="flex flex-col">
            <span className="text-xs text-ink-subtle">
              {t("reserve.guestCount")}
            </span>
            <span
              className={`text-sm ${value !== null ? "font-semibold text-ink" : "text-ink-subtle"}`}
            >
              {value !== null
                ? `${t("common.people", { count: Number(value) })}`
                : t("reserve.guestCountPlaceholder")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 ltr:flex-row-reverse">
          <button
            id={id}
            type="button"
            disabled={isAtMax}
            className={BUTTON_CLASS}
            aria-label={t("reserve.addGuest")}
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
            aria-label={t("reserve.removeGuest")}
            onClick={() => onChange(value && value > 1 ? value - 1 : null)}
          >
            <Icon name="minus" size={16} />
          </button>
        </div>
      </div>

      {extra > 0 && extraGuestFee ? (
        <p className="text-xs text-status-warning">
          {t("reserve.overStandardNote")
            .replace("{count}", `${extra}`)
            .replace("{fee}", `${formatNumber(extraGuestFee)}`)}
        </p>
      ) : null}
      {isAtMax ? (
        <p className="text-xs text-ink-subtle">
          {t("reserve.maxCapacityNote").replace("{count}", `${max}`)}
        </p>
      ) : null}
    </div>
  );
};

export default GuestStepper;
