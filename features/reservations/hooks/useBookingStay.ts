"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { reservedKeysFromDates, toDayKey } from "../lib/stay-range";
import { useStaySearchParams } from "./useStaySearchParams";
import { useReservedDates } from "@features/properties/hooks/useReservedDates";
import { usePropertyQuote } from "@features/properties/hooks/usePropertyQuote";

const GUEST_WRITE_DELAY_MS = 300;
const DRAFT_HANDOFF_MS = 80;

export const useBookingStay = (propertyId: number, maxCapacity: number) => {
  const params = useStaySearchParams(maxCapacity);
  const { data: reservedDates } = useReservedDates(propertyId);
  const reserved = useMemo(
    () => reservedKeysFromDates(reservedDates),
    [reservedDates],
  );

  const [draftGuests, setDraftGuests] = useState<{
    value: number | null;
  } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const { setGuests: writeGuests } = params;
  const setGuests = useCallback(
    (value: number | null) => {
      setDraftGuests({ value });
      timers.current.forEach(clearTimeout);
      const write = setTimeout(() => {
        writeGuests(value);
        timers.current.push(
          setTimeout(() => setDraftGuests(null), DRAFT_HANDOFF_MS),
        );
      }, GUEST_WRITE_DELAY_MS);
      timers.current = [write];
    },
    [writeGuests],
  );

  const quote = usePropertyQuote(propertyId, {
    checkIn: params.stay ? toDayKey(params.stay.start) : null,
    checkOut: params.stay ? toDayKey(params.stay.end) : null,
    guests: params.guestCount,
  });

  const nights = quote.data?.nights ?? 0;

  return {
    ...params,
    guests: draftGuests ? draftGuests.value : params.guestCount,
    hasQuoteError: quote.isError,
    isAvailable: quote.data ? quote.data.is_available : null,
    nights,
    quote: quote.data,
    quoteIsFetching: quote.isFetching,
    quoteIsPending: !!params.stay && !!params.guestCount && quote.isPending,
    reserved,
    setGuests,
  };
};
