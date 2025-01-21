import { ReserveDaysDto } from "@/api_services/property/property.interface";
import { WeekDays } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const DaysOfTheWeekStatus = ({ isCard, data }: { isCard?: boolean; data: ReserveDaysDto[] }) => {
  return (
    <div className={`w-full flex  justify-between gap-1  ${isCard ? "" : "md:gap-1"}  items-center `}>
      {WeekDays.map((e) => (
        <div key={`days${e?.id}${e?.title}`} className="flex w-full items-center justify-center flex-col gap-2">
          <p className={`text-xxs  ${isCard ? "" : "md:text-sm"}  font-light text-primary-250`}>{e?.title}</p>

          <div
            className={`  ${
              data?.find((x) => x?.day_number == e?.id)?.is_reserved
                ? " bg-primary-700 border-primary-700  text-white "
                : "  bg-white  border-primary-250 text-primary-250"
            } text-xxs  border-2  min-w-9 rounded-full h-5   ${
              isCard ? "" : "md:h-7 md:text-sm  "
            } w-full   flex items-center justify-center `}
          >
            {data?.find((x) => x?.day_number == e?.id)?.is_reserved ? "رزرو" : "خالی"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DaysOfTheWeekStatus;
