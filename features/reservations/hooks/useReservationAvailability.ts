"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import { reservationKeys } from "../api/reservation.keys";

export const useReservationAvailability = (
  propertyId: number | string,
  checkIn: string,
  checkOut: string,
  guests: string,
  enabled = true,
) =>
  useQuery({
    queryKey: reservationKeys.availability(
      propertyId,
      checkIn,
      checkOut,
      guests,
    ),
    queryFn: ({ signal }) =>
      PropertyService.propertyReservedDates({ post_id: propertyId }, signal),
    enabled: enabled && Boolean(propertyId),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
