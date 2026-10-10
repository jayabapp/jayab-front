"use client";

import type { MultiRangeSliderProps } from "@/types/components/elements/form-legacy";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";

const MultiRangeSlider = ({
  max,
  min,
  value,
  setValue,
}: MultiRangeSliderProps) => {
  return (
    <div
    style={{ direction: "rtl" }}
      className="slider-container pt-14 relative text-xl font-semibold text-link"
    >
      <Slider
        reverse
        startPoint={min}
        max={max}
        value={value}
        min={min}
        step={1}
        onChange={(v: number | number[]) => {
          if (typeof v === "number") setValue(v);
        }}
        defaultValue={1}
        className="slider"
        handleStyle={{
          backgroundColor: "rgb(var(--c-action))",
          borderWidth: 0,
          width: 20,
          height: 20,
          bottom: -4,
          boxShadow: "0 1px 3px 1px rgb(11 21 36 / 15%)",
        }}
        activeDotStyle={{
          backgroundColor: "rgb(var(--c-line))",
          borderColor: "rgb(var(--c-line))",
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        dotStyle={{
          backgroundColor: "rgb(var(--c-line))",
          borderColor: "rgb(var(--c-line))",
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        trackStyle={{ backgroundColor: "rgb(var(--c-action))", height: 6.5 }}
        railStyle={{ backgroundColor: "rgb(var(--c-line))", height: 6.5 }}
      />
    </div>
  );
};

export default MultiRangeSlider;
