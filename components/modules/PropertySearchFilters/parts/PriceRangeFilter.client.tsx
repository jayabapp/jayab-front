"use client";

import { colors } from "@/theme/colors";

import type { PriceRangeFilterProps } from "@/types/components/modules/property-search-filters";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";

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
        railStyle={{ backgroundColor: "rgb(var(--c-line-strong))", height: 4 }}
        trackStyle={{ backgroundColor: "rgb(var(--c-action))", height: 4 }}
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
          backgroundColor: "rgb(var(--c-line-strong))",
          borderColor: "rgb(var(--c-line-strong))",
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
