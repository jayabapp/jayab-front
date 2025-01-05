"use client";

import React, { useState } from "react";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import MultiRangeSlider from "@/components/shared/Form/MultiRangeSlider";

function ConsultantModal() {
  const [sliderValues, setSliderValues] = useState<number[]>([1, 1, 1]);

  const handleSliderChange = (index: number, value: number) => {
    setSliderValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = value;
      return updatedValues;
    });
  };

  return (
    <div className="max-h-full h-screen md:h-full relative flex flex-col">
      <div className="max-h-full  h-full flex flex-col gap-6 p-8 sm:p-12 pb-10">
        {[
          "میزان رضایت شما از سرعت پیگیری و نحوه پاسخگویی مشاور",
          "میزان رضایت شما از مسئولیت پذیری و مشاوره صحیح مشاور در خصوص رزرو اقامتگاه",
          "میزان رضایت شما از برخورد مشاور و پیگیری مراحل تا تحویل اقامتگاه",
        ].map((label, index) => (
          <div key={index} className="w-full h-28 mb-3">
            <p
              className="leading-normal tracking-tighter text-sm md:text-base"
              style={{ wordSpacing: "-0.01em" }}
            >
              <span className="">{index + 1}.</span>
              <span>{label}</span>
            </p>
            <MultiRangeSlider
              value={sliderValues[index]}
              setValue={(value) => handleSliderChange(index, value)}
              max={3}
              min={0}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center fixed md:sticky bottom-0 left-0 right-0 mx-auto select-none z-[40] bg-white w-full h-16 px-6 !py-6 transition-all duration-300">
        <Button
          width="flex items-center justify-center w-full"
          containerClass="w-full"
          roundedClass="rounded-full"
          title={_STRINGS.RECORD_SCORE}
        />
      </div>
    </div>
  );
}

export default ConsultantModal;
