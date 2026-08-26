"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useOwnerCalendarActions } from "@features/owner-property/hooks/useOwnerCalendarActions";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useEffect, useState } from "react";
import { Divider } from "@/components/shared/Divider";
import { produce } from "immer";

import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/Modal";

type TChangeCommissionModalProps = {
  show: boolean;
  onHide: () => void | null;
  selectedDateData?: OwnerCallendarItemDto;
  setCallendarDataState: React.Dispatch<
    React.SetStateAction<OwnerCallendarItemDto[]>
  >;
  data: SingleOwnerPropertyDto;
};

const ChangeCommissionModal = ({
  show,
  data,
  onHide,
  selectedDateData,
  setCallendarDataState,
}: TChangeCommissionModalProps) => {
  const [note, setNote] = useState("");

  const {
    note: { mutate, isPending },
  } = useOwnerCalendarActions(data?.id ?? "");
  const submitNote = (variables: Parameters<typeof mutate>[0]) =>
    mutate(variables, {
      onSuccess: () => {
        setCallendarDataState((e) => {
          const next = produce(e, (draft) => {
            const index = e.findIndex(
              (i) =>
                i.month == selectedDateData?.month &&
                i.day === selectedDateData?.day,
            );
            const x = { ...draft[index], note: note };
            draft[index] = x;
          });

          return next;
        });
        onHide();
      },
    });

  useEffect(() => {
    if (!!selectedDateData) setNote(selectedDateData?.note || "");
    return () => {
      setNote("");
    };
  }, [selectedDateData]);

  const onSubmit = () => {
    submitNote({
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

        <MultiLineFormInput
          value={note}
          item={{ containerClass: "w-full", rows: 3, title: _STRINGS.MEMO }}
          onChangeText={(e) => setNote(e)}
        />

        <Divider moreClass="w-full " />
        <Button
          width="w-full"
          onClick={onSubmit}
          loading={isPending}
          containerClass="w-full"
          roundedClass="rounded-full"
          title={_STRINGS.RECORD_CHANGES}
        />
      </div>
    </Modal>
  );
};

export default ChangeCommissionModal;
