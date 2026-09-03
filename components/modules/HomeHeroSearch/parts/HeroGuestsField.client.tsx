"use client";

import type { HeroGuestsFieldProps } from "@/types/components/modules/home-hero-search";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Counter } from "@elements/Form";

import _STRINGS from "@/utils/LocalStrings";

const MAX_GUESTS = 50;

/**
 * Party size, edited in place.
 *
 * A popover rather than a modal: this is a single number, and taking over the
 * whole screen to increment it would cost more attention than the answer is
 * worth. Headless UI is already the app's menu primitive, so focus handling and
 * outside-click dismissal come from the same implementation as the sort menu
 * instead of a second hand-rolled one.
 */
const HeroGuestsField = ({ onChange, value }: HeroGuestsFieldProps) => (
  <Popover className="relative flex-1">
    <PopoverButton className="hero-field">
      <span className="hero-field-label">{_STRINGS.PPL_COUNT}</span>
      <span
        className={`hero-field-value ${
          value ? "font-medium text-neutral-900" : "text-neutral-400"
        }`}
      >
        {value ? `${value} ${_STRINGS.PERSON}` : _STRINGS.HERO_GUESTS_EMPTY}
      </span>
    </PopoverButton>

    <PopoverPanel
      anchor="bottom end"
      className="surface-panel z-30 mt-2 w-64 p-4 shadow-glass"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-800">{_STRINGS.PPL_COUNT}</p>
        <div className="w-28">
          <Counter
            value={value ?? 0}
            max={MAX_GUESTS}
            plusMinusNumber={1}
            setValue={onChange}
          />
        </div>
      </div>
    </PopoverPanel>
  </Popover>
);

export default HeroGuestsField;
