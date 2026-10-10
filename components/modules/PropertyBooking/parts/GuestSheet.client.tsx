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
        {summary ? <p className="text-sm text-ink-subtle">{summary}</p> : null}
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
          className="h-11 w-full cursor-pointer rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-line-strong disabled:hover:bg-line-strong"
        >
          {t("common.confirmGuests")}
        </button>
      </div>
    </ModalBottomSheet>
  );
};

export default GuestSheet;
