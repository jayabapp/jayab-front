"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import type { OwnerDaySelectionProps } from "@/types/components/modules/owner-property";

import OwnerDayPriceModal from "./OwnerDayPriceModal.client";
import Button from "@elements/Button";

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
        title={t("changePrice")}
        roundedClass="rounded-full"
        onClick={() => setShow(true)}
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
