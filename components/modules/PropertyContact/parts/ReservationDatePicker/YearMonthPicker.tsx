import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { ReservationMonthPickerProps } from "@/types/components/modules/reservation-date-picker";

import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const YearMonthPicker = ({
  year,
  date,
  month,
  prefix,
  setDate,
}: ReservationMonthPickerProps) => {
  const t = useTranslations("common");

  const nextMonth = () => {
    setDate?.(
      moment(date, "jYYYY/jMM/jDD").add(1, "month").format("jYYYY/jMM/jDD"),
    );
  };
  const lastMonth = () => {
    setDate?.(
      moment(date, "jYYYY/jMM/jDD")
        .subtract(1, "month")
        .format("jYYYY/jMM/jDD"),
    );
  };

  return (
    <div
      className={`flex snap-x w-full  ${!!setDate ? " justify-between" : "  justify-start "} items-center  px-4`}
    >
      {!!setDate ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t("lastMonth")}
            onClick={() => lastMonth()}
            className="cursor-pointer text-ink"
          >
            <Icon name="arrow-start" size={24} />
          </button>
          <p className="text-xs text-neutral-50">{t("lastMonth")}</p>
        </div>
      ) : (
        <div> </div>
      )}
      <p
        className={` ${setDate ? "text-brand-50 font-medium" : "font-bold mb-4 text-ink"} text-sm f`}
      >
        {prefix}
        {month} {"  "} {year}
      </p>
      {!!setDate ? (
        <div className="flex items-center gap-2">
          <p className="text-xs text-neutral-50 ">{t("nextMonth")}</p>
          <button
            type="button"
            aria-label={t("nextMonth")}
            onClick={() => nextMonth()}
            className="cursor-pointer text-ink"
          >
            <Icon name="arrow-end" size={24} />
          </button>
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

export default YearMonthPicker;
