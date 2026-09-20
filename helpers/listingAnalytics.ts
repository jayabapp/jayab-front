"use client";

type ListingEventPayload = Record<
  string,
  boolean | number | string | null | undefined
>;

export const trackListingEvent = (
  event: string,
  payload: ListingEventPayload = {},
) => {
  if (typeof window === "undefined") return;
  const dataLayer = (
    window as Window & { dataLayer?: Array<Record<string, unknown>> }
  ).dataLayer;
  dataLayer?.push({ event, ...payload });
};
