"use client";

import type { FilterApplyBarProps } from "@/types/components/modules/property-search-filters";
import { usePropertyFilterCount } from "@features/properties/hooks/usePropertyFilterCount";

import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

/**
 * The panel's submit control, labelled with the number of properties the staged
 * filters would return.
 *
 * This is the piece that makes a staged panel usable at all. Ticking a checkbox
 * used to change nothing on screen — no URL, no request, no count — so the user
 * had no way to tell whether their choice had registered, and no way to learn
 * that the combination they were building matches nothing until after they
 * committed to it and lost their place in the results.
 *
 * The count is deliberately *not* wired to the results grid: the list only
 * changes when the user submits. This is the Airbnb/Booking contract — answer
 * the question "how many?" immediately, change what they are reading only when
 * they ask.
 */
const FilterApplyBar = ({ draft, enabled = true, onApply }: FilterApplyBarProps) => {
  const { count, isStale } = usePropertyFilterCount(draft, enabled);

  const hasCount = typeof count === "number";
  const isEmptyResult = hasCount && count === 0;

  const label = !hasCount
    ? _STRINGS.DO_THE_FILTERING
    : isEmptyResult
      ? _STRINGS.NO_MATCHING_PROPERTY
      : `${_STRINGS.SHOW_RESULTS_PREFIX} ${numberWithCommas(count)} ${_STRINGS.PROPERTY_UNIT}`;

  return (
    <div className="w-full border-t border-neutral-100 bg-white px-3 pb-3 pt-2.5">
      <Button
        width="w-full"
        title={label}
        onClick={onApply}
        disabled={isEmptyResult}
        containerClass="w-full"
        // Dimming rather than swapping in a spinner: the label is a number the
        // user is reading, and replacing it with a loader on every tick would
        // make the panel flicker more than it informs.
        btnClass={`transition-opacity ${isStale ? "opacity-60" : ""}`}
      />
    </div>
  );
};

export default FilterApplyBar;
