"use client";

import type { HeroGuestsFieldProps } from "@/types/components/modules/home-hero-search";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Counter } from "@elements/Form";

import _STRINGS from "@/utils/LocalStrings";

const MAX_GUESTS = 50;

const HeroGuestsField = ({ onChange, value }: HeroGuestsFieldProps) => (
  <Popover className="relative flex-1">
    <PopoverButton className="hero-field">
      <span className="hero-field-label">{_STRINGS.PPL_COUNT}</span>
      {value ? (
        <span className="hero-field-value font-medium text-neutral-900">
          {`${value} ${_STRINGS.PERSON}`}
        </span>
      ) : null}
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
