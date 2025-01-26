import { difference, last } from "lodash";
import { useRouter, usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import { PropertyListDto } from "@/api_services/property/property.interface";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import moment from "moment-jalaali";
import { WeekDays } from "@/utils/constantss";

export interface catQueryTypes {
  code: string | null | undefined;
}

type HomePropertiesClientPartType = {
  setCursor: Dispatch<SetStateAction<number>>;
  cursor: number;
};

function HomePropertiesClientPart({ setCursor, cursor }: HomePropertiesClientPartType) {
  const router = useRouter();
  const pathname = usePathname();
  const [week, setWeek] = useState<any[]>([]);
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);

  const [data, setData] = useState<PropertyListDto[]>([]);

  useEffect(() => {
    const dayOfWeek = moment().day();
    const weeks = [];
    for (let index = 0; index < WeekDays.length; index++) {
      const item = WeekDays?.find((e) => e?.id == index);
      if (!!item) {
        if (item?.id > dayOfWeek) weeks.push(item);
        else {
          weeks.unshift(item);
        }
      }
    }

    setWeek(weeks);
  }, []);

  const {
    isLoading,
    refetch,
    data: propQueryData,
  } = useQuery({
    queryKey: [PropertyService?.GET_PROPERTIES_CACHEKEY, cursor],
    queryFn: () => {
      return PropertyService?.GetProperties({
        cursor: Number(cursor),

        per_page: 20,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData?.data) {
      if (Number(cursor) == 0 || cursor == 0) {
        setData([]);
      } else setData((x) => [...x, ...propQueryData?.data]);
    }
  }, [propQueryData]);

  useEffect(() => {
    if (cursor != 0) refetch();
  }, [cursor, refetcherBoolean]);

  return (
    <div className="w-full px-0  self-center">
      {cursor != 0 ? (
        <div className=" w-full">
          {/* <SortContainer query={query} /> */}

          {isLoading && data?.length == 0 ? (
            <LottieLoading />
          ) : data && data?.length > 0 ? (
            <InfiniteScroll
              dataLength={data?.length} //This is important field to render the next data
              next={() => {
                setCursor(last(data)?.id || 0);
              }}
              hasMore={data?.length % 20 == 0 ? true : false}
              loader={
                <div className="w-full mt-8 flex items-center justify-center">
                  <BtnLoading />
                </div>
              }
              className="grid   pb-8 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 "
            >
              {data?.map((i) => (
                <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
              ))}
            </InfiniteScroll>
          ) : (
            <div className="col-span-4">
              <EmptyList />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default HomePropertiesClientPart;
