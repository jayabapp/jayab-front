import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import ReserveCard from "./ReserveCard";

const ActiveReservePop = ({
  data,
  show,
  onHide,
}: {
  onHide: () => void | null;
  show: boolean;
  data: ReserveListDto | null;
}) => {
  const [selectedCancel, setSelectedCancel] = useState<ReserveListDto | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                   CANCEL                                   */
  /* -------------------------------------------------------------------------- */

  const { mutate } = useMutation({
    mutationFn: ReserveService.cancelReserve,
    onSuccess: () => {
      setSelectedCancel(null);
    },
  });

  const onConfirmCancel = () => {
    if (!selectedCancel) return;
    mutate({ propertyReserveId: selectedCancel?.id });
  };

  return (
    <>
      <ModalBottomSheet show={show} onHide={onHide}>
        <ModalHeaderPart title="رزرو فعال شما" onHide={onHide} hideArrow showX />
        {!!data ? <ReserveCard setSelectedCancel={setSelectedCancel} data={data} /> : <></>}
      </ModalBottomSheet>

      <ConfirmModal
        isVisible={!!selectedCancel}
        text={`از کنسل کردن رزرو ${selectedCancel?.property?.title} مطمئنید ؟`}
        onConfirm={onConfirmCancel}
        onHide={() => {
          setSelectedCancel(null);
        }}
      />
    </>
  );
};

export default ActiveReservePop;
