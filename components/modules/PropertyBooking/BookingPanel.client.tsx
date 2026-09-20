"use client";

import { useCallback, useState } from "react";
import { usePrefetchStayMonths } from "@features/reservations/hooks/usePrefetchStayMonths";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { formatJalaliDay } from "@features/reservations/mappers/reservation-dates";
import { useBookingStay } from "@features/reservations/hooks/useBookingStay";
import { nightsBetween } from "@features/reservations/lib/stay-range";

import type { BookingPanelProps } from "@/types/components/modules/property-booking";

import PropertyPriceTag from "@modules/PropertyDetails/PropertyPriceTag";
import StayDateFields from "./parts/StayDateFields.client";
import GuestStepper from "./parts/GuestStepper.client";
import PriceDetails from "./parts/PriceDetails.client";
import PriceSummary from "./parts/PriceSummary";
import formatToman from "@/helpers/formatToman";
import Skeleton from "@elements/Skeleton/Skeleton";
import _STRINGS from "@/utils/LocalStrings";
import StepCta from "./parts/StepCta.client";
import dynamic from "next/dynamic";

const StayDatePanel = dynamic(() => import("./parts/StayDatePanel.client"), {
  ssr: false,
});
const StayDateSheet = dynamic(() => import("./parts/StayDateSheet.client"), {
  ssr: false,
});

const BookingPanel = ({
  property,
  renderActions,
  variant,
}: BookingPanelProps) => {
  const booking = useBookingStay(
    property.id,
    property.maxCapacity,
    property.stdCapacity,
  );
  const [datesOpen, setDatesOpen] = useState(false);
  const stepperId = `guest-stepper-${variant}`;
  const isCard = variant === "card";

  const { clearStay, setStay, stay } = booking;
  const closeDates = useCallback(() => setDatesOpen(false), []);

  const prefetchMonths = usePrefetchStayMonths(property.id);

  const onConfirmDates = useCallback(
    (range: { end: Date; start: Date }) => {
      trackListingEvent("booking_dates_selected", {
        nights: nightsBetween(range.start, range.end),
      });
      setStay(range);
      setDatesOpen(false);
      requestAnimationFrame(() => document.getElementById(stepperId)?.focus());
    },
    [setStay, stepperId],
  );

  const openDates = () => setDatesOpen(true);
  const { quote } = booking;

  const header = () => {
    if (booking.step !== "READY")
      return (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-neutral-500">
            {_STRINGS.STAY_STARTS_FROM}
          </p>
          <div className="flex flex-wrap items-end gap-1.5">
            <PropertyPriceTag price={property.todayPrice} />
            <span className="pb-0.5 text-xs text-neutral-600">
              / {_STRINGS.NIGHT}
            </span>
          </div>
        </div>
      );

    const nights = quote
      ? quote.nights
      : stay
        ? nightsBetween(stay.start, stay.end)
        : 0;
    return (
      <div className="flex items-baseline gap-2 text-lg font-bold text-neutral-900">
        <span>
          {nights} {_STRINGS.NIGHT}
        </span>
        {quote ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{formatToman(quote.total)}</span>
          </>
        ) : null}
      </div>
    );
  };

  const readyBody = () => {
    if (booking.hasQuoteError && !quote)
      return (
        <p className="text-sm text-danger-500">{_STRINGS.QUOTE_UNAVAILABLE}</p>
      );

    if (!quote)
      return (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-6 w-2/3 rounded-md" />
        </div>
      );

    if (!quote.is_available)
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-danger-500">
            {_STRINGS.STAY_DATES_RESERVED}:{" "}
            {quote.unavailable_dates
              .map((date) => formatJalaliDay(date))
              .join("، ")}
          </p>
          <button
            type="button"
            onClick={openDates}
            className="h-11 w-full cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700"
          >
            {_STRINGS.CHANGE_DATES}
          </button>
        </div>
      );

    return (
      <div className="flex flex-col gap-4">
        <PriceSummary quote={quote} isRefreshing={booking.quoteIsFetching} />
        <PriceDetails quote={quote} />
        {stay && booking.guests
          ? renderActions?.({
              endDate: stay.end,
              guests: booking.guests,
              nights: quote.nights,
              onEdit: openDates,
              startDate: stay.start,
              total: quote.total,
              variant,
            })
          : null}
      </div>
    );
  };

  return (
    <div className={isCard ? "relative" : ""}>
      <div
        className={
          isCard
            ? "surface-panel flex w-full flex-col gap-4 p-5"
            : "flex w-full flex-col gap-4 p-4"
        }
      >
        {header()}

        <div
          className="flex flex-col gap-2"
          onMouseEnter={prefetchMonths}
          onFocusCapture={prefetchMonths}
        >
          <StayDateFields
            end={stay?.end}
            onOpen={openDates}
            start={stay?.start}
            expanded={datesOpen}
          />
          <GuestStepper
            id={stepperId}
            value={booking.guests}
            max={property.maxCapacity}
            std={property.stdCapacity}
            onChange={booking.setGuests}
            extraGuestFee={property.extraGuestFee}
          />
        </div>

        {booking.step === "READY" ? (
          readyBody()
        ) : (
          <StepCta
            step={booking.step}
            canClear={!!stay || !!booking.guests}
            onClear={clearStay}
            onPrimary={() =>
              booking.step === "PICK_DATES"
                ? openDates()
                : document.getElementById(stepperId)?.focus()
            }
          />
        )}
      </div>

      {isCard && datesOpen ? (
        <StayDatePanel
          onClose={closeDates}
          propertyId={property.id}
          onConfirm={onConfirmDates}
          reserved={booking.reserved}
          initial={{ end: stay?.end, start: stay?.start }}
        />
      ) : null}
      {!isCard ? (
        <StayDateSheet
          show={datesOpen}
          onClose={closeDates}
          propertyId={property.id}
          onConfirm={onConfirmDates}
          reserved={booking.reserved}
          initial={{ end: stay?.end, start: stay?.start }}
        />
      ) : null}
    </div>
  );
};

export default BookingPanel;
