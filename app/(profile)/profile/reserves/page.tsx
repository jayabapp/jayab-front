"use client";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ReserveCard from "@/components/properties/reserve/ReserveCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useState } from "react";
const UserReserves = () => {
  const [selectedCancel, setSelectedCancel] = useState<ReserveListDto | null>(null);
  const {
    data: reserves,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [ReserveService?.RESERVE_CACHEKEY],
    queryFn: () => ReserveService?.userReserves({ type: "active" }),
    staleTime: 0,
    gcTime: 0,
  });

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
        <div className=" grid  grid-cols-1 lg:grid-cols-2 gap-4 pb-4  md:p-4">
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
        </div>
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
