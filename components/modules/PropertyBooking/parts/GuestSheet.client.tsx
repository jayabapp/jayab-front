"use client";

import type { GuestSheetProps } from "@/types/components/modules/property-booking";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";

import GuestStepper from "./GuestStepper.client";
import _STRINGS from "@/utils/LocalStrings";

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
}: GuestSheetProps) => (
  <ModalBottomSheet show={show} onHide={onHide} options={{ zIndex: 1100 }}>
    <ModalHeaderPart hideArrow onHide={onHide} title={_STRINGS.GUEST_COUNT} />
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
        {_STRINGS.CONFIRM_GUESTS}
      </button>
    </div>
  </ModalBottomSheet>
);

export default GuestSheet;
