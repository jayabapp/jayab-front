import { useCancelReservation } from "@features/reservations/hooks/useCancelReservation";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { useState } from "react";

import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ReserveCard from "./ReserveCard";

type TActiveReserveProps = {
  show: boolean;
  onHide: () => void | null;
  data: ReserveListDto | null;
};

const ActiveReservePop = ({ data, show, onHide }: TActiveReserveProps) => {
  const [selectedCancel, setSelectedCancel] = useState<ReserveListDto | null>(
    null,
  );

  const { mutate, isPending } = useCancelReservation(
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
    <>
      <ModalBottomSheet show={show} onHide={onHide}>
        <ModalHeaderPart
          title="رزرو فعال شما"
          onHide={onHide}
          hideArrow
          showX
        />
        {!!data ? (
          <ReserveCard setSelectedCancel={setSelectedCancel} data={data} />
        ) : (
          <></>
        )}
      </ModalBottomSheet>

      <ConfirmModal
        isLoading={isPending}
        onConfirm={onConfirmCancel}
        isVisible={!!selectedCancel}
        text={`از کنسل کردن رزرو ${selectedCancel?.property?.title} مطمئنید ؟`}
        onHide={() => {
          setSelectedCancel(null);
        }}
      />
    </>
  );
};

export default ActiveReservePop;
