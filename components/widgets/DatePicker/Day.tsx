import moment from "moment-jalaali";
import DayPricePart from "./DayPricePart";

type dataTypes = {
  data?: {
    id?: number | string;
    has_memo?: number | string;
    is_reserved?: number | string | boolean;
    isActive?: boolean;
    price?: number;
    discounted_price?: number;
    is_peak?: boolean;
    year?: string;
    month?: string;
  };
  onSelect?: (e: any | null) => void | null;
  selectedDayId?: { day: number; month: string; year: string };
  today?: { day: number; month: string; year: string };
  month?: string;
  year?: string;
  showTimeOfTheDay?: boolean;
  freeDaysOfMonth?: boolean;
  smallerDateFonts?: boolean;
  disableClick?: boolean;
  isMultiSelected?: boolean;
};

const Day = ({
  onSelect,
  data,
  selectedDayId,
  month,
  year,
  freeDaysOfMonth,
  today,
  smallerDateFonts,
  disableClick,
  isMultiSelected,
}: dataTypes) => {
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
      className={`aspect-square   ${!!data?.year && (!isBefore || !!isToday) ? "bg-primary-450" : " opacity-50 "} ${
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
          isToday ? "  rounded-md bg-gray-200 border " : ""
        }  relative  flex items-center ${!!data?.price ? "justify-start" : "justify-center"}  md:justify-center  aspect-square  ${
          !!data?.isActive ? "border-b-2  border-primary-700" : ""
        }  ${isSelected ? "!bg-primary-700  rounded-md text-white" : ""}`}
      >
        {!!data?.has_memo ? (
          <div
            className={` absolute left-1 top-1  w-1 h-1 aspect-square  ${
              isSelected ? "bg-primary-900" : "bg-primary-700 "
            }  !rounded-full`}
          >
            {" "}
          </div>
        ) : (
          <></>
        )}
        {!!data?.is_peak ? (
          <div className="absolute left-0 right-0 mx-auto  bottom-0.5   h-1  w-1/2  bg-primary-900 !rounded-full">
            {" "}
          </div>
        ) : (
          <></>
        )}

        <p
          className={`z-1 ${smallerDateFonts ? "font-medium" : "font-bold"}  ${!!isFriday ? "text-red-700" : ""} `}
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
