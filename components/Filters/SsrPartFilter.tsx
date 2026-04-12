import { WeekDays } from "@/utils/constantss";
import { isUndefined } from "lodash";
import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import PropertyCard from "../properties/PropertyCard";
import EmptyList from "../shared/Lotties/EmptyList";
import LottieLoading from "../shared/Lotties/LottieLoading";

type SsrPartFilterType = {
  firstData: any;
};

function SsrPartFilter({ firstData }: SsrPartFilterType) {
  const [week, setWeek] = useState<any[]>([]);
  useEffect(() => {
    const dayOfWeek = moment().day();

    const weeks = [];
    for (let index = dayOfWeek; index < dayOfWeek + 7; index++) {
      const item = WeekDays?.find((e) => {
        if (index >= 7) {
          return e?.id == index - 7;
        } else {
          return e?.id == index;
        }
      });
      if (index < 7) {
        weeks.push(item);
      } else {
        weeks.push(item);
      }
    }

    setWeek(weeks);
  }, []);
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {/* <SortContainer query={query} /> */}

        {isUndefined(firstData) ? (
          <LottieLoading />
        ) : firstData?.length > 0 ? (
          <div className="grid   pb-2 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 ">
            {firstData?.map((i: any) => (
              <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
            ))}
          </div>
        ) : (
          <div className="col-span-4">
            <EmptyList />
          </div>
        )}
      </div>
    </div>
  );
}

export default SsrPartFilter;
