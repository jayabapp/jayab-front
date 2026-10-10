"use client";

import { useCallback, useState } from "react";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { formatJalaliDay } from "@features/reservations/mappers/reservation-dates";
import { useTranslations } from "next-intl";
import { useBookingStay } from "@features/reservations/hooks/useBookingStay";
import { useFormatToman } from "@hooks/useFormatToman";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { Icon } from "@elements/Icon";

import type { BookingBottomBarProps } from "@/types/components/modules/property-booking";

import PropertyPriceTag from "@modules/PropertyDetails/PropertyPriceTag";
import Skeleton from "@elements/Skeleton/Skeleton";
import dynamic from "next/dynamic";

const StayDateSheet = dynamic(() => import("./parts/StayDateSheet.client"), {
  ssr: false,
});
const GuestSheet = dynamic(() => import("./parts/GuestSheet.client"), {
  ssr: false,
});
const BookingEditSheet = dynamic(() => import("./BookingEditSheet.client"), {
  ssr: false,
});

const PRIMARY_CLASS =
  "h-11 shrink-0 cursor-pointer rounded-10 bg-action px-5 text-base font-medium text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2";

const BookingBottomBar = ({
  property,
  renderActions,
}: BookingBottomBarProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

  const jalali = useJalaliFormat();

  const booking = useBookingStay(
    property.id,
    property.maxCapacity,
    property.stdCapacity,
  );
  const [datesOpen, setDatesOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { setStay, stay, guests, quote } = booking;
  const closeDates = useCallback(() => setDatesOpen(false), []);

  const onConfirmDates = useCallback(
    (range: { end: Date; start: Date }) => {
      trackListingEvent("booking_dates_selected", {
        nights: nightsBetween(range.start, range.end),
      });
      setStay(range);
      setDatesOpen(false);
      if (!guests) setGuestsOpen(true);
    },
    [guests, setStay],
  );

  const nights = stay ? nightsBetween(stay.start, stay.end) : 0;
  const rangeText = stay
    ? `${formatJalaliDay(stay.start, jalali)} ${t("common.to")} ${formatJalaliDay(stay.end, jalali)}`
    : "";

  const content = () => {
    if (booking.step === "PICK_DATES")
      return (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-xs text-ink-subtle">
              {t("reserve.stayStartsFrom")}
            </span>
            <div className="flex items-end gap-1">
              <PropertyPriceTag
                price={{ price: property.minimumPrice ?? undefined }}
              />
              <span className="pb-0.5 text-xs text-ink-muted">
                / {t("reserve.night")}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={PRIMARY_CLASS}
            onClick={() => setDatesOpen(true)}
          >
            {t("reserve.pickDatesCta")}
          </button>
        </div>
      );

    if (booking.step === "PICK_GUESTS")
      return (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-ink">
              {t("reserve.nights", { count: Number(nights) })}: {rangeText}
            </span>
            <button
              type="button"
              onClick={() => setDatesOpen(true)}
              className="w-fit cursor-pointer text-xs text-link"
            >
              {t("reserve.changeDates")}
            </button>
          </div>
          <button
            type="button"
            className={PRIMARY_CLASS}
            onClick={() => setGuestsOpen(true)}
          >
            {t("reserve.guestCount")}
          </button>
        </div>
      );

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-xs text-ink-subtle">
              {t("reserve.approxStayCost")}
            </span>
            {quote ? (
              <span aria-live="polite" className="text-base font-bold text-ink">
                {formatToman(quote.stay_total)}
              </span>
            ) : (
              <Skeleton className="mt-1 h-5 w-32 rounded-md" />
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink-muted"
          >
            {t("reserve.editReservationDetails")}
            <Icon name="chevron-down" size={16} />
          </button>
        </div>

        {quote && !quote.is_available ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-status-danger">
              {t("reserve.stayDatesReserved")}
            </p>
            <button
              type="button"
              className={`${PRIMARY_CLASS} w-full`}
              onClick={() => setDatesOpen(true)}
            >
              {t("reserve.changeDates")}
            </button>
          </div>
        ) : quote && stay && guests ? (
          renderActions?.({
            endDate: stay.end,
            guests,
            nights: quote.nights,
            onEdit: () => setEditOpen(true),
            startDate: stay.start,
            total: quote.stay_total,
            variant: "bar",
          })
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-[11] border-t border-line bg-surface px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
        {content()}
      </div>

      <StayDateSheet
        show={datesOpen}
        onClose={closeDates}
        propertyId={property.id}
        onConfirm={onConfirmDates}
        reserved={booking.reserved}
        initial={{ end: stay?.end, start: stay?.start }}
      />
      <GuestSheet
        value={guests}
        show={guestsOpen}
        std={property.stdCapacity}
        max={property.maxCapacity}
        onChange={booking.setGuests}
        onHide={() => setGuestsOpen(false)}
        onConfirm={() => setGuestsOpen(false)}
        extraGuestFee={property.extraGuestFee}
        summary={
          stay
            ? `${t("reserve.nights", { count: Number(nights) })}: ${rangeText}`
            : undefined
        }
      />
      <BookingEditSheet
        show={editOpen}
        property={property}
        renderActions={renderActions}
        onHide={() => setEditOpen(false)}
      />
    </>
  );
};

export default BookingBottomBar;
