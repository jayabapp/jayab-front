"use client";

import type { MultiRangeSliderProps } from "@/types/components/elements/form-legacy";
import { colors } from "@/theme/colors";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";
import React from "react";

const MultiRangeSlider = ({
  value,
  setValue,
  max,
  min,
}: MultiRangeSliderProps) => {
  return (
    <div
      className="slider-container pt-14 relative text-xl font-semibold text-brand-600"
      style={{ direction: "rtl" }}
    >
      <Slider
        reverse
        startPoint={min}
        max={max}
        value={value}
        min={min}
        step={1}
        onChange={(v: number | number[]) => {
          if (typeof v === "number") {
            setValue(v);
          }
        }}
        defaultValue={1}
        className="slider"
        handleStyle={{
          backgroundColor: colors.brand[600],
          borderWidth: 0,
          width: 20,
          height: 20,
          bottom: -4,
          boxShadow: "0 1px 3px 1px rgb(11 21 36 / 15%)",
        }}
        activeDotStyle={{
          backgroundColor: colors.neutral[200],
          borderColor: colors.neutral[200],
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        dotStyle={{
          backgroundColor: colors.neutral[200],
          borderColor: colors.neutral[200],
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        trackStyle={{ backgroundColor: colors.brand[600], height: 6.5 }}
        railStyle={{ backgroundColor: colors.neutral[200], height: 6.5 }}
      />
    </div>
  );
};

export default MultiRangeSlider;
