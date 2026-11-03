"use client";

import type { OwnerSingleDayActionProps } from "@/types/components/modules/owner-property";
import { useState } from "react";

import OwnerDayCommissionModal from "./OwnerDayCommissionModal.client";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import { useTranslations } from "next-intl";

const OwnerDayCommissionAction = ({
  day,
  property,
  isDisabled,
}: OwnerSingleDayActionProps) => {
  const t = useTranslations("owner");

  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      <Button
        disabled={!day}
        containerClass="w-full"
        title={t("commission")}
        roundedClass="rounded-full"
        width="w-full !text-base !px-0 md:!px-auto md:!text-base !py-1.5"
        onClick={() => {
          if (isDisabled) {
            Notify({ body: t("selectOneDayOnly"), type: "warn" });
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
