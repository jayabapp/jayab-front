"use client";

import React, { useState } from "react";
import Link from "next/link";

import Button from "@/components/shared/Button/Button";
import PageFooter from "@/components/Footer/PageFooter";
import PageHeaders from "@/components/headers/PageHeader";
import MultiRangeSlider from "@/components/shared/Form/MultiRangeSlider";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";

import _STRINGS from "@/utils/LocalStrings";

const Page: React.FC = () => {
    const [sliderValues, setSliderValues] = useState<number[]>([1, 1, 1]);

    const handleSliderChange = (index: number, value: number) => {
        setSliderValues((prevValues) => {
            const updatedValues = [...prevValues];
            updatedValues[index] = value;
            return updatedValues;
        });
    };

    return (
        <div className="container items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 ">
            <PageHeaders title={_STRINGS.RECORD_CONSULTANT_SCORE} />
            <main className="flex flex-col gap-6 text-sm sm:text-base px-6">
                {[
                    "میزان رضایت شما از سرعت پیگیری و نحوه پاسخگویی مشاور",
                    "میزان رضایت شما از مسئولیت پذیری و مشاوره صحیح مشاور در خصوص رزرو اقامتگاه",
                    "میزان رضایت شما از برخورد مشاور و پیگیری مراحل تا تحویل اقامتگاه",
                ].map((label, index) => (
                    <article key={index} className="w-full h-28 mb-3">
                        <p className="leading-normal tracking-tighter" style={{wordSpacing:"-0.01em"}}>
                            <span className="">{index + 1}.</span>
                            <span>{label}</span>
                        </p>
                        <MultiRangeSlider
                            value={sliderValues[index]}
                            setValue={(value) =>
                                handleSliderChange(index, value)
                            }
                            max={3}
                            min={0}
                        />
                    </article>
                ))}
            </main>
            <FixedBottomContainer>
                <Button
                    width="flex items-center justify-center w-full"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.RECORD_SCORE}
                />
            </FixedBottomContainer>
        </div>
    );
};

export default Page;
