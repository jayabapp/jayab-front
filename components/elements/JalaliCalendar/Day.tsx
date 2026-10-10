import type { JalaliDayProps } from "@/types/components/elements/jalali-calendar";

import DayPricePart from "./DayPricePart";
import moment from "moment-jalaali";

const Day = ({
  data,
  year,
  month,
  today,
  onSelect,
  disableClick,
  selectedDayId,
  isMultiSelected,
  freeDaysOfMonth,
  smallerDateFonts,
}: JalaliDayProps) => {
  const isBefore = !!freeDaysOfMonth
    ? false
    : moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isBefore();
  const isFriday =
    moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).day() == 5;
  const isToday =
    today?.day == data?.id && today?.month == month && today?.year == year;
  const isSelected =
    isMultiSelected !== undefined
      ? isMultiSelected
      : selectedDayId?.day == data?.id &&
        selectedDayId?.month == month &&
        selectedDayId?.year == year;

  return (
    <div
      className={`aspect-square   ${!!data?.year && (!isBefore || !!isToday) ? "bg-surface-muted" : " opacity-50 "} ${
        onSelect && !disableClick ? "cursor-pointer" : ""
      } `}
      onClick={() => {
        if (
          !disableClick &&
          onSelect &&
          !!data?.year &&
          (!isBefore || !!isToday)
        ) {
          onSelect(data);
        }
      }}
    >
      {" "}
      <div
        key={data?.id}
        className={`text-center flex flex-col gap-0.5 ${data?.is_reserved ? "striped" : " "}   ${
          isToday ? "  rounded-md bg-surface-hover border " : ""
        }  relative  flex items-center ${!!data?.price ? "justify-start" : "justify-center"}  md:justify-center  aspect-square  ${
          !!data?.isActive ? "border-b-2  border-action" : ""
        }  ${isSelected ? "!bg-action  rounded-md text-on-action" : ""}`}
      >
        {!!data?.has_memo ? (
          <div
            className={` absolute left-1 top-1  w-1 h-1 aspect-square  ${
              isSelected ? "bg-danger-500" : "bg-action "
            }  !rounded-full`}
          >
            {" "}
          </div>
        ) : (
          <></>
        )}
        {!!data?.is_peak ? (
          <div className="absolute left-0 right-0 mx-auto  bottom-0.5   h-1  w-1/2  bg-danger-500 !rounded-full">
            {" "}
          </div>
        ) : (
          <></>
        )}

        <p
          className={`z-1 ${smallerDateFonts ? "font-medium" : "font-bold"}  ${!!isFriday ? "text-status-danger" : ""} `}
        >
          {" "}
          {data?.id}
        </p>
        {!!data?.price ? <DayPricePart data={data} /> : <></>}
      </div>
    </div>
  );
};

export default Day;
