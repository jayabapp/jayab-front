import type { SearchDateRangeDayProps } from "@/types/components/modules/search-date-range-picker";

import _STRINGS from "@/utils/LocalStrings";
import DayPricePart from "./DayPricePart";
import moment from "moment-jalaali";

const Day = ({
  data,
  year,
  today,
  month,
  onSelect,
  selectedDayIds,
  freeDaysOfMonth,
}: SearchDateRangeDayProps) => {
  const isBefore = !!freeDaysOfMonth
    ? false
    : moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isBefore();
  const isFriday =
    moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).day() == 5;
  const isToday =
    today?.day == data?.id && today?.month == month && today?.year == year;
  const isSelectedStart =
    selectedDayIds?.startDate?.day == data?.id &&
    selectedDayIds?.startDate?.month == month &&
    selectedDayIds?.startDate?.year == year;
  const isSelectedEnd =
    selectedDayIds?.endDate?.day == data?.id &&
    selectedDayIds?.endDate?.month == month &&
    selectedDayIds?.endDate?.year == year;

  const isinBetween =
    moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isBefore(
      moment(
        `${selectedDayIds?.endDate?.year}/${selectedDayIds?.endDate?.month}/${selectedDayIds?.endDate?.day}`,
        "jYYYY/jMM/jD",
      ),
    ) &&
    moment(moment(`${year}/${month}/${data?.id}`, "jYYYY/jMM/jD")).isAfter(
      moment(
        `${selectedDayIds?.startDate?.year}/${selectedDayIds?.startDate?.month}/${selectedDayIds?.startDate?.day}`,
        "jYYYY/jMM/jD",
      ),
    );

  return (
    <div
      className={`aspect-square   ${!!data?.year && (!isBefore || !!isToday) ? " bg-neutral-100 " : "opacity-50"} ${
        onSelect ? "cursor-pointer" : ""
      } `}
      onClick={() => {
        if (onSelect && !!data?.year && (!isBefore || !!isToday)) {
          onSelect(data);
        }
      }}
    >
      {" "}
      <div
        key={data?.id}
        className={`text-center flex flex-col gap-2 ${data?.is_reserved ? "striped" : ""}   ${
          isToday ? "  bg-neutral-200  " : ""
        }  relative  flex items-center justify-center aspect-square    ${
          isSelectedEnd
            ? "!bg-brand-600  rounded-l-10 text-white"
            : isSelectedStart
              ? "!bg-brand-600  rounded-r-10 text-white"
              : ""
        }  ${!!isinBetween ? "!bg-brand-600  rounded-0 text-white" : ""}`}
      >
        {!!data?.has_memo ? (
          <div className="absolute left-1 top-1  w-1 h-1 aspect-square bg-danger-500 !rounded-full">
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
          className={`z-1 ${!!isFriday && !isinBetween && !isSelectedEnd && !isSelectedStart ? "text-red-700" : ""} `}
        >
          {" "}
          {data?.id}
        </p>
        {isSelectedStart || isSelectedEnd ? (
          <div className="absolute bottom-1">
            {" "}
            <p className=" text-white text-[0.526rem]">
              {" "}
              {isSelectedStart ? _STRINGS.ENTER : _STRINGS.EXIT}{" "}
            </p>
          </div>
        ) : (
          <></>
        )}
        {!!data?.price ? <DayPricePart data={data} /> : <></>}
      </div>
    </div>
  );
};

export default Day;
