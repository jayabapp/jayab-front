"use client";

import type { PriceRangeFilterProps } from "@/types/components/modules/property-search-filters";
import { colors } from "@/theme/colors";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const DEFAULT_UPPER_BOUND = 100000000;
const DEFAULT_STEP = 100000;

const PriceRangeFilter = ({
  steps,
  filters,
  lowerKey,
  higherKey,
  setFilters,
  lowLimit = 0,
  upLimit = DEFAULT_UPPER_BOUND,
}: PriceRangeFilterProps) => {
  /**
   * Both bounds move together, or neither does.
   *
   * The previous version dropped whichever handle was still resting on its
   * limit, which is how the common case — "up to 5 million", one handle
   * dragged — became a request carrying a single bound. For price the backend
   * answers a lone `min_price` with a 500 (verified: `min_price=1` alone fails
   * deterministically, `min_price=1&max_price=999999999` returns the full
   * 3,324), so that shortening turned an ordinary drag into an error page.
   * Sending the pair also keeps the URL self-describing and gives the chip in
   * `SelectedFiltersBar` both numbers to render.
   */
  const onChange = (value: number | number[]) => {
    if (!Array.isArray(value) || !setFilters) return;
    const [lower, higher] = value;
    const isFullSpan = lower === lowLimit && higher === upLimit;

    setFilters((current: any) => ({
      ...current,
      [lowerKey]: isFullSpan ? undefined : lower,
      [higherKey]: isFullSpan ? undefined : higher,
    }));
  };

  return (
    <div className="mx-2">
      <Slider
        range
        reverse
        min={lowLimit}
        max={upLimit}
        onChange={onChange}
        step={steps || DEFAULT_STEP}
        defaultValue={[lowLimit, upLimit]}
        value={[
          filters?.[lowerKey] || lowLimit,
          filters?.[higherKey] || upLimit,
        ]}
        railStyle={{ backgroundColor: colors.neutral[300], height: 4 }}
        trackStyle={{ backgroundColor: colors.brand[600], height: 4 }}
        handleStyle={{
          backgroundColor: colors.brand[500],
          borderWidth: 0,
          width: 20,
          height: 20,
          bottom: -4,
        }}
        activeDotStyle={{
          backgroundColor: colors.brand[800],
          borderColor: colors.brand[800],
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        dotStyle={{
          backgroundColor: colors.neutral[300],
          borderColor: colors.neutral[300],
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
      />
    </div>
  );
};

export default PriceRangeFilter;
