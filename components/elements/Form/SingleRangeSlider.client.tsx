"use client";

import { useTranslations } from "next-intl";
import { useDir } from "@hooks/useDir";

import type { SingleRangeSliderProps } from "@/types/components/elements/form-legacy";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";

const SingleRangeSlider = ({
  max,
  min,
  value,
  setValue,
}: SingleRangeSliderProps) => {
  const t = useTranslations("common");
  const dir = useDir();

  return (
    <div
      className="slider-container pt-14 relative text-xl font-semibold text-link"
      style={{ direction: dir }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base text-link">{t("commissionPercent")}</span>
          <span>{value}</span>
        </div>
        <Slider
          step={1}
          max={max}
          min={min}
          value={value}
          startPoint={min}
          reverse={dir === "rtl"}
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
    </div>
  );
};

export default SingleRangeSlider;
