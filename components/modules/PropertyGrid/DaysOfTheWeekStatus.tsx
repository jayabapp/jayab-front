import { useTranslations } from "next-intl";

import type { DaysOfTheWeekStatusProps } from "@/types/components/modules/property-grid";

import Image from "next/image";

const DaysOfTheWeekStatus = ({
  data,
  week,
  isCard,
}: DaysOfTheWeekStatusProps) => {
  const t = useTranslations();

  return (
    <div
      className={`w-full flex justify-between gap-1 ${
        isCard ? "!gap-0.5 2xl:!gap-0.5" : "md:gap-1"
      } items-center`}
    >
      {week.map((day) => {
        const isReserved = !!data?.find(
          (entry) => entry?.day_number === day?.id,
        )?.is_reserved;

        return (
          <div
            key={`day-${day?.id}`}
            className="flex w-full flex-col justify-center gap-1"
          >
            <p
              className={`text-2xs text-center !shrink-0 ${isCard ? "" : "md:text-xs"} text-neutral-400`}
            >
              {day?.title}
            </p>
            {isCard ? null : <div className="w-2 h-1" />}
            {isCard ? (
              <div
                className={`${
                  isReserved
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-neutral-400 text-neutral-400"
                } text-xxs border min-w-9 rounded-full h-5 w-full relative flex items-center justify-center`}
              >
                <p className="text-center leading-4 flex items-center m-auto justify-center">
                  {isReserved
                    ? t("listing.reservedShort")
                    : t("listing.freeShort")}
                </p>
              </div>
            ) : (
              <Image
                width={64}
                height={64}
                sizes="64px"
                alt={
                  isReserved ? t("listing.isReserved") : t("common.emptySlot")
                }
                src={
                  isReserved
                    ? "/assets/images/shared/reserved.png"
                    : "/assets/images/shared/empty.png"
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DaysOfTheWeekStatus;
