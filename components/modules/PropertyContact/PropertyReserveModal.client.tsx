"use client";

import { useReservationAvailability } from "@features/reservations/hooks/useReservationAvailability";
import type { PropertyReserveModalProps } from "@/types/components/modules/property-contact";
import { SingleSelectPopUpSelect as SinglePopUpSelect } from "@elements/Form";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useState } from "react";

import DateSpanPicker from "@/components/widgets/UpdatedDatePicker/DateSpanPicker";
import ReserveRequestModal from "./parts/ReserveRequestModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import moment from "moment-jalaali";

const RESERVE_SHEET_CLASS =
  "mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-4 bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(35svw)] bg-white overflow-y-scroll";

const PropertyReserveModal = ({
  show,
  setShow,
  property,
}: PropertyReserveModalProps) => {
  const [dates, setDates] = useState<{ start?: Date; end?: Date }>();
  const [count, setCount] = useState<number | string>("");
  const [showRequest, setShowRequest] = useState(false);

  const guestOptions = [
    ...Array.from({ length: property?.maxCapacity ?? 0 }, (_, index) => ({
      id: `${index + 1}`,
      title: `${index + 1}`,
    })),
    {
      id: `${property?.maxCapacity}+`,
      title: `${_STRINGS.MORE_THAN} ${property?.maxCapacity} ${_STRINGS.PERSON}`,
    },
  ];

  const checkIn = dates?.start ? moment(dates.start).format("YYYY-MM-DD") : "";
  const checkOut = dates?.end ? moment(dates.end).format("YYYY-MM-DD") : "";
  const { data: reservedDates, isFetching: isCheckingAvailability } =
    useReservationAvailability(
      property?.id,
      checkIn,
      checkOut,
      String(count),
      show,
    );

  const onContinue = () => {
    if (!dates?.start || !dates?.end) {
      Notify({ body: _STRINGS.PICK_CHECKIN_CHECKOUT, type: "warn" });
      return;
    }
    if (!count) {
      Notify({ body: _STRINGS.PICK_GUEST_COUNT, type: "warn" });
      return;
    }
    setShow(false);
    setShowRequest(true);
  };

  const onCloseRequest = () => {
    setShow(false);
    setShowRequest(false);
    setCount("");
    setDates({});
  };

  return (
    <>
      <ModalBottomSheet
        show={show}
        onHide={() => setShow(false)}
        options={{ containerClass: RESERVE_SHEET_CLASS }}
      >
        <ModalHeaderPart
          hideArrow
          title={_STRINGS.RESERVE}
          onHide={() => setShow(false)}
        />
        <div className="flex flex-col gap-4 p-4">
          <div className="w-full flex flex-col gap-2">
            <p>{_STRINGS.TRIP_DATE}</p>
            <div className="flex w-full items-center justify-between gap-4">
              <DateSpanPicker
                dates={dates}
                setDates={setDates}
                forbiden_dates={reservedDates || []}
              />
            </div>
            {isCheckingAvailability ? (
              <div className="h-1 w-full animate-pulse rounded bg-neutral-200" />
            ) : null}
          </div>

          <div className="w-full flex flex-col gap-2">
            <p>{_STRINGS.PPL_COUNT}</p>
            <SinglePopUpSelect
              closeOnSelect
              value={count}
              onSelect={setCount}
              item={{
                list: guestOptions,
                placeholder: _STRINGS.PICK_GUEST_COUNT,
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            {dates ? (
              count ? null : (
                <p className="text-xs">{_STRINGS.PICK_GUEST_COUNT}</p>
              )
            ) : (
              <p className="text-xs">{_STRINGS.PICK_TRIP_DATE}</p>
            )}

            <Button
              onClick={onContinue}
              roundedClass="rounded-full"
              disabled={!dates || !count}
              title={_STRINGS.ENTER_AND_MOVE_ON}
              width={`w-full ${dates && count ? "" : " text-white "}`}
              containerClass={`${dates && count ? "w-full" : "w-1/2"} items-center justify-center`}
            />
          </div>
        </div>
      </ModalBottomSheet>

      <ReserveRequestModal
        count={count}
        property={property}
        setShowEdit={setShow}
        onHide={onCloseRequest}
        show={showRequest && !show}
        endDate={moment(dates?.end).format("jYYYY/jMM/jDD")}
        startDate={moment(dates?.start).format("jYYYY/jMM/jDD")}
      />
    </>
  );
};

export default PropertyReserveModal;
