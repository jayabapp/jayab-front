import Modal from "@/components/Modal";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import DatePicker from "./index";
// const InfiniteScroll = dynamic(() => import("react-infinite-scroll-component"), { ssr: false });
const DateSpanPickerModal = ({
  onConfirm,
  show,
  onHide,
  startDate = moment().toDate(),
  defaultSpanDates,
  forbiden_dates,
}: {
  onConfirm: (e: any) => void | null;
  show: boolean;
  onHide: () => void | null;
  startDate?: Date;
  defaultSpanDates?: { start?: Date; end?: Date };
  forbiden_dates?: Date[];
}) => {
  const [months, setMonths] = React.useState<Date[]>([]);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false);
  const [dateSpan, setDateSpan] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  /* -------------------------------------------------------------------------- */
  /*                       FILLING DATA WITH DEFAULT DATA                       */
  /* -------------------------------------------------------------------------- */

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

  // Initialize with first three months
  const initializeMonths = React.useCallback(() => {
    const initialMonths: Date[] = [];
    for (let i = 0; i < 3; i++) {
      const monthDate = moment(startDate).startOf("jMonth").add(i, "jMonth").toDate();
      initialMonths.push(monthDate);
    }

    setMonths(initialMonths);
    setIsInitialized(true);
  }, [startDate]);

  // Function to load next three months
  const loadMoreMonths = React.useCallback(() => {
    if (months.length === 0) return;

    const lastDate = moment(months[months.length - 1]);
    const newMonths: Date[] = [];

    // Add next three months
    for (let i = 1; i <= 3; i++) {
      const nextMonth = lastDate.clone().startOf("jMonth").add(i, "jMonth").toDate();
      newMonths.push(nextMonth);
    }

    setMonths((prev) => [...prev, ...newMonths]);

    // Optional: Limit to 2 years (24 months)
    if (months.length + 3 >= 12) {
      setHasMore(false);
    }
  }, [months]);

  // Initialize on component mount
  React.useEffect(() => {
    if (!isInitialized) {
      initializeMonths();
    }
  }, [isInitialized, initializeMonths]);

  // Reset when modal closes/reopens
  React.useEffect(() => {
    if (show && !isInitialized) {
      initializeMonths();
    }
  }, [show, isInitialized, initializeMonths]);
  return (
    <Modal
      zIndex={40000000}
      options={{
        containerClass:
          "mx-auto my-0 md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4  rounded-0 md:rounded-2xl overflow-y-hidden  bg-white   dark:bg-zinc-900  relative min-h-[90dvh]  min:min-h-[80dvh] ",
      }}
      onHide={onHide}
      show={!!show}
    >
      <img
        src="/assets/icons/adds/x_mark.svg"
        className="absolute top-4 right-4  z-20 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={onHide}
      />

      <div id="modal-content" className="max-h-[90vh] mb-16  pt-8 md:pt-0 !rounded-lg  !overflow-scroll ">
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
          endMessage={<p className="text-center py-4 text-gray-500">{/* Optional end message */}</p>}
          scrollableTarget="modal-content"
          className="w-full flex pb-16 h-full flex-col gap-0 "
        >
          {months.map((monthDate, index) => (
            <div key={`month-${monthDate.getTime()}`} className="relative flex flex-col gap-0">
              <DatePicker
                options={{ maxSpanLength: 15 }}
                // options={{ maxSpanLength: 6 }}
                dateSpan={dateSpan}
                setDateSpan={setDateSpan}
                disableMonthChange
                // Pass the month date to DatePicker
                startDate={moment(monthDate).format("jYYYY/jMM/jDD")}
                // You might need to pass other props like:
                // selectedDates={dateSpan}
                // onDateSelect={handleDateSelect}
                forbiden_dates={forbiden_dates}
              />
              {index == 0 ? (
                <div className="flex lg:absolute right-12 bottom-2  px-4 md:px-0 text-primary-800 text-sm items-center gap-2 ">
                  <div className="w-5 h-5 striped !bg-gray-100   rounded-md"></div>
                  <p className=" text-xs md:text-sm">{_STRINGS.RESERVED_DAYS}</p>
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
          title={!!dateSpan?.end ? _STRINGS.SELECT_DATE_SPAN : _STRINGS.SELECT_DATE}
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};

export default DateSpanPickerModal;
