import { useTranslations } from "next-intl";
import { Counter } from "@elements/Form";

import type { HeroGuestsStepProps } from "@/types/components/modules/home-hero-search";

const MAX_GUESTS = 50;

const QUICK_COUNTS = [2, 4, 6, 8, 10];

const HeroGuestsStep = ({ onChange, value }: HeroGuestsStepProps) => {
  const t = useTranslations("common");

  return (
    <div className="flex w-full flex-col gap-4 px-4 py-4">
      <div className="flex flex-wrap gap-2">
        {QUICK_COUNTS.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => onChange(count)}
            aria-pressed={value === count}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              value === count
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-neutral-200 text-neutral-700"
            }`}
          >
            {t("people", { count: Number(count) })}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-10 bg-neutral-50 px-3 py-2.5">
        <p className="text-sm text-neutral-800">{t("pplCount")}</p>
        <div className="w-28">
          <Counter
            max={MAX_GUESTS}
            value={value ?? 0}
            plusMinusNumber={1}
            setValue={onChange}
            containerClass="!bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroGuestsStep;
