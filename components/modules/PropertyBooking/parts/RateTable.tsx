
import { useFormatToman } from "@hooks/useFormatToman";
import { useTranslations } from "next-intl";

import type { RateTableProps } from "@/types/components/modules/property-booking";

const RateTable = ({
  dailyPrice,
  stdCapacity,
  cleaningFee,
  extraGuestFee,
}: RateTableProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

  if (!dailyPrice) return <></>;

  const rows = [
    { label: t("common.weekStarterDaysPrice"), price: dailyPrice.normal },
    { label: t("common.weekWensdayPrice"), price: dailyPrice.wednesday },
    { label: t("common.weekThursdayPrice"), price: dailyPrice.thursday },
    { label: t("common.weekFridayPrice"), price: dailyPrice.friday },
    { label: t("common.weekPeakPrice"), price: dailyPrice.peak },
  ].filter((row) => row.price > 0);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-ink">
        {t("reserve.calendarPricesTitle")}
      </h3>
      <dl className="flex flex-col divide-y divide-surface-muted rounded-10 border border-line px-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <dt className="text-ink-muted">{row.label}</dt>
            <dd className="font-semibold text-ink">
              {formatToman(row.price)}
            </dd>
          </div>
        ))}
      </dl>

      {extraGuestFee ? (
        <p className="text-xs text-ink-subtle">
          {t("reserve.extraGuestsLabel")}: {t("reserve.ratePerNight")}{" "}
          {formatToman(extraGuestFee)} ({t("common.overStandardCapacity")}{" "}
          {t("common.people", { count: Number(stdCapacity) })})
        </p>
      ) : null}
      {cleaningFee ? (
        <p className="text-xs text-ink-subtle">
          {t("reserve.cleaningOnce")}: {formatToman(cleaningFee)}
        </p>
      ) : null}
    </div>
  );
};

export default RateTable;
