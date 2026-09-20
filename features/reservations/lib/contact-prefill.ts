import type { CreateReserveDto } from "@/api_services/reserve/reserve.interface";

import { formatJalaliDay } from "../mappers/reservation-dates";
import { toDayKey } from "./stay-range";

import _STRINGS from "@/utils/LocalStrings";

export type ContactTrip = {
  code: string;
  title: string;
  endDate: Date;
  guests: number;
  total?: number;
  startDate: Date;
};

export const buildContactPrefill = ({
  code,
  title,
  guests,
  endDate,
  startDate,
}: ContactTrip) =>
  _STRINGS.CONTACT_PREFILL.replace("{title}", () => title)
    .replace("{code}", () => code)
    .replace("{checkin}", () => formatJalaliDay(startDate))
    .replace("{checkout}", () => formatJalaliDay(endDate))
    .replace("{guests}", () => `${guests}`);

export const buildGenericPrefill = ({
  code,
  title,
}: Pick<ContactTrip, "code" | "title">) =>
  _STRINGS.CONTACT_PREFILL_GENERIC.replace("{title}", () => title).replace(
    "{code}",
    () => code,
  );

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
