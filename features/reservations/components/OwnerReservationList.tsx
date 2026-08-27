"use client";

import { useOwnerReservations } from "../hooks/useOwnerReservations";
import { useEffect } from "react";

import ReservationCardSkeleton from "./ReservationCardSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import ReserveCard from "@/components/properties/reserve/ReserveCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const OwnerReservationList = ({
  autoRefresh = false,
}: {
  autoRefresh?: boolean;
}) => {
  const {
    reservations,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useOwnerReservations();

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = window.setInterval(() => void refetch(), 30 * 60_000);
    return () => window.clearInterval(interval);
  }, [autoRefresh, refetch]);

  return (
    <div className="profile-container flex flex-col gap-4">
      <div className="flex w-full flex-col gap-3 rounded-10 border border-primary-350 bg-primary-350/5 p-3">
        <p className="text-xs text-primary-350">
          {_STRINGS.OWNER_PLZ_CALL_MSG}
        </p>
      </div>
      {isPending && reservations.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <ReservationCardSkeleton key={index} />
          ))}
        </div>
      ) : isEmpty(reservations) ? (
        <EmptyList />
      ) : (
        <InfiniteScroll
          dataLength={reservations.length}
          next={() => {
            if (!isFetchingNextPage) void fetchNextPage();
          }}
          hasMore={Boolean(hasNextPage)}
          className="grid grid-cols-1 gap-4 pb-4 md:p-4 lg:grid-cols-2"
          loader={
            <div className="col-span-full grid grid-cols-1 gap-4 md:grid-cols-2">
              <ReservationCardSkeleton />
              <ReservationCardSkeleton />
            </div>
          }
        >
          {reservations.map((reservation) => (
            <ReserveCard
              isOwner
              data={reservation}
              key={`reserve${reservation.id}`}
              refetchCallBack={() => void refetch()}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default OwnerReservationList;
