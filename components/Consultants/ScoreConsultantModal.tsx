"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import _STRINGS from "@/utils/LocalStrings";
import PageHeaders from "@/components/headers/PageHeader";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";

import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import CircularProgress from "@/components/shared/CircularProgress/CircularProgress";
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
        <div className="max-h-full relative flex flex-col-reverse">
            <footer className="hidden lg:flex sticky bottom-0 z-50 shadow-md w-full transition-all h-16 px-8 items-center justify-between py-4 pb-8">
                <Button
                    width="w-full flex items-center justify-center"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.RECORD_SCORE}
                />
            </footer>

            <main className="max-h-full flex flex-col gap-6 overflow-y-scroll p-8 sm:p-12">
                {[
                    "میزان رضایت شما از سرعت پیگیری و نحوه پاسخگویی مشاور",
                    "میزان رضایت شما از مسئولیت پذیری و مشاوره صحیح مشاور در خصوص رزرو اقامتگاه",
                    "میزان رضایت شما از برخورد مشاور و پیگیری مراحل تا تحویل اقامتگاه",
                ].map((label, index) => (
                    <article key={index} className="w-full h-28 mb-3">
                        <p
                            className="leading-normal tracking-tighter"
                            style={{ wordSpacing: "-0.01em" }}
                        >
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

            <div className="lg:hidden">
                <FixedBottomContainer>
                    <div className="w-full px-2">
                        <Button
                            width="flex items-center justify-center w-full"
                            containerClass="w-full"
                            roundedClass="rounded-full"
                            title={_STRINGS.RECORD_SCORE}
                        />
                    </div>
                </FixedBottomContainer>
            </div>
        </div>
    );
}

export default ConsultantModal;
