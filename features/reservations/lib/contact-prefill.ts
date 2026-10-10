import type { CreateReserveDto } from "@/api_services/reserve/reserve.interface";

import { formatJalaliDay } from "../mappers/reservation-dates";
import { toDayKey } from "./stay-range";

export type ContactTrip = {
  code: string;
  title: string;
  endDate: Date;
  guests: number;
  total?: number;
  startDate: Date;
};

export const contactPrefillValues = ({
  code,
  title,
  guests,
  endDate,
  startDate,
}: ContactTrip) => ({
  title,
  code,
  checkin: formatJalaliDay(startDate),
  checkout: formatJalaliDay(endDate),
  guests: `${guests}`,
});

export const buildSmsHref = (number: string, body: string, isIOS: boolean) =>
  `sms:${number}${isIOS ? "&" : "?"}body=${encodeURIComponent(body)}`;

export const buildReservePayload = (
  propertyId: number,
  {
    endDate,
    guests,
    startDate,
  }: Pick<ContactTrip, "endDate" | "guests" | "startDate">,
): CreateReserveDto => ({
  check_in: toDayKey(startDate),
  check_out: toDayKey(endDate),
  guests_count: `${guests}`,
  property_id: propertyId,
});
