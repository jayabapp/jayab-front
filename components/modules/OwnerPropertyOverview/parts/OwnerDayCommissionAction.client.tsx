"use client";

import type { OwnerSingleDayActionProps } from "@/types/components/modules/owner-property";
import { useState } from "react";

import OwnerDayCommissionModal from "./OwnerDayCommissionModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

const OwnerDayCommissionAction = ({
  day,
  property,
  isDisabled,
}: OwnerSingleDayActionProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <Button
        disabled={!day}
        containerClass="w-full"
        title={_STRINGS.COMMISSION}
        roundedClass="rounded-full"
        width="w-full !text-base !px-0 md:!px-auto md:!text-base !py-1.5"
        onClick={() => {
          if (isDisabled) {
            Notify({ body: _STRINGS.SELECT_ONE_DAY_ONLY, type: "warn" });
            return;
          }
          setShow(true);
        }}
      />
      <OwnerDayCommissionModal
        day={day}
        show={show}
        property={property}
        onHide={() => setShow(false)}
      />
    </div>
  );
};

export default OwnerDayCommissionAction;
