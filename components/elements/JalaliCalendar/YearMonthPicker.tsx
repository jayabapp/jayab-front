import type { JalaliYearMonthPickerProps } from "@/types/components/elements/jalali-calendar";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
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
        <ContentImage
          alt="`"
          width={24}
          height={24}
          className="cursor-pointer "
          src={"/assets/icons/property/arrow_right_callendar.svg"}
          onClick={() => {
            lastMonth();
          }}
        />
        <p className="text-xs text-neutral-400">{_STRINGS.LAST_MONTH}</p>
      </div>
      <p className="text-brand-600 text-sm font-medium ">
        {prefix}
        {month} {"  "} {year}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-neutral-400 ">{_STRINGS.NEXT_MONTH}</p>
        <ContentImage
          alt="`"
          width={24}
          height={24}
          onClick={() => {
            nextMonth();
          }}
          className="cursor-pointer  -rotate-180 "
          src={"/assets/icons/property/arrow_right_callendar.svg"}
        />{" "}
      </div>
    </div>
  );
};

export default YearMonthPicker;
