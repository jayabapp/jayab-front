import { produce } from "immer";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation } from "@tanstack/react-query";
import moment from "moment-jalaali";
import React, { useState } from "react";

const ChangeDayStatusComp = ({
  data,
  callenderselectedDate,
  setCallendarDataState,
  selectedDateData,
}: {
  callenderselectedDate: string;
  selectedDateData?: OwnerCallendarItemDto;
  data: SingleOwnerPropertyDto;
  setCallendarDataState: React.Dispatch<React.SetStateAction<OwnerCallendarItemDto[]>>;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.UpdatePropertyStatus,
    onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          const index = e.findIndex(
            (i) =>
              i.month == Number(moment(callenderselectedDate, "jYYYY/jMM/jD").format("jMM")) &&
              i.day === Number(moment(callenderselectedDate, "jYYYY/jMM/jD").format("jD"))
          );
          const x = { ...draft[index], is_reserved: !draft[index].is_reserved };
          draft[index] = x;
        });

        // const index = e.findIndex((i) => i.day === Number(moment(callenderselectedDate, "jYYYY/jMM/jD").format("jD")));
        // e[index].is_reserved = !e[index].is_reserved;

        return next;
      });
      onHide();
    },
  });

  const onSubmit = () => {
    mutate({
      property_id: data?.id,
      month: Number(moment(callenderselectedDate, "jYYYY/jMM/jD").format("jMM")),
      year: Number(moment(callenderselectedDate, "jYYYY/jMM/jD").format("jYYYY")),
      day: Number(moment(callenderselectedDate, "jYYYY/jMM/jD").format("jD")),
    });
  };
  const onHide = () => {
    setShowConfirm(false);
  };

  return (
    <div className="w-full">
      {" "}
      <Button
        onClick={() => {
          setShowConfirm(true);
        }}
        disabled={!selectedDateData}
        loading={isPending}
        containerClass="w-full"
        width="w-full !py-1.5"
        roundedClass="rounded-full"
        title={_STRINGS.EMPTY_FULL}
      />
      <ConfirmModal
        isLoading={isPending}
        isVisible={!!showConfirm}
        onConfirm={() => {
          onSubmit();
        }}
        text={`آیا از ${
          selectedDateData?.is_reserved ? "خالی" : "رزرو"
        } کردن روز ${callenderselectedDate} اطمینان دارید؟`}
        onHide={onHide}
      />
    </div>
  );
};

export default ChangeDayStatusComp;
