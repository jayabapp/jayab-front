import type { ReservationMonthPickerProps } from "@/types/components/modules/reservation-date-picker";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });

const YearMonthPicker = ({
  year,
  date,
  month,
  prefix,
  setDate,
}: ReservationMonthPickerProps) => {
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
          <p className="text-xs text-neutral-50">{_STRINGS.LAST_MONTH}</p>
        </div>
      ) : (
        <div> </div>
      )}
      <p
        className={` ${setDate ? "text-brand-50 font-medium  " : "  font-bold mb-4 text-neutral-900"} text-sm f`}
      >
        {prefix}
        {month} {"  "} {year}
      </p>
      {!!setDate ? (
        <div className="flex items-center gap-2">
          <p className="text-xs text-neutral-50 ">{_STRINGS.NEXT_MONTH}</p>
          <ContentImage
            width={24}
            height={24}
            alt="`"
            onClick={() => {
              nextMonth();
            }}
            className="cursor-pointer  -rotate-180 "
            src={"/assets/icons/property/arrow_right_callendar.svg"}
          />{" "}
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

export default YearMonthPicker;
