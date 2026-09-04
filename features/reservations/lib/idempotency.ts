import type { CreateReserveDto } from "@/api_services/reserve/reserve.interface";
import randomId from "@/helpers/randomId";

const prefix = "reservation-idempotency:";
const payloadKey = (payload: CreateReserveDto) =>
  [
    payload.property_id,
    payload.check_in,
    payload.check_out,
    payload.guests_count,
    payload.user_action,
  ].join(":");

export const getReservationIdempotencyKey = (payload: CreateReserveDto) => {
  const storageKey = `${prefix}${payloadKey(payload)}`;
  if (typeof window === "undefined") return `${Date.now()}-${Math.random()}`;
  const existing = sessionStorage.getItem(storageKey);
  if (existing) return existing;
  const key = randomId();
  sessionStorage.setItem(storageKey, key);
  return key;
};

export const clearReservationIdempotencyKey = (payload: CreateReserveDto) => {
  if (typeof window !== "undefined")
    sessionStorage.removeItem(`${prefix}${payloadKey(payload)}`);
};
