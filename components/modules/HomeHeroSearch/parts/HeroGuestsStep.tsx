import type { HeroGuestsStepProps } from "@/types/components/modules/home-hero-search";
import { Counter } from "@elements/Form";

import _STRINGS from "@/utils/LocalStrings";

const MAX_GUESTS = 50;

/**
 * Party size in the mobile sheet.
 *
 * The chips come first and the stepper second, because the answer is almost
 * always one of a handful of numbers and tapping "+" four times to say "four
 * people" is four chances to overshoot on a moving bus. The stepper stays for
 * the group that does not fit the chips.
 */
const QUICK_COUNTS = [2, 4, 6, 8, 10];

const HeroGuestsStep = ({ onChange, value }: HeroGuestsStepProps) => (
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
          {count} {_STRINGS.PERSON}
        </button>
      ))}
    </div>

    <div className="flex items-center justify-between gap-4 rounded-10 bg-neutral-50 px-3 py-2.5">
      <p className="text-sm text-neutral-800">{_STRINGS.PPL_COUNT}</p>
      <div className="w-28">
        <Counter
          max={MAX_GUESTS}
          plusMinusNumber={1}
          setValue={onChange}
          value={value ?? 0}
          containerClass="!bg-transparent"
        />
      </div>
    </div>
  </div>
);

export default HeroGuestsStep;
