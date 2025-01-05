import Slider from "rc-slider";
import React from "react";
import "rc-slider/assets/index.css";

// Define marks with positions and labels
const marks = {
  0: { label: "ضعیف", style: { marginTop: "-55px", marginRight: "10px", color: "##3886E5" } },
  1: { label: "متوسط", style: { marginTop: "-55px", marginLeft: "15px", color: "#3886E5" } },
  2: { label: "خوب", style: { marginTop: "-55px", marginLeft: "15px", color: "#3886E5" } },
  3: { label: "عالی", style: { marginTop: "-55px", marginLeft: "15px", color: "#3886E5" } },
};

const MultiRangeSlider = ({
  value,
  setValue,
  max,
  min,
}: {
  max: number;
  min: number;
  value: number;
  setValue: (e: number) => void | null;
}) => {
  return (
    <div className="slider-container pt-14 relative text-xl font-semibold text-[#3886E5]" style={{ direction: "rtl" }}>
      <Slider
        reverse
        startPoint={min}
        marks={marks}
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
          backgroundColor: "#0096C7",
          borderWidth: 0,
          width: 20,
          height: 20,
          bottom: -4,
          boxShadow: "0px 1px 3px 1px #00000026"
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
    </div>
  );
};

export default MultiRangeSlider;
