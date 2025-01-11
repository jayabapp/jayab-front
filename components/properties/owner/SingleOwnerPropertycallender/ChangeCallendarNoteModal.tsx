"use client";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";

const ChangeCommissionModal = ({
  show,
  onHide,
  selectedDateData,
  setCallendarDataState,
  data,
}: {
  show: boolean;
  onHide: () => void | null;
  selectedDateData?: OwnerCallendarItemDto;
  setCallendarDataState: React.Dispatch<React.SetStateAction<OwnerCallendarItemDto[]>>;
  data: SingleOwnerPropertyDto;
}) => {
  const [note, setNote] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.UpdateCallendarNote,
    onSuccess: () => {
      setCallendarDataState((e) => {
        const next = produce(e, (draft) => {
          const index = e.findIndex((i) => i.month == selectedDateData?.month && i.day === selectedDateData?.day);
          const x = { ...draft[index], note: note };
          draft[index] = x;
        });

        return next;
      });
      onHide();
    },
  });

  useEffect(() => {
    if (!!selectedDateData) {
      setNote(selectedDateData?.note || "");
    }

    return () => {
      setNote("");
    };
  }, [selectedDateData]);

  const onSubmit = () => {
    mutate({
      property_id: data?.id,
      month: Number(selectedDateData?.month),
      year: Number(selectedDateData?.year),
      day: Number(selectedDateData?.day),
      note: note,
    });
  };
  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20 ">
        <p className="text-sm font-bold text-primary-700">
          {_STRINGS.EDIT} {_STRINGS.MEMO}
        </p>
        <p className="text-xs">{_STRINGS.LOREM}</p>

        <MultiLineFormInput
          value={note}
          item={{ containerClass: "w-full", rows: 3, title: _STRINGS.MEMO }}
          onChangeText={(e) => setNote(e)}
        />

        <Divider moreClass="w-full " />
        <Button
          onClick={onSubmit}
          title={_STRINGS.RECORD_CHANGES}
          loading={isPending}
          roundedClass="rounded-full"
          containerClass="w-full"
          width="w-full"
        />
      </div>
    </Modal>
  );
};

export default ChangeCommissionModal;
