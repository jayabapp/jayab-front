"use client";

import { usePropertyQuote } from "@features/properties/hooks/usePropertyQuote";
import { useStaySearchParams } from "./useStaySearchParams";
import { toDayKey } from "../lib/stay-range";
import { useAuthStore } from "@/store";
import { useEffect, useRef } from "react";

import type { StayIntent } from "./useStaySearchParams";
import type { ContactTrip } from "../lib/contact-prefill";

export type ContactIntentStay = Pick<
  ContactTrip,
  "endDate" | "guests" | "startDate" | "total"
> & { nights?: number };

export const useContactIntent = (
  propertyId: number,
  maxCapacity: number,
  onIntent: (intent: StayIntent, stay: ContactIntentStay) => void,
) => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const { consumeIntent, guestCount, intent, stay } =
    useStaySearchParams(maxCapacity);
  const quote = usePropertyQuote(propertyId, {
    checkIn: stay ? toDayKey(stay.start) : null,
    checkOut: stay ? toDayKey(stay.end) : null,
    guests: guestCount,
  });
  const handled = useRef(false);
  const onIntentRef = useRef(onIntent);

  useEffect(() => {
    onIntentRef.current = onIntent;
  });

  useEffect(() => {
    if (!intent) {
      handled.current = false;
      return;
    }
    if (!isLogin || handled.current) return;

    if (!stay || !guestCount) {
      handled.current = true;
      consumeIntent();
      return;
    }
    if (quote.isPending && !quote.isError) return;

    handled.current = true;
    consumeIntent();
    if (quote.data && !quote.data.is_available) return;
    onIntentRef.current(intent, {
      endDate: stay.end,
      guests: guestCount,
      nights: quote.data?.nights,
      startDate: stay.start,
      total: quote.data?.total,
    });
  }, [
    consumeIntent,
    guestCount,
    intent,
    isLogin,
    quote.data,
    quote.isError,
    quote.isPending,
    stay,
  ]);
};
