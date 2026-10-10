"use client";

import { useTranslations } from "next-intl";

import type { StepCtaProps } from "@/types/components/modules/property-booking";

const StepCta = ({ canClear, onClear, onPrimary, step }: StepCtaProps) => {
  const t = useTranslations("reserve");

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onPrimary}
        className="h-11 w-full cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {step === "PICK_DATES" ? t("pickDatesCta") : t("pickGuestsCta")}
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="w-fit cursor-pointer self-center text-sm text-neutral-500 transition-colors hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-neutral-500"
      >
        {t("clearStay")}
      </button>
    </div>
  );
};

export default StepCta;
