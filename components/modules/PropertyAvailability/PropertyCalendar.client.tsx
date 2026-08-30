"use client";

import type { PropertyCalendarProps } from "@/types/components/modules/property-availability";
import { usePropertyCalendar } from "@features/properties/hooks/usePropertyCalendar";
import { useStoreInit } from "@/store";
import { useState } from "react";

import Callender from "@/components/widgets/DatePicker/callender";
import PropertyCalendarLegend from "./PropertyCalendarLegend";
import moment from "moment-jalaali";

const JALALI_DAY = "jYYYY/jMM/jD";

const PropertyCalendar = ({ propertyId }: PropertyCalendarProps) => {
  const { userInfo } = useStoreInit((state) => state);
  const [selectedDate, setSelectedDate] = useState(() =>
    moment().format(JALALI_DAY),
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    moment().format(JALALI_DAY),
  );

  const { data: calendarData } = usePropertyCalendar(propertyId ?? "", {
    month: Number(moment(visibleMonth, JALALI_DAY).format("jMM")),
    year: Number(moment(visibleMonth, JALALI_DAY).format("jYYYY")),
  });

  const isAdvisor = !!userInfo?.advisor_id;

  return (
    <div className="order-3 flex flex-col gap-4 md:order-4">
      <Callender
        disablePrevMonths
        active_days={[]}
        selectedDate={selectedDate}
        setSelectedDay={setSelectedDate}
        callenderData={calendarData || []}
        setChosenDateState={setVisibleMonth}
        options={{ disableDaySelect: true }}
      />
      <PropertyCalendarLegend isAdvisor={isAdvisor} isCustomer={!isAdvisor} />
    </div>
  );
};

export default PropertyCalendar;
