import { useTranslations } from "next-intl";

import type { ReservationCountdownProps } from "@/types/components/modules/reservations";

import NumberFlow from "@number-flow/react";

const DIGIT_CLASS =
  "pointer-events-none pt-1 text-lg !font-medium !space-x-14 w-12 h-12 flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem]";

const ReservationCountdown = ({
  hint,
  minutes,
  seconds,
}: ReservationCountdownProps) => {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center flex-col pb-1 gap-2 justify-center">
      <p className="text-xs text-status-danger text-center w-full">
        {hint ?? t("reserve.reserveOwnerTimeoutHint")}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <p className="w-full text-center text-sm">{t("reserve.seconds")}</p>
          <NumberFlow
            willChange
            aria-hidden
            animated={true}
            className={DIGIT_CLASS}
            format={{ useGrouping: false }}
            value={`${seconds || "00"}` as any}
          />
        </div>
        <p className="text-ink pt-6 font-bold text-lg">:</p>
        <div className="flex flex-col gap-1">
          <p className="w-full text-center text-sm">{t("reserve.minute")}</p>
          <NumberFlow
            willChange
            aria-hidden
            animated={true}
            className={DIGIT_CLASS}
            format={{ useGrouping: false }}
            value={`${minutes || "00"}` as any}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationCountdown;
