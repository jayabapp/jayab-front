import type { ReservationCountdownProps } from "@/types/components/modules/reservations";

import _STRINGS from "@/utils/LocalStrings";
import NumberFlow from "@number-flow/react";

const DIGIT_CLASS =
  "pointer-events-none pt-1 text-lg !font-medium !space-x-14 w-12 h-12 flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem]";

const ReservationCountdown = ({
  isOwner,
  minutes,
  seconds,
}: ReservationCountdownProps) => (
  <div className="w-full flex items-center flex-col pb-1 gap-2 justify-center">
    {isOwner ? (
      <p className="text-xs text-danger-500 text-center w-full">
        {_STRINGS.RESERVE_OWNER_TIMEOUT_HINT}
      </p>
    ) : null}

    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        <p className="w-full text-center text-sm">{_STRINGS.SECONDS}</p>
        <NumberFlow
          willChange
          aria-hidden
          animated={true}
          className={DIGIT_CLASS}
          format={{ useGrouping: false }}
          value={`${seconds || "00"}` as any}
        />
      </div>
      <p className="text-black pt-6 font-bold text-lg">:</p>
      <div className="flex flex-col gap-1">
        <p className="w-full text-center text-sm">{_STRINGS.MINUTE}</p>
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

    {isOwner ? null : (
      <p className="text-sm text-neutral-400 text-center w-full">
        {_STRINGS.RESERVE_GUEST_WAITING_HINT}
      </p>
    )}
  </div>
);

export default ReservationCountdown;
