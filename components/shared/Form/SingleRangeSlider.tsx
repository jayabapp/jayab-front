import Slider from "rc-slider";
import React from "react";
import "rc-slider/assets/index.css";

// Define types for dynamic marks
interface Mark {
  label: string;
  style: React.CSSProperties;
}

interface SingleRangeSliderProps {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  max: number;
  min: number;
  marks: { [key: number]: Mark }; // Accept dynamic marks as a prop
}

const SingleRangeSlider = ({
  value,
  setValue,
  max,
  min,
  marks, // Accept marks as a prop
}: SingleRangeSliderProps) => {
  return (
    <div className="slider-container pt-14 relative text-xl font-semibold text-[#3886E5]" style={{ direction: "rtl" }}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base text-primary-700">درصد کمیسیون مشاور</span>
          <span>{value}</span> {/* Display the dynamic value here */}
        </div>
        <Slider
          reverse
          startPoint={min}
          // marks={marks}
          max={max}
          value={value}
          min={min}
          step={1}
          onChange={(v: number | number[]) => {
            if (typeof v === "number") {
              setValue(v); // Update the value when slider changes
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
    </div>
  );
};

export default SingleRangeSlider;
