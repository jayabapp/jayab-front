"use client";

/* eslint-disable react-hooks/set-state-in-effect -- Modal open/default-date transitions initialize a bounded month window. */

import type { TReservationDateProps } from "@/types/components/modules/reservation-date-picker";
import { useCallback, useEffect, useState } from "react";
import { ContentImage } from "@elements/Image";
import { BtnLoading } from "@elements/Button";

import ReservationCalendar from "./ReservationCalendar.client";
import InfiniteScroll from "react-infinite-scroll-component";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Modal from "@elements/Modal";
import moment from "moment-jalaali";

const ReservationDateModal = ({
  onConfirm,
  show,
  onHide,
  startDate = moment().toDate(),
  defaultSpanDates,
  forbiden_dates,
}: TReservationDateProps) => {
  const [months, setMonths] = useState<Date[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [dateSpan, setDateSpan] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  useEffect(() => {
    if (defaultSpanDates?.start || defaultSpanDates?.end) {
      setDateSpan({
        end: defaultSpanDates?.end || null,
        start: defaultSpanDates?.start || null,
      });
    } else {
      setDateSpan({ end: null, start: null });
    }
  }, [defaultSpanDates]);

  const initializeMonths = useCallback(() => {
    const initialMonths: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const monthDate = moment(startDate)
        .startOf("jMonth")
        .add(i, "jMonth")
        .toDate();
      initialMonths.push(monthDate);
    }
    setMonths(initialMonths);
    setIsInitialized(true);
  }, [startDate]);

  const loadMoreMonths = useCallback(() => {
    if (months.length === 0) return;
    const lastDate = moment(months[months.length - 1]);
    const newMonths: Date[] = [];

    for (let i = 1; i <= 3; i++) {
      const nextMonth = lastDate
        .clone()
        .startOf("jMonth")
        .add(i, "jMonth")
        .toDate();
      newMonths.push(nextMonth);
    }
    setMonths((prev) => [...prev, ...newMonths]);
    if (months.length + 3 >= 12) setHasMore(false);
  }, [months]);

  useEffect(() => {
    if (!isInitialized) initializeMonths();
  }, [isInitialized, initializeMonths]);

  useEffect(() => {
    if (show && !isInitialized) initializeMonths();
  }, [show, isInitialized, initializeMonths]);
  return (
    <Modal
      zIndex={40000000}
      options={{
        containerClass:
          "mx-auto my-0 md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4  rounded-0 md:rounded-2xl overflow-y-hidden  bg-white     relative min-h-[90dvh]  min:min-h-[80dvh] ",
      }}
      onHide={onHide}
      show={!!show}
    >
      <ContentImage
        alt=""
        width={24}
        height={24}
        onClick={onHide}
        src="/assets/icons/adds/x_mark.svg"
        className="absolute top-4 right-4  z-20 cursor-pointer text-neutral-500 hover:text-neutral-600"
      />

      <div
        id="modal-content"
        className="max-h-[90vh] mb-16  pt-8 md:pt-0 !rounded-lg  !overflow-scroll "
      >
        <InfiniteScroll
          hasMore={hasMore}
          scrollThreshold={0.1}
          dataLength={months.length}
          next={loadMoreMonths}
          loader={
            <div className="w-full py-6 flex items-center justify-center">
              <BtnLoading />
            </div>
          }
          endMessage={<p className="text-center py-4 text-neutral-500"></p>}
          scrollableTarget="modal-content"
          className="w-full flex pb-16 h-full flex-col gap-0 "
        >
          {months.map((monthDate, index) => (
            <div
              key={`month-${monthDate.getTime()}`}
              className="relative flex flex-col gap-0"
            >
              <ReservationCalendar
                disableMonthChange
                dateSpan={dateSpan}
                setDateSpan={setDateSpan}
                forbiden_dates={forbiden_dates}
                options={{ maxSpanLength: 15 }}
                startDate={moment(monthDate).format("jYYYY/jMM/jDD")}
              />
              {index == 0 ? (
                <div className="flex lg:absolute right-12 bottom-2  px-4 md:px-0 text-neutral-500 text-sm items-center gap-2 ">
                  <div className="w-5 h-5 striped !bg-neutral-100   rounded-md"></div>
                  <p className=" text-xs md:text-sm">
                    {_STRINGS.RESERVED_DAYS}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>

      {!!onConfirm ? (
        <Button
          onClick={() => onConfirm(dateSpan)}
          disabled={!dateSpan?.start || !dateSpan?.end}
          width="w-full"
          containerClass=" absolute z-50 bottom-4 mx-auto w-[calc(100%-2rem)] left-4 right-4 "
          title={
            !!dateSpan?.end ? _STRINGS.SELECT_DATE_SPAN : _STRINGS.SELECT_DATE
          }
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default ReservationDateModal;
