"use client";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Callender from "@/components/widgets/DatePicker/callender";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";

const SinglePropertycallender = ({ data }: { data: any }) => {
  /* -------------------------------------------------------------------------- */
  /*                             SELECTED DATE STATE                            */
  /* -------------------------------------------------------------------------- */
  const [callenderselectedDate, setCallenderSelectedDate] = useState<string>(moment().format("jYYYY/jMM/jD"));
  /* -------------------------------------------------------------------------- */
  /*                             SELECTED TIME SPAN                             */
  /* -------------------------------------------------------------------------- */
  const [callenderselectedSpan, setCallenderSelectedSpan] = useState<string>(moment().format("jYYYY/jMM/jD"));

  /* -------------------------------------------------------------------------- */
  /*                       INCOMING SELECTED TIMESPAN DATA                      */
  /* -------------------------------------------------------------------------- */
  const [callendarDataState, setCallendarDataState] = useState<OwnerCallendarItemDto[]>([]);

  /* -------------------------------------------------------------------------- */
  /*                            TIME SPAN DATA FETCH                            */
  /* -------------------------------------------------------------------------- */

  const { data: callendarData, isLoading } = useQuery({
    queryKey: [
      PropertyService.GET_SINGLEPROPERTY_CALLENDER_CACHEKEY,
      Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jMM")),
      Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jYYYY")),
      ,
      data?.id,
    ],
    queryFn: () => {
      if (!!data?.id && !!callenderselectedSpan) {
        return PropertyService.GetSingleUserPropertyCallendar({
          property_id: `${data?.id}`,
          month: Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jMM")),
          year: Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jYYYY")),
        });
      } else return null;
    },
  });

  useEffect(() => {
    if (!!callendarData) {
      setCallendarDataState(callendarData);
    }
  }, [callendarData]);

  /* -------------------------------------------------------------------------- */
  /*                       FINDING THE SELECTED DATE DATA                       */
  /* -------------------------------------------------------------------------- */

  const selectedDateData = callendarDataState?.find((e) => {
    return (
      `${e?.day}` == moment(callenderselectedDate, "jYYYY/jMM/jD").format("jD") &&
      `${e?.month}` == moment(callenderselectedDate, "jYYYY/jMM/jD").format("jMM") &&
      `${e?.year}` == moment(callenderselectedDate, "jYYYY/jMM/jD").format("jYYYY")
    );
  });

  return (
    <div className=" order-3 md:order-3 ">
      {" "}
      <Callender
        setChosenDateState={setCallenderSelectedSpan}
        active_days={[]}
        callenderData={callendarDataState || []}
        setSelectedDay={(e) => {
          setCallenderSelectedDate(e);
        }}
        selectedDate={callenderselectedDate}
      />
    </div>
  );
};

export default SinglePropertycallender;
