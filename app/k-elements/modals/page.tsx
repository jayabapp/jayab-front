"use client";
import React, { useState } from "react";
import Modal from "@/components/Modal";
import SimpleModal from "@/components/Modal/SimpleModal";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { color } from "framer-motion";

const Page = () => {
  // Use a single state to control which modal to show
  const [showModal, setShowModal] = useState<string | null>(null); // Store modal ID or null if no modal is shown
  const [sliderPriceValue, setSliderPriceValue] = useState<number>(1); // Use a single value for the slider
  const [sliderCommissionValue, setSliderCommissionValue] = useState<number>(1); // Use a single value for the slider
  const [sliderTodayCommissionValue, setSliderTodayCommissionValue] =
    useState<number>(1); // Use a single value for the slider

  // Handle the change in slider value
  const handleSliderPriceChange = (value: number) => {
    setSliderPriceValue(value);
  };

  const handleSliderTodayCommissionValue = (value: number) => {
    setSliderTodayCommissionValue(value);
  };

  const handleSliderCommissionChange = (value: number) => {
    setSliderCommissionValue(value);
  };

  // Function to toggle a modal based on its ID
  const toggleModal = (modalId: string) => {
    setShowModal(showModal === modalId ? null : modalId); // Toggle visibility of the modal
  };

  return (
    <>
      {/* Modal 1 */}
      <div className="flex flex-col gap-6">
        <button onClick={() => toggleModal("modal1")}>Show Modal 1</button>
        <button onClick={() => toggleModal("modal4")}>Show Modal 4</button>
        <button onClick={() => toggleModal("modal5")}>Show Modal 5</button>
      </div>

      <Modal
        show={showModal === "modal1"} // Only show Modal 1 if its ID is active
        onHide={() => setShowModal(null)} // Hide modal when closed
        type="bottom-sheet"
      >
        <SimpleModal
          image="/assets/icons/modal-icon-1.svg"
          subtitle="دریافت نشان ممتاز"
          onClick={() => setShowModal(null)} // Close Modal
        >
          <div className="px-6">
            <p>
              لورم ایپسوم دولور سیمی‌ت، ایزی اومنیس ودی ایرودت. نسسیت اتم‌دور
              تریور، فولوتوت ان سیفلکس، ویدور آت. کیا دسیمپ، ییستیداتی پسولاتی!
              اپتور لوکوس ویگورن اوپریتستات واریتر، کولیسیا بلانکیتور. توسیتان
              ریتلات که دیسپوسل ایترسیتی اش. سلیم رتیو لورکاتور، هر پورو پتو.
            </p>
          </div>
          <div className="sticky bottom-0 p-4">
            <Button
              width="w-full flex items-center justify-center"
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.SUBMIT_REQUEST}
            />
          </div>
        </SimpleModal>
      </Modal>

      <Modal
        show={showModal === "modal4"} // Only show Modal 3 if its ID is active
        onHide={() => setShowModal(null)} // Hide modal when closed
        type="bottom-sheet"
      >
        <SimpleModal
          image="/assets/icons/modal-icon-3.svg"
          subtitle={_STRINGS.IMMEDIATE_CHANGE}
          onClick={() => setShowModal(null)} // Close Modal
        >
          <div className="px-6">
            <p>
              لورم ایپسوم دولور سیمی‌ت، ایزی اومنیس ودی ایرودت. نسسیت اتم‌دور
              تریور، فولوتوت ان سیفلکس، ویدور آت. کیا دسیمپ، ییستیداتی پسولاتی!
              اپتور لوکوس ویگورن اوپریتستات واریتر، کولیسیا بلانکیتور. توسیتان
              ریتلات که دیسپوسل ایترسیتی اش. سلیم رتیو لورکاتور، هر پورو پتو.
            </p>
            <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
              <div className="flex items-center justify-between">
                <span>قیمت 14/2/1400</span>
                <span>{sliderPriceValue}</span>
              </div>
              <RangeWithTitle
                value={sliderPriceValue}
                setValue={handleSliderPriceChange}
                max={4000000}
                min={0}
                step={100000}
                marks={{
                  0: {
                    label: "0",
                    style: {
                      color: "#888",
                      paddingTop: 15,
                    },
                  },
                  4000000: {
                    label: "400000",
                    style: {
                      color: "#888",
                      paddingTop: 15,
                      paddingRight: 20,
                    },
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
              <div className="flex items-center justify-between">
                <span>درصد کمیسیون مشاور (فقط برای امروز)</span>
                <span>{sliderTodayCommissionValue}%</span>
              </div>
              <RangeWithTitle
                value={sliderTodayCommissionValue}
                setValue={(e) => handleSliderTodayCommissionValue(e)}
                max={50}
                min={0}
                marks={{
                  0: {
                    label: "0",
                    style: {
                      color: "#888",
                      paddingTop: 15,
                    },
                  },
                  50: {
                    label: "50",
                    style: {
                      color: "#888",
                      paddingTop: 15,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="sticky bottom-0 p-4">
            <Button
              width="w-full flex items-center justify-center"
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.RECORD_CHANGES}
            />
          </div>
        </SimpleModal>
      </Modal>

      <Modal
        show={showModal === "modal5"} // Only show Modal 3 if its ID is active
        onHide={() => setShowModal(null)} // Hide modal when closed
        type="bottom-sheet"
      >
        <SimpleModal
          image="/assets/icons/modal-icon-3.svg"
          subtitle="تغییر کمیسیون مشاور"
          onClick={() => setShowModal(null)} // Close Modal
        >
          <div className="px-6">
            <p>
              لورم ایپسوم دولور سیمی‌ت، ایزی اومنیس ودی ایرودت. نسسیت اتم‌دور
              تریور، فولوتوت ان سیفلکس، ویدور آت. کیا دسیمپ، ییستیداتی پسولاتی!
              اپتور لوکوس ویگورن اوپریتستات واریتر، کولیسیا بلانکیتور. توسیتان
              ریتلات که دیسپوسل ایترسیتی اش. سلیم رتیو لورکاتور، هر پورو پتو.
            </p>
            <div className="flex flex-col gap-3 text-primary-700 pt-6 pb-10">
              <div className="flex items-center justify-between">
                <span>درصد کمیسیون مشاور</span>
                <span>{sliderCommissionValue}%</span>
              </div>
              <RangeWithTitle
                value={sliderCommissionValue}
                setValue={handleSliderCommissionChange}
                max={50}
                min={0}
                marks={{
                  0: {
                    label: "0",
                    style: {
                      color: "#888",
                      paddingTop: 15,
                    },
                  },
                  50: {
                    label: "50",
                    style: {
                      color: "#888",
                      paddingTop: 15,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="sticky bottom-0 p-4">
            <Button
              width="w-full flex items-center justify-center"
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.RECORD_CHANGES}
            />
          </div>
        </SimpleModal>
      </Modal>
    </>
  );
};

export default Page;
