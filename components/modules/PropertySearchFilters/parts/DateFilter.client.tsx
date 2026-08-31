"use client";

import type { DateFilterProps } from "@/types/components/modules/property-search-filters";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import SearchDateRangePicker from "./DateRangePicker/SearchDateRangePicker.client";
import updateDateRange from "./DateRangePicker/updateDateRange";
import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";
import moment from "moment-jalaali";

const DAY_MONTH_FORMAT = "jD  jMMMM";

const DateFilter = ({ filters, setFilters }: DateFilterProps) => {
  const [show, setShow] = useState(false);
  const hasRange = !!filters?.checkin && !!filters?.checkout;

  const onHide = () => setShow(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShow(true)}
        className="w-full border-b items-center justify-between pb-3 pt-1.5 cursor-pointer mt-4 flex flex-row"
      >
        {hasRange ? (
          <span className="text-sm">
            {_STRINGS.FROM}{" "}
            <span className="text-brand-600">
              {moment(filters?.checkin).format(DAY_MONTH_FORMAT)}
            </span>{" "}
            {_STRINGS.TO}{" "}
            <span className="text-brand-600">
              {moment(filters?.checkout).format(DAY_MONTH_FORMAT)}
            </span>
          </span>
        ) : (
          <span className="font-medium">{_STRINGS.PICK_EMPTY_DAYS}</span>
        )}

        {hasRange ? (
          <span
            role="button"
            tabIndex={0}
            className="cursor-pointer flex opacity-50 items-center gap-1"
            onKeyDown={(event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              event.stopPropagation();
              setFilters((current: any) => ({
                ...current,
                checkin: undefined,
                checkout: undefined,
              }));
            }}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              setFilters((current: any) => ({
                ...current,
                checkin: undefined,
                checkout: undefined,
              }));
            }}
          >
            <span className="text-xs">{_STRINGS.ERASE}</span>
            <ContentImage
              alt=""
              width={16}
              height={16}
              src="/assets/icons/uploader/TrashIcon.svg"
            />
          </span>
        ) : (
          <ContentImage
            alt=""
            width={16}
            height={16}
            src="/assets/icons/shared/chevron.svg"
            className="object-contain transition-all w-4 aspect-square"
          />
        )}
      </button>

      <Modal onHide={onHide} show={show}>
        <SearchDateRangePicker
          setSelectedDay={(day) => {
            updateDateRange({
              date: day,
              cb: onHide,
              state: filters,
              setState: setFilters,
            });
          }}
          selectedDates={{
            endDate: filters?.checkout
              ? moment(filters?.checkout).format("jYYYY/jMM/jD")
              : null,
            startDate: filters?.checkin
              ? moment(filters?.checkin).format("jYYYY/jMM/jD")
              : null,
          }}
        />
      </Modal>
    </>
  );
};

export default DateFilter;
