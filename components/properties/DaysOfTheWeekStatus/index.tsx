import { ReserveDaysDto } from "@/api_services/property/property.interface";

import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const DaysOfTheWeekStatus = ({ isCard, data, week }: { week: any[]; isCard?: boolean; data: ReserveDaysDto[] }) => {
  return (
    <div
      className={`w-full flex  justify-between gap-1  ${isCard ? "!gap-0.5 2xl:!gap-0.5" : "md:gap-1"}  items-center `}
    >
      {week.map((e) => (
        <div
          style={{
            gap: "0.25rem",
            display: "flex",
            justifyItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
          }}
          key={`days${e?.id}${e?.title}`}
          className=" "
        >
          <p
            style={{ textAlign: "center" }}
            className={`text-xxs   !shrink-0  ${isCard ? "" : "md:text-xs"}   text-gray-400 `}
          >
            {e?.title}
          </p>

          <div
            className={`  ${
              data?.find((x) => x?.day_number == e?.id)?.is_reserved
                ? " bg-primary-700 border-primary-700  text-white "
                : "  bg-white  border-primary-250 text-gray-400"
            } text-xxs  border-2  min-w-9 rounded-full h-5   ${
              isCard ? "" : "md:h-7 md:text-sm  "
            } w-full  relative  flex items-center justify-center `}
          >
            <p className="text-center flex items-center  h-5  absolute  m-auto justify-center">
              {" "}
              {data?.find((x) => x?.day_number == e?.id)?.is_reserved ? "رزرو" : "خالی"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DaysOfTheWeekStatus;
