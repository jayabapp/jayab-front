"use client";

import { useOwnerCalendarActions } from "@features/owner-property/hooks/useOwnerCalendarActions";
import type { OwnerSingleDayModalProps } from "@/types/components/modules/owner-property";
import { MultiLineFormInput } from "@elements/Form";
import { Divider } from "@elements/Divider";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const OwnerDayNoteModal = ({
  day,
  show,
  onHide,
  property,
}: OwnerSingleDayModalProps) => {
  const {
    note: { mutate, isPending },
  } = useOwnerCalendarActions(property?.id ?? "");

  const seedKey = `${day?.year ?? ""}/${day?.month ?? ""}/${day?.day ?? ""}`;
  const [draft, setDraft] = useState({ key: "", value: "" });
  let current = draft;
  if (current.key !== seedKey)
    current = { key: seedKey, value: day?.note || "" };
  if (current !== draft) setDraft(current);

  const onSubmit = () => {
    if (isPending) return;
    mutate(
      {
        day: Number(day?.day),
        month: Number(day?.month),
        note: current.value,
        property_id: property?.id,
        year: Number(day?.year),
      },
      { onSuccess: onHide },
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-20">
        <p className="text-sm font-bold text-brand-600">
          {_STRINGS.EDIT} {_STRINGS.MEMO}
        </p>

        <MultiLineFormInput
          value={current.value}
          item={{ containerClass: "w-full", rows: 3, title: _STRINGS.MEMO }}
          onChangeText={(value) =>
            setDraft((previous) => ({ ...previous, value }))
          }
        />

        <Divider moreClass="w-full " />
        <Button
          width="w-full"
          onClick={onSubmit}
          loading={isPending}
          disabled={isPending}
          containerClass="w-full"
          roundedClass="rounded-full"
          title={_STRINGS.RECORD_CHANGES}
        />
      </div>
    </Modal>
  );
};

export default OwnerDayNoteModal;
