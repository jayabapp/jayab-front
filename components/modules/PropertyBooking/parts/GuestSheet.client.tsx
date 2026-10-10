"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useTranslations } from "next-intl";

import type { GuestSheetProps } from "@/types/components/modules/property-booking";

import GuestStepper from "./GuestStepper.client";

const GuestSheet = ({
  max,
  std,
  show,
  value,
  onHide,
  summary,
  onChange,
  onConfirm,
  extraGuestFee,
}: GuestSheetProps) => {
  const t = useTranslations();

  return (
    <ModalBottomSheet show={show} onHide={onHide} options={{ zIndex: 1100 }}>
      <ModalHeaderPart
        showX
        hideArrow
        onHide={onHide}
        title={t("reserve.guestCount")}
      />
      <div className="flex flex-col gap-4 p-4">
        {summary ? <p className="text-sm text-neutral-500">{summary}</p> : null}
        <GuestStepper
          max={max}
          std={std}
          value={value}
          onChange={onChange}
          extraGuestFee={extraGuestFee}
        />
        <button
          type="button"
          disabled={!value}
          onClick={onConfirm}
          className="h-11 w-full cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:hover:bg-neutral-300"
        >
          {t("common.confirmGuests")}
        </button>
      </div>
    </ModalBottomSheet>
  );
};

export default GuestSheet;
