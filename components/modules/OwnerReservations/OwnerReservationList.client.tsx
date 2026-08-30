"use client";

import type { OwnerReservationListProps } from "@/types/components/modules/reservations";
import { useOwnerReservations } from "@features/reservations/hooks/useOwnerReservations";
import { ReservationCardSkeleton } from "@modules/ReservationDetails";
import { ReservationCard } from "@modules/ReservationDetails";

import InfiniteScroll from "react-infinite-scroll-component";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const SKELETON_COUNT = 4;

const OwnerReservationList = ({ autoRefresh }: OwnerReservationListProps) => {
  const {
    reservations,
    isPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useOwnerReservations({}, autoRefresh);

  return (
    <>
      <div className="flex w-full flex-col gap-3 rounded-10 border border-warning-600 bg-warning-600/5 p-3">
        <p className="text-xs text-warning-600">
          {_STRINGS.OWNER_PLZ_CALL_MSG}
        </p>
      </div>

      {isPending && reservations.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ReservationCardSkeleton key={index} />
          ))}
        </div>
      ) : isEmpty(reservations) ? (
        <EmptyState />
      ) : (
        <InfiniteScroll
          dataLength={reservations.length}
          hasMore={Boolean(hasNextPage)}
          className="grid grid-cols-1 gap-4 pb-4 md:p-4 lg:grid-cols-2"
          next={() => {
            if (!isFetchingNextPage) void fetchNextPage();
          }}
          loader={
            <div className="col-span-full grid grid-cols-1 gap-4 md:grid-cols-2">
              <ReservationCardSkeleton />
              <ReservationCardSkeleton />
            </div>
          }
        >
          {reservations.map((reservation) => (
            <ReservationCard
              isOwner
              reservation={reservation}
              key={`reserve${reservation.id}`}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default OwnerReservationList;
