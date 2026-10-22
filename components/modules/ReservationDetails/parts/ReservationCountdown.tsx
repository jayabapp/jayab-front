import { useTranslations } from "next-intl";

import type { ReservationCountdownProps } from "@/types/components/modules/reservations";

import NumberFlow from "@number-flow/react";

const DIGIT_CLASS =
  "pointer-events-none pt-1 text-lg !font-medium !space-x-14 w-12 h-12 flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem]";

const COMPACT_DIGIT_CLASS =
  "pointer-events-none flex size-8 items-center justify-center rounded-md bg-black pt-0.5 text-sm font-medium text-white";

const ReservationCountdown = ({
  hint,
  compact = false,
  hintBelow = false,
  minutes,
  seconds,
}: ReservationCountdownProps) => {
  const t = useTranslations();
  const digitClass = compact ? COMPACT_DIGIT_CLASS : DIGIT_CLASS;

  return (
    <div
      title={compact ? hint : undefined}
      className={`flex items-center flex-col justify-center ${compact ? "shrink-0 gap-1" : "w-full pb-1 gap-2"}`}
    >
      <p
        className={`${compact ? "sr-only" : ""} text-xs text-center w-full ${hintBelow ? "order-last text-ink-muted" : "text-status-danger"}`}
      >
        {hint ?? t("reserve.reserveOwnerTimeoutHint")}
      </p>

      {/* A clock reads minutes:seconds left to right in every language. */}
      <div dir="ltr" className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
        <div className="flex flex-col gap-1">
          <p className={`w-full text-center ${compact ? "text-2xs" : "text-sm"}`}>{t("reserve.minute")}</p>
          <NumberFlow
            willChange
            aria-hidden
            animated={true}
            className={digitClass}
            format={{ useGrouping: false }}
            value={`${minutes || "00"}` as any}
          />
        </div>
        <p className={`text-ink font-bold ${compact ? "pt-4 text-sm" : "pt-6 text-lg"}`}>:</p>
        <div className="flex flex-col gap-1">
          <p className={`w-full text-center ${compact ? "text-2xs" : "text-sm"}`}>{t("reserve.seconds")}</p>
          <NumberFlow
            willChange
            aria-hidden
            animated={true}
            className={digitClass}
            format={{ useGrouping: false }}
            value={`${seconds || "00"}` as any}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationCountdown;
