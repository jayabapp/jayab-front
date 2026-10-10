"use client";

import type { OwnerDaySelectionProps } from "@/types/components/modules/owner-property";
import { useState } from "react";

import OwnerDayPriceModal from "./OwnerDayPriceModal.client";
import Button from "@elements/Button";
import { useTranslations } from "next-intl";

const OwnerDayPriceAction = ({
  property,
  selectedDates,
  selectedDaysData,
}: OwnerDaySelectionProps) => {
  const t = useTranslations("owner");

  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <Button
        width="w-full !py-1.5"
        containerClass="w-full"
        roundedClass="rounded-full"
        onClick={() => setShow(true)}
        title={t("changePrice")}
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
