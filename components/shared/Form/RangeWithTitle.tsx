import Slider from "rc-slider";
import React, { useEffect } from "react";
import "rc-slider/assets/index.css";

const marks = {
  // 0: " ",
  0: " ",

  90: " ",
  180: " ",
  270: " ",
  360: " ",
};
const RangeWithTitle = ({
  value,
  setValue,
  max,
  min,
}: {
  max: number;
  min: number;
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <Slider
      startPoint={1}
      marks={marks}
      max={max}
      value={value}
      min={min}
      step={1}
      onChange={(v: number | number[]) => {
        if (typeof v == "number") {
          setValue(v);
        }
      }}
      defaultValue={1}
      className="!w-1/2 "
      handleStyle={{
        backgroundColor: "#0096C7",
        borderWidth: 0,
        width: 20,
        height: 20,
        bottom: -4,
      }}
      activeDotStyle={{
        backgroundColor: "#E7E7E7",
        borderColor: "#E7E7E7",
        borderWidth: 1,
        width: 7,
        height: 7,
        aspectRatio: 2,
        bottom: -20,
      }}
      dotStyle={{
        backgroundColor: "#E7E7E7",
        borderColor: "#E7E7E7",
        borderWidth: 1,
        width: 7,
        height: 7,
        aspectRatio: 2,
        bottom: -20,
      }}
      trackStyle={{ backgroundColor: "#0096C7", height: 6.5 }}
      railStyle={{ backgroundColor: "#E7E7E7", height: 6.5 }}
    />
  );
};

export default RangeWithTitle;
