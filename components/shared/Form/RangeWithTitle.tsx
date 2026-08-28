import { colors } from "@/theme/colors";
import Slider from "rc-slider";
import React, { CSSProperties, useEffect } from "react";
import "rc-slider/assets/index.css";

const RangeWithTitle = ({
  value,
  setValue,
  max,
  min,
  marks,
  className,
  step,
  item = { pathColor: colors.neutral[200], visibleDot: false },
  showMark,
}: {
  max: number;
  showMark?: boolean;
  min: number;
  value: number;
  marks?: { [key: string]: { label: number | string; style: CSSProperties } };
  setValue: (e: number) => void | null;
  className?: string;
  step?: number;
  item?: { pathColor?: string; visibleDot?: boolean; reverse?: boolean };
}) => {
  return (
    <Slider
      reverse={item?.reverse}
      marks={showMark ? marks : {}}
      startPoint={min || 0}
      max={max}
      value={value}
      min={min}
      step={step || 1}
      onChange={(v: number | number[]) => {
        if (typeof v == "number") {
          setValue(v);
        }
      }}
      defaultValue={0}
      className={className}
      handleStyle={{
        backgroundColor: colors.brand[500],
        borderWidth: 0,
        width: 20,
        height: 20,
        bottom: -4,
      }}
      activeDotStyle={{
        backgroundColor: item?.pathColor,
        borderColor: item?.pathColor,
        borderWidth: 1,
        width: 7,
        height: 7,
        aspectRatio: 2,
        bottom: -20,
      }}
      dotStyle={{
        backgroundColor: item?.pathColor,
        borderColor: item?.pathColor,
        borderWidth: 1,
        width: 7,
        height: 7,
        aspectRatio: 2,
        bottom: -20,
        visibility: item?.visibleDot ? "visible" : "hidden",
      }}
      trackStyle={{ backgroundColor: colors.brand[500], height: 6.5 }}
      railStyle={{ backgroundColor: item?.pathColor, height: 6.5 }}
    />
  );
};

export default RangeWithTitle;
