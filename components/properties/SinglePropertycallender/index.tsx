"use client";
import Callender from "@/components/widgets/DatePicker/callender";
import moment from "moment-jalaali";
import React, { useState } from "react";

const SinglePropertycallender = ({ data }: { data: any }) => {
  console.log(data, "properyDataproperyData");

  const [callenderselectedDate, setCallenderSelectedDate] = useState<string>(moment().format("jYYYY/jMM/jD"));
  const [callenderselectedSpan, setCallenderSelectedSpan] = useState<string>(moment().format("jYYYY/jMM/jD"));
  return (
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
  );
};

export default SinglePropertycallender;
