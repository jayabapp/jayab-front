"use client";

import { useCancelReservationFlow } from "@features/reservations/hooks/useCancelReservationFlow";
import type { ActiveReservationSheetProps } from "@/types/components/modules/reservations";
import { ModalBottomSheet } from "@elements/Modal";
import { ModalHeaderPart } from "@elements/Modal";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import ReservationCard from "./ReservationCard.client";
import _STRINGS from "@/utils/LocalStrings";

const ActiveReservationSheet = ({
  show,
  onHide,
  reservation,
  onContactRequest,
}: ActiveReservationSheetProps) => {
  const cancel = useCancelReservationFlow();

  return (
    <>
      <ModalBottomSheet show={show} onHide={onHide}>
        <ModalHeaderPart
          showX
          hideArrow
          onHide={onHide}
          title={_STRINGS.YOUR_ACTIVE_RESERVE}
        />
        {reservation ? (
          <ReservationCard
            onCancel={cancel.select}
            reservation={reservation}
            onContactRequest={onContactRequest}
          />
        ) : null}
      </ModalBottomSheet>

      <ConfirmModal
        onHide={cancel.close}
        onConfirm={cancel.confirm}
        isLoading={cancel.isPending}
        isVisible={!!cancel.selected}
        text={`${_STRINGS.ARE_U_SURE_CANCEL_RESERVE} ${cancel.selected?.property?.title} ${_STRINGS.ARE_U_SURE_SHORT}`}
      />
    </>
  );
};

export default ActiveReservationSheet;
