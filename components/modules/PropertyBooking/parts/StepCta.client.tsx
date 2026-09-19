"use client";

import type { StepCtaProps } from "@/types/components/modules/property-booking";

import _STRINGS from "@/utils/LocalStrings";

const StepCta = ({ canClear, onClear, onPrimary, step }: StepCtaProps) => (
  <div className="flex flex-col gap-2">
    <button
      type="button"
      onClick={onPrimary}
      className="h-11 w-full cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      {step === "PICK_DATES"
        ? _STRINGS.PICK_DATES_CTA
        : _STRINGS.PICK_GUESTS_CTA}
    </button>
    <button
      type="button"
      onClick={onClear}
      disabled={!canClear}
      className="w-fit cursor-pointer self-center text-sm text-neutral-500 transition-colors hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-neutral-500"
    >
      {_STRINGS.CLEAR_STAY}
    </button>
  </div>
);

export default StepCta;
