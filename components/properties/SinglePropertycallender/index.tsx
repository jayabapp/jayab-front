"use client";
import Callender from "@/components/widgets/DatePicker/callender";
import moment from "moment-jalaali";
import React, { useState } from "react";

const SinglePropertycallender = ({ data }: { data: any }) => {
  const [callenderselectedDate, setCallenderSelectedDate] = useState<string>(moment().format("jYYYY/jMM/jD"));
  const [callenderselectedSpan, setCallenderSelectedSpan] = useState<string>(moment().format("jYYYY/jMM/jD"));
  return (
    <div className=" order-3 md:order-4 ">
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
  );
};

export default SinglePropertycallender;
