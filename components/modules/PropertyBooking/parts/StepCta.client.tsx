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
        className="h-11 w-full cursor-pointer rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        {step === "PICK_DATES" ? t("pickDatesCta") : t("pickGuestsCta")}
      </button>
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="w-fit cursor-pointer self-center text-sm text-ink-subtle transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-subtle"
      >
        {t("clearStay")}
      </button>
    </div>
  );
};

export default StepCta;
