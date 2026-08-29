"use client";

import { useCancelReservation } from "@features/reservations/hooks/useCancelReservation";
import { useUserReservations } from "@features/reservations/hooks/useUserReservations";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { useState } from "react";

import ReservationCardSkeleton from "@features/reservations/components/ReservationCardSkeleton";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ReserveCard from "@/components/properties/reserve/ReserveCard";
import EmptyState from "@elements/EmptyState";
import isEmpty from "lodash/isEmpty";

const UserReserves = () => {
  const [selectedCancel, setSelectedCancel] = useState<ReserveListDto | null>(
    null,
  );
  const { data: reserves, isLoading } = useUserReservations("active");
  const { mutate, isPending: isCancelling } = useCancelReservation(
    selectedCancel?.property_id,
  );

  const onConfirmCancel = () => {
    if (!selectedCancel) return;
    mutate(
      { propertyReserveId: selectedCancel.id },
      { onSuccess: () => setSelectedCancel(null) },
    );
  };

  return (
    <div
      id="homeParent"
      className="   profile-container flex flex-col gap-4   transition-all duration-500 ease-in-out "
    >
      {!!isLoading && isEmpty(reserves) ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <ReservationCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className=" grid  grid-cols-1 lg:grid-cols-2 gap-4 pb-4  md:p-4">
          {reserves?.length == 0 ? (
            <div className="col-span-2">
              {" "}
              <EmptyState />
            </div>
          ) : (
            reserves?.map((e) => (
              <ReserveCard
                data={e}
                key={`reserve${e?.id}`}
                setSelectedCancel={setSelectedCancel}
              />
            ))
          )}
        </div>
      )}

      <ConfirmModal
        onConfirm={onConfirmCancel}
        isLoading={isCancelling}
        isVisible={!!selectedCancel}
        text={`از کنسل کردن رزرو ${selectedCancel?.property?.title} مطمئنید ؟`}
        onHide={() => {
          setSelectedCancel(null);
        }}
      />
    </div>
  );
};

export default UserReserves;
