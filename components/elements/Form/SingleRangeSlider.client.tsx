"use client";

import type { SingleRangeSliderProps } from "@/types/components/elements/form-legacy";
import { colors } from "@/theme/colors";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

const SingleRangeSlider = ({
  max,
  min,
  value,
  setValue,
}: SingleRangeSliderProps) => {
  return (
    <div
      className="slider-container pt-14 relative text-xl font-semibold text-brand-600"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base text-brand-600">درصد کمیسیون مشاور</span>
          <span>{value}</span>
        </div>
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
            backgroundColor: colors.brand[600],
            borderWidth: 0,
            width: 20,
            height: 20,
            bottom: -4,
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
    </div>
  );
};

export default SingleRangeSlider;
