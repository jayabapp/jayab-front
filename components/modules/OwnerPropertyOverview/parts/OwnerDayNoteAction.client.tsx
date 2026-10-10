"use client";

import type { OwnerSingleDayActionProps } from "@/types/components/modules/owner-property";
import { useState } from "react";

import OwnerDayNoteModal from "./OwnerDayNoteModal.client";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import { useTranslations } from "next-intl";

const OwnerDayNoteAction = ({
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
        title={t("memo")}
        containerClass="w-full"
        width="w-full !py-1.5"
        roundedClass="rounded-full"
        onClick={() => {
          if (isDisabled) {
            Notify({ body: t("selectOneDayOnly"), type: "warn" });
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
