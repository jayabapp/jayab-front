"use client";

import type { OwnerSingleDayActionProps } from "@/types/components/modules/owner-property";
import { useState } from "react";

import OwnerDayNoteModal from "./OwnerDayNoteModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

const OwnerDayNoteAction = ({
  day,
  property,
  isDisabled,
}: OwnerSingleDayActionProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <Button
        disabled={!day}
        title={_STRINGS.MEMO}
        containerClass="w-full"
        width="w-full !py-1.5"
        roundedClass="rounded-full"
        onClick={() => {
          if (isDisabled) {
            Notify({ body: _STRINGS.SELECT_ONE_DAY_ONLY, type: "warn" });
            return;
          }
          setShow(true);
        }}
      />
      <OwnerDayNoteModal
        day={day}
        show={show}
        property={property}
        onHide={() => setShow(false)}
      />
    </div>
  );
};

export default OwnerDayNoteAction;
