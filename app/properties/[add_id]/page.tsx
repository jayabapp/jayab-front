"use client";
import ProductImagesContainer from "@/components/Adds/imageComponents/PropertiesImagesPart";
import SinglePropertyIntroduction from "@/components/Adds/SinglePropertyIntroduction";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import Callender from "@/components/widgets/DatePicker/callender";
import { fakeVilla } from "@/utils/faker";
import moment from "moment-jalaali";
import React, { useState } from "react";

const SinglePropertyPage = () => {
  const data = fakeVilla;
  const [callenderselectedDate, setCallenderSelectedDate] = useState<string>(moment().format("jYYYY/jMM/jD"));
  const [callenderselectedSpan, setCallenderSelectedSpan] = useState<string>(moment().format("jYYYY/jMM/jD"));
  return (
    <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-2  !h-auto   !overflow-x-visible">
      <ProductImagesContainer productImageId={null} data={data} />
      <SinglePropertyIntroduction data={data} />
      <div className="w-full flex flex-col">
        <SimpleAccordion
          item={{
            parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
            noBorder: true,
            titleClass: "font-bold",
          }}
          title="اطلاعات اصلی ملک"
        >
          a ssssssssssssssssssf
        </SimpleAccordion>
      </div>{" "}
      <div>
        {" "}
        <Callender
          setChosenDateState={setCallenderSelectedSpan}
          active_days={[]}
          callenderData={[]}
          setSelectedDay={(e) => {
            setCallenderSelectedDate(e);

            // setShowDayModal(true);
          }}
          selectedDate={callenderselectedDate}
        />
      </div>
    </div>
  );
};

export default SinglePropertyPage;
