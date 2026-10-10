"use client";

import { useCancelReservationFlow } from "@features/reservations/hooks/useCancelReservationFlow";
import { ReservationCardSkeleton } from "@modules/ReservationDetails";
import { PropertyContactModal } from "@modules/PropertyContact";
import { useUserReservations } from "@features/reservations/hooks/useUserReservations";
import { ReservationCard } from "@modules/ReservationDetails";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { ReservationContactChannel } from "@/types/components/modules/reservations";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import EmptyState from "@elements/EmptyState";
import isEmpty from "lodash/isEmpty";

const SKELETON_COUNT = 4;

const GuestReservationList = () => {
  const t = useTranslations();

  const { data: reservations, isLoading } = useUserReservations("active");
  const cancel = useCancelReservationFlow();
  const [contactChannel, setContactChannel] =
    useState<ReservationContactChannel>("");
  const [contactSlug, setContactSlug] = useState<string | undefined>(undefined);

  if (isLoading && isEmpty(reservations))
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <ReservationCardSkeleton key={index} />
        ))}
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4 md:p-4">
        {isEmpty(reservations) ? (
          <div className="col-span-2">
            <EmptyState
              actionRoute="/rooms"
              title={t("reserve.emptyReservesTitle")}
              description={t("reserve.emptyReservesDesc")}
              actionLabel={t("common.searchPropertyCta")}
            />
          </div>
        ) : (
          reservations?.map((reservation) => (
            <ReservationCard
              reservation={reservation}
              onCancel={cancel.select}
              key={`reserve${reservation?.id}`}
              onContactRequest={(channel) => {
                setContactSlug(reservation?.property?.slug);
                setContactChannel(channel);
              }}
            />
          ))
        )}
      </div>

      <PropertyContactModal
        type={contactChannel}
        show={!!contactChannel}
        propertySlug={contactSlug}
        onHide={() => setContactChannel("")}
      />

      <ConfirmModal
        onHide={cancel.close}
        onConfirm={cancel.confirm}
        isLoading={cancel.isPending}
        isVisible={!!cancel.selected}
        text={`${t("reserve.areUSureCancelReserve")} ${cancel.selected?.property?.title} ${t("reserve.areUSureShort")}`}
      />
    </>
  );
};

export default GuestReservationList;
