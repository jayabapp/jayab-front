"use client";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import ReserveCard from "@/components/properties/reserve/ReserveCard";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, last } from "lodash";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
const UserReserves = () => {
  const [cursor, setCursor] = useState(0);
  const [reserves, setReserves] = useState<ReserveListDto[]>([]);
  const {
    data: solidData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [ReserveService?.OWNER_RESERVE_CACHEKEY, cursor],
    queryFn: () => ReserveService?.ownerReserves({ cursor }),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (solidData?.data)
      if (cursor == 0) {
        setReserves((x) => solidData?.data);
      } else {
        setReserves((x) => [...x, ...solidData?.data]);
      }
  }, [solidData]);

  /* -------------------------------------------------------------------------- */
  /*                              REFETCH INTERVAL                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor(0);
      refetch();
    }, 1800000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="homeParent"
      className="   profile-container flex flex-col gap-4   transition-all duration-500 ease-in-out "
    >
      <div className=" bg-primary-350/5 border p-3  w-full  rounded-10 border-primary-350  flex flex-col gap-3">
        <p className="text-xs text-primary-350">{_STRINGS.OWNER_PLZ_CALL_MSG}</p>
      </div>
      {!!isLoading && isEmpty(reserves) ? (
        <LottieLoading />
      ) : (
        <InfiniteScroll
          dataLength={reserves?.length} //This is important field to render the next data
          next={() => {
            setCursor(last(reserves)?.id || 0);
          }}
          hasMore={!isEmpty(solidData?.data) ? true : false}
          className=" grid  grid-cols-1 lg:grid-cols-2 gap-4 pb-4  md:p-4"
          loader={
            <div className="flex  col-span-2 flex-col gap-4 p-4">
              <BtnLoading />
            </div>
          }
        >
          {reserves?.length == 0 ? (
            <div className="col-span-2">
              {" "}
              <EmptyList />
            </div>
          ) : (
            reserves?.map((e) => <ReserveCard isOwner data={e} key={`reserve${e?.id}`} />)
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default UserReserves;
