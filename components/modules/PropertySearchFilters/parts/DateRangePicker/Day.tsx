import { useTranslations } from "next-intl";

import type { SearchDateRangeDayProps } from "@/types/components/modules/search-date-range-picker";

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
  const t = useTranslations();

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
      className={`aspect-square   ${!!data?.year && (!isBefore || !!isToday) ? " bg-surface-muted " : "opacity-50"} ${
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
          isToday ? "  bg-surface-hover  " : ""
        }  relative  flex items-center justify-center aspect-square    ${
          isSelectedEnd
            ? "!bg-action  rounded-e-10 text-on-action"
            : isSelectedStart
              ? "!bg-action  rounded-s-10 text-on-action"
              : ""
        }  ${!!isinBetween ? "!bg-action  rounded-0 text-on-action" : ""}`}
      >
        {!!data?.has_memo ? (
          <div className="absolute end-1 top-1  w-1 h-1 aspect-square bg-danger-500 !rounded-full">
            {" "}
          </div>
        ) : (
          <></>
        )}
        {!!data?.is_peak ? (
          <div className="absolute end-0 start-0 mx-auto  bottom-0.5   h-1  w-1/2  bg-danger-500 !rounded-full">
            {" "}
          </div>
        ) : (
          <></>
        )}

        <p
          className={`z-1 ${!!isFriday && !isinBetween && !isSelectedEnd && !isSelectedStart ? "text-status-danger" : ""} `}
        >
          {" "}
          {data?.id}
        </p>
        {isSelectedStart || isSelectedEnd ? (
          <div className="absolute bottom-1">
            {" "}
            <p className=" text-white text-[0.526rem]">
              {" "}
              {isSelectedStart ? t("common.enter") : t("listing.exit")}{" "}
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
