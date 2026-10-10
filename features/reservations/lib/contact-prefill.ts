import { formatJalaliDay } from "../mappers/reservation-dates";
import { toDayKey } from "./stay-range";

import type { CreateReserveDto } from "@/api_services/reserve/reserve.interface";
import type { JalaliFormatter } from "@/helpers/intl/jalali";

export type ContactTrip = {
  code: string;
  title: string;
  endDate: Date;
  guests: number;
  total?: number;
  startDate: Date;
};

export const contactPrefillValues = (
  { code, title, guests, endDate, startDate }: ContactTrip,
  format?: JalaliFormatter,
) => ({
  title,
  code,
  checkin: formatJalaliDay(startDate, format),
  checkout: formatJalaliDay(endDate, format),
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
