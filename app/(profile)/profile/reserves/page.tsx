"use client";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ReserveCard from "@/components/properties/reserve/ReserveCard";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isEmpty, last } from "lodash";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
const UserReserves = () => {
  const [cursor, setCursor] = useState(0);
  const [reserves, setReserves] = useState<ReserveListDto[]>([]);
  const [selectedCancel, setSelectedCancel] = useState<ReserveListDto | null>(null);
  const {
    data: solidData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [ReserveService?.RESERVE_CACHEKEY, cursor],
    queryFn: () => ReserveService?.userReserves({ cursor }),
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCursor(0);
  //     refetch();
  //   }, 1800000);
  //   return () => clearInterval(interval);
  // }, []);

  const refetchCallBack = () => {
    setCursor(0);
    refetch();
  };
  /* -------------------------------------------------------------------------- */
  /*                                   CANCEL                                   */
  /* -------------------------------------------------------------------------- */

  const { mutate } = useMutation({
    mutationFn: ReserveService.cancelReserve,
    onSuccess: () => {
      setSelectedCancel(null);
      refetchCallBack();
    },
  });

  const onConfirmCancel = () => {
    if (!selectedCancel) return;
    mutate({ propertyReserveId: selectedCancel?.id });
  };

  return (
    <div
      id="homeParent"
      className="   profile-container flex flex-col gap-4   transition-all duration-500 ease-in-out "
    >
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
            reserves?.map((e) => (
              <ReserveCard
                refetchCallBack={refetchCallBack}
                data={e}
                setSelectedCancel={setSelectedCancel}
                key={`reserve${e?.id}`}
              />
            ))
          )}
        </InfiniteScroll>
      )}

      <ConfirmModal
        isVisible={!!selectedCancel}
        text={`از کنسل کردن رزرو ${selectedCancel?.property?.title} مطمئنید ؟`}
        onConfirm={onConfirmCancel}
        onHide={() => {
          setSelectedCancel(null);
        }}
      />
    </div>
  );
};

export default UserReserves;
