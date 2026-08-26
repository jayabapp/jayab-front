"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { OwnerCallendarItemDto } from "@/api_services/property/property.interface";
import { useOwnerCalendar } from "@features/owner-property/hooks/useOwnerCalendar";

import ChangeCunsultatCommission from "./ChangeCunsultatCommission";
import ChangeDayStatusComp from "./ChangeDayStatusComp";
import OwnerCallemdarGuide from "./OwnerCallemdarGuide";
import ChangeCallendarNote from "./ChangeCallendarNote";
import ChangePriceComp from "./ChangePriceComp";
import Callender from "@/components/widgets/DatePicker/callender";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import Button from "@/components/shared/Button/Button";

const MAX_SELECTABLE_DAYS = 62;

const SingleOwnerPropertycallender = ({
  data,
  setRefresh,
}: {
  data: SingleOwnerPropertyDto;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [callenderselectedDates, setCallenderSelectedDates] = useState<
    string[]
  >([]);
  const [callenderselectedSpan, setCallenderSelectedSpan] = useState<string>(
    moment().format("jYYYY/jMM/jD"),
  );

  const [callendarDataState, setCallendarDataState] = useState<
    OwnerCallendarItemDto[]
  >([]);

  const calendarMonth = Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jMM"));
  const calendarYear = Number(moment(callenderselectedSpan, "jYYYY/jMM/jD").format("jYYYY"));
  const { data: callendarData } = useOwnerCalendar(data?.id ?? "", calendarYear, calendarMonth);

  useEffect(() => {
    if (!!callendarData) {
      setCallendarDataState(callendarData);
    }
  }, [callendarData]);

  useEffect(() => {
    if (window.location.hash !== "#owner-calendar") return;
    const animationFrame = window.requestAnimationFrame(() => {
      document
        .getElementById("owner-calendar")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const selectedDatesData = useMemo(() => {
    return callenderselectedDates
      .map((selectedDate) =>
        callendarDataState?.find((e) => {
          return (
            `${e?.day}` == moment(selectedDate, "jYYYY/jMM/jD").format("jD") &&
            `${e?.month}` ==
              moment(selectedDate, "jYYYY/jMM/jD").format("jM") &&
            `${e?.year}` == moment(selectedDate, "jYYYY/jMM/jD").format("jYYYY")
          );
        }),
      )
      .filter((e): e is OwnerCallendarItemDto => !!e);
  }, [callenderselectedDates, callendarDataState]);

  const selectedDateData = selectedDatesData[selectedDatesData.length - 1];

  const onToggleDay = (date: string) => {
    setCallenderSelectedDates((prev) => {
      if (prev.includes(date)) return prev.filter((e) => e !== date);
      if (prev.length >= MAX_SELECTABLE_DAYS) return prev;
      return [...prev, date];
    });
  };

  const clearSelectedDays = () => setCallenderSelectedDates([]);

  return (
    <div
      id="owner-calendar"
      className="order-3 scroll-mt-24 md:order-4 flex flex-col gap-4"
    >
      {" "}
      <Callender
        multiSelect
        active_days={[]}
        onToggleDay={onToggleDay}
        selectedDays={callenderselectedDates}
        callenderData={callendarDataState || []}
        setChosenDateState={setCallenderSelectedSpan}
        selectedDate={
          callenderselectedDates[callenderselectedDates.length - 1] || ""
        }
      />
      <OwnerCallemdarGuide />
      <div className="w-full flex items-center justify-between gap-2">
        <p className="text-xs">{_STRINGS.SELECT_DAYS_TO_GO_ON}</p>
        {callenderselectedDates.length > 0 ? (
          <Button
            variant="outline"
            width="!py-1 !px-3"
            onClick={clearSelectedDays}
            roundedClass="rounded-full"
            title={`${_STRINGS.CLEAR_SELECTION} (${callenderselectedDates.length})`}
          />
        ) : (
          <></>
        )}
      </div>
      <div className="w-full grid gap-2 grid-cols-2">
        <ChangeDayStatusComp
          data={data}
          setRefresh={setRefresh}
          selectedDatesData={selectedDatesData}
          setCallendarDataState={setCallendarDataState}
          callenderselectedDates={callenderselectedDates}
        />
        <ChangePriceComp
          data={data}
          setRefresh={setRefresh}
          selectedDatesData={selectedDatesData}
          setCallendarDataState={setCallendarDataState}
          callenderselectedDates={callenderselectedDates}
        />
        <ChangeCunsultatCommission
          data={data}
          selectedDateData={selectedDateData}
          setCallendarDataState={setCallendarDataState}
          isDisabled={callenderselectedDates.length > 1}
          callenderselectedDate={
            callenderselectedDates[callenderselectedDates.length - 1] || ""
          }
        />
        <ChangeCallendarNote
          data={data}
          selectedDateData={selectedDateData}
          setCallendarDataState={setCallendarDataState}
          isDisabled={callenderselectedDates.length > 1}
          callenderselectedDate={
            callenderselectedDates[callenderselectedDates.length - 1] || ""
          }
        />
      </div>
    </div>
  );
};

export default SingleOwnerPropertycallender;
