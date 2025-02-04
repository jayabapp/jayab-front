"use client";
import { OwnerCallendarItemDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import Callender from "@/components/widgets/DatePicker/callender";
import { useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import OwnerCallemdarGuide from "./OwnerCallemdarGuide";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import ChangeDayStatusComp from "./ChangeDayStatusComp";
import ChangePriceComp from "./ChangePriceComp";
import ChangeCunsultatCommission from "./ChangeCunsultatCommission";
import ChangeCallendarNote from "./ChangeCallendarNote";

const SingleOwnerPropertycallender = ({
  data,
  setRefresh,
}: {
  data: SingleOwnerPropertyDto;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  /* -------------------------------------------------------------------------- */
  /*                             SELECTED DATE STATE                            */
  /* -------------------------------------------------------------------------- */
  const [callenderselectedDate, setCallenderSelectedDate] = useState<string>("");
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
      PropertyService.OWNER_PROPERTIES_CACHEKEY,
      Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jMM")),
      Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jYYYY")),
      ,
      data?.id,
    ],
    queryFn: () => {
      if (!!data?.id && !!callenderselectedSpan) {
        return PropertyService.GetSingleOwnerPropertyCallendar({
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
    <div className=" order-3 md:order-4 flex flex-col gap-4 ">
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
      <OwnerCallemdarGuide />
      <p className="text-xs">{_STRINGS.SELECT_DAY_TO_GO_ON}</p>
      <div className="w-full grid gap-2 grid-cols-2">
        <ChangeDayStatusComp
          setRefresh={setRefresh}
          selectedDateData={selectedDateData}
          setCallendarDataState={setCallendarDataState}
          data={data}
          callenderselectedDate={callenderselectedDate}
        />
        <ChangePriceComp
          setRefresh={setRefresh}
          selectedDateData={selectedDateData}
          setCallendarDataState={setCallendarDataState}
          data={data}
          callenderselectedDate={callenderselectedDate}
        />
        <ChangeCunsultatCommission
          selectedDateData={selectedDateData}
          setCallendarDataState={setCallendarDataState}
          data={data}
          callenderselectedDate={callenderselectedDate}
        />
        <ChangeCallendarNote
          selectedDateData={selectedDateData}
          setCallendarDataState={setCallendarDataState}
          data={data}
          callenderselectedDate={callenderselectedDate}
        />
      </div>
    </div>
  );
};

export default SingleOwnerPropertycallender;
