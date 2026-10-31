import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { JalaliYearMonthPickerProps } from "@/types/components/elements/jalali-calendar";

import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });
const YearMonthPicker = ({
  date,
  year,
  month,
  prefix,
  setDate,
  disablePrevMonths,
}: JalaliYearMonthPickerProps) => {
  const t = useTranslations("common");

  const nextMonth = () => {
    setDate(
      moment(date, "jYYYY/jMM/jDD")
        .startOf("month")
        .add(1, "month")
        .format("jYYYY/jMM/jDD"),
    );
  };
  const lastMonth = () => {
    if (
      !!disablePrevMonths &&
      moment(date, "jYYYY/jMM/jDD").month() == moment().month()
    ) {
      console.log("cant go back");
    } else
      setDate(
        moment(date, "jYYYY/jMM/jDD")
          .startOf("month")
          .subtract(1, "month")
          .format("jYYYY/jMM/jDD"),
      );
  };

  return (
    <div className="flex snap-x w-full justify-between items-center  px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={t("lastMonth")}
          onClick={() => lastMonth()}
          className="cursor-pointer text-ink"
        >
          <Icon name="arrow-start" size={24} />
        </button>
        <p className="text-xs text-ink-subtle">{t("lastMonth")}</p>
      </div>
      <p className="text-link text-sm font-medium ">
        {prefix}
        {month} {"  "} {year}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-ink-subtle ">{t("nextMonth")}</p>
        <button
          type="button"
          aria-label={t("nextMonth")}
          onClick={() => nextMonth()}
          className="cursor-pointer text-ink"
        >
          <Icon name="arrow-end" size={24} />
        </button>
      </div>
    </div>
  );
};

export default YearMonthPicker;
