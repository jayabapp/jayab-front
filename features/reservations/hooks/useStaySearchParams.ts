"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { guestsFromQuery, stayFromQuery } from "../lib/stay-from-query";
import { useCallback, useMemo } from "react";

import moment from "moment-jalaali";

export type StayIntent = "call" | "sms" | "reserve" | "chat";
export type StayStep = "PICK_DATES" | "PICK_GUESTS" | "READY";
export type StayDraft = { end: Date; guests: number; start: Date };

const INTENTS: StayIntent[] = ["call", "sms", "reserve", "chat"];
const API_DATE = "YYYY-MM-DD";

export const STAY_PARAM = {
  checkIn: "checkin",
  checkOut: "checkout",
  guests: "total_guests",
  intent: "intent",
} as const;

const toApiDate = (value?: Date | null) =>
  value ? moment(value).format(API_DATE) : null;

export const useStaySearchParams = (maxCapacity?: number | null) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const stay = useMemo(
    () =>
      stayFromQuery(
        searchParams?.get(STAY_PARAM.checkIn),
        searchParams?.get(STAY_PARAM.checkOut),
      ),
    [searchParams],
  );

  const guests = useMemo(
    () =>
      guestsFromQuery(
        searchParams?.get(STAY_PARAM.guests),
        maxCapacity ?? null,
      ),
    [maxCapacity, searchParams],
  );

  const guestCount = guests
    ? Math.min(Number.parseInt(guests, 10), maxCapacity ?? Number.MAX_SAFE_INTEGER)
    : null;

  const hasStayParams = [
    STAY_PARAM.checkIn,
    STAY_PARAM.checkOut,
    STAY_PARAM.guests,
  ].some((key) => Boolean(searchParams?.get(key)));

  const intentParam = searchParams?.get(STAY_PARAM.intent);
  const intent = INTENTS.includes(intentParam as StayIntent)
    ? (intentParam as StayIntent)
    : null;

  const write = useCallback((next: Record<string, string | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, []);

  const setStay = useCallback(
    (range?: { end?: Date | null; start?: Date | null } | null) =>
      write({
        [STAY_PARAM.checkIn]: toApiDate(range?.start),
        [STAY_PARAM.checkOut]: toApiDate(range?.end),
      }),
    [write],
  );

  const setGuests = useCallback(
    (count?: number | string | null) =>
      write({ [STAY_PARAM.guests]: count ? `${count}` : null }),
    [write],
  );

  const clearStay = useCallback(
    () =>
      write({
        [STAY_PARAM.checkIn]: null,
        [STAY_PARAM.checkOut]: null,
        [STAY_PARAM.guests]: null,
      }),
    [write],
  );

  const consumeIntent = useCallback(
    () => write({ [STAY_PARAM.intent]: null }),
    [write],
  );

  const authUrlFor = useCallback(
    (nextIntent: StayIntent, current?: StayDraft) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (current) {
        params.set(STAY_PARAM.checkIn, toApiDate(current.start) ?? "");
        params.set(STAY_PARAM.checkOut, toApiDate(current.end) ?? "");
        params.set(STAY_PARAM.guests, `${current.guests}`);
      }
      params.set(STAY_PARAM.intent, nextIntent);
      return `/auth?redirect_url=${encodeURIComponent(`${pathname}?${params.toString()}`)}`;
    },
    [pathname, searchParams],
  );

  const step: StayStep = !stay
    ? "PICK_DATES"
    : !guests
      ? "PICK_GUESTS"
      : "READY";

  return {
    stay,
    step,
    intent,
    guests,
    guestCount,
    hasStayParams,
    setStay,
    setGuests,
    clearStay,
    authUrlFor,
    consumeIntent,
  };
};
