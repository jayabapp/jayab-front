import { ReserveDaysDto } from "@/api_services/property/property.interface";

import Image from "next/image";

type TDaysOfTheWeekProps = {
  week: any[];
  isCard?: boolean;
  data: ReserveDaysDto[];
};

const DaysOfTheWeekStatus = ({ isCard, data, week }: TDaysOfTheWeekProps) => {
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
            className={`text-xxs   !shrink-0  ${isCard ? "" : "md:text-xs"}   text-neutral-400 `}
          >
            {e?.title}
          </p>
          {isCard ? <></> : <div className="w-2 h-1"> </div>}
          {isCard ? (
            <div
              className={`  ${
                data?.find((x) => x?.day_number == e?.id)?.is_reserved
                  ? " bg-brand-600 border-brand-600  text-white "
                  : "  bg-white  border-neutral-400 text-neutral-400"
              } text-xxs  border  min-w-9 rounded-full h-5   ${
                isCard ? "" : " !h-6 md:text-sm  "
              } w-full  relative  flex items-center justify-center `}
            >
              <p className="text-center leading-4 flex items-center    m-auto justify-center">
                {" "}
                {data?.find((x) => x?.day_number == e?.id)?.is_reserved
                  ? "رزرو"
                  : "خالی"}
              </p>
            </div>
          ) : (
            <>
              {data?.find((x) => x?.day_number == e?.id)?.is_reserved ? (
                <Image
                  width={64}
                  height={64}
                  sizes="64px"
                  alt="رزرو شده"
                  src="/assets/images/shared/reserved.png"
                />
              ) : (
                <Image
                  width={64}
                  height={64}
                  sizes="64px"
                  alt="خالی"
                  src="/assets/images/shared/empty.png"
                />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DaysOfTheWeekStatus;
