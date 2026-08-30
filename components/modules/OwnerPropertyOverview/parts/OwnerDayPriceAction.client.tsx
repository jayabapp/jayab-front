"use client";

import type { OwnerDaySelectionProps } from "@/types/components/modules/owner-property";
import { useState } from "react";

import OwnerDayPriceModal from "./OwnerDayPriceModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const OwnerDayPriceAction = ({
  property,
  selectedDates,
  selectedDaysData,
}: OwnerDaySelectionProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <Button
        width="w-full !py-1.5"
        containerClass="w-full"
        roundedClass="rounded-full"
        onClick={() => setShow(true)}
        title={_STRINGS.CHANGE_PRICE}
        disabled={selectedDates.length === 0}
      />
      <OwnerDayPriceModal
        show={show}
        property={property}
        onHide={() => setShow(false)}
        selectedDates={selectedDates}
        selectedDaysData={selectedDaysData}
      />
    </div>
  );
};

export default OwnerDayPriceAction;
