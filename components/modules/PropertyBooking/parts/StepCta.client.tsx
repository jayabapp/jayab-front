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
        className="h-12 w-full cursor-pointer rounded-10 bg-action text-base font-semibold text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        {step === "PICK_DATES" ? t("pickDatesCta") : t("pickGuestsCta")}
      </button>
      {canClear ? (
        <button
          type="button"
          onClick={onClear}
          className="w-fit cursor-pointer self-center py-1 text-sm text-ink-subtle transition-colors hover:text-ink"
        >
          {t("clearStay")}
        </button>
      ) : null}
    </div>
  );
};

export default StepCta;
