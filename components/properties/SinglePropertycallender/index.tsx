"use client";

import { usePropertyCalendar } from "@features/properties/hooks/usePropertyCalendar";
import { useStoreInit } from "@/store";
import { useState } from "react";

import OwnerCallemdarGuide from "../owner/SingleOwnerPropertycallender/OwnerCallemdarGuide";
import Callender from "@/components/widgets/DatePicker/callender";
import moment from "moment-jalaali";

const SinglePropertycallender = ({ data }: { data: any }) => {
  const { userInfo } = useStoreInit((data) => data);
  const [callenderselectedDate, setCallenderSelectedDate] = useState<string>(
    moment().format("jYYYY/jMM/jD"),
  );
  const [callenderselectedSpan, setCallenderSelectedSpan] = useState<string>(
    moment().format("jYYYY/jMM/jD"),
  );

  const { data: callendarData } = usePropertyCalendar(data?.id, {
    month: Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jMM")),
    year: Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jYYYY")),
  });
  return (
    <div className=" order-3  flex flex-col gap-4 md:order-4 ">
      {" "}
      <Callender
        setChosenDateState={setCallenderSelectedSpan}
        active_days={[]}
        callenderData={callendarData || []}
        setSelectedDay={(e) => {
          setCallenderSelectedDate(e);
        }}
        selectedDate={callenderselectedDate}
        disablePrevMonths
        options={{ disableDaySelect: true }}
      />
      <OwnerCallemdarGuide
        isAdvisor={!!userInfo?.advisor_id}
        isCustomer={!!userInfo?.advisor_id ? false : true}
      />
    </div>
  );
};

export default SinglePropertycallender;
