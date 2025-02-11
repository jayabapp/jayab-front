import Modal from "@/components/Modal";
import FilterDatePicker from "@/components/widgets/FilterDatePicker";
import DateStateHelperStringfy from "@/components/widgets/FilterDatePicker/DateStateHelperStringfy";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import React, { useState } from "react";

const DateFilter = ({
  filters,
  setFilters,
}: {
  filters: {
    checkin: string | null | undefined;
    checkout: string | null | undefined;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      checkin: string | null | undefined;
      checkout: string | null | undefined;
    }>
  >;
}) => {
  const [show, setShow] = useState(false);

  const onHideCallendar = () => {
    setShow(false);
  };
  const onShowCallendar = () => {
    setShow(true);
  };
  const onRemove = () => {
    setFilters((e) => ({ ...e, checkin: undefined, checkout: undefined }));
  };

  return (
    <>
      <div
        onClick={onShowCallendar}
        className="w-full   border-b   items-center justify-between pb-3   pt-1.5 cursor-pointer mt-4 flex flex-row"
      >
        {!!filters?.checkin && !!filters?.checkout ? (
          <p className="  text-sm">
            از <span className="text-primary-700">{moment(filters?.checkin).format("jD  jMMMM")}</span> تا{" "}
            <span className="text-primary-700"> {moment(filters?.checkout).format("jD  jMMMM")}</span>
          </p>
        ) : (
          <p className="font-medium">انتخاب تاریخ بر حسب روز های خالی </p>
        )}

        {!!filters?.checkin && !!filters?.checkout ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onRemove();
            }}
            className=" cursor-pointer flex opacity-50 items-center gap-1"
          >
            <p className="text-xs">{_STRINGS.ERASE}</p>
            <img src="/assets/icons/uploader/TrashIcon.svg" />
          </div>
        ) : (
          <img
            src="/assets/icons/shared/chevron.svg"
            className=" object-contain transition-all   w-4 aspect-square  "
          />
        )}
      </div>
      <Modal onHide={onHideCallendar} show={show}>
        <FilterDatePicker
          setSelectedDay={(e) => {
            DateStateHelperStringfy({ date: e, setState: setFilters, state: filters, cb: onHideCallendar });
          }}
          selectedDates={{
            endDate: filters?.checkout ? moment(filters?.checkout).format("jYYYY/jMM/jD") : null,
            startDate: filters?.checkin ? moment(filters?.checkin).format("jYYYY/jMM/jD") : null,
          }}
        />
      </Modal>
    </>
  );
};

export default DateFilter;
