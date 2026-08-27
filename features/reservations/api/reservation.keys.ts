export type OwnerReservationFilters = { type?: string };

const normalizeOwnerFilters = (filters: OwnerReservationFilters) => ({
  ...(filters.type?.trim() ? { type: filters.type.trim() } : {}),
});

export const reservationKeys = {
  all: ["reservations"] as const,
  users: () => [...reservationKeys.all, "user"] as const,
  user: (type: string) => [...reservationKeys.users(), { type }] as const,
  owners: () => [...reservationKeys.all, "owner"] as const,
  owner: (filters: OwnerReservationFilters) =>
    [...reservationKeys.owners(), normalizeOwnerFilters(filters)] as const,
  active: () => [...reservationKeys.all, "active"] as const,
  availability: (propertyId: number | string, checkIn: string, checkOut: string, guests: string) =>
    [...reservationKeys.all, "availability", { propertyId: String(propertyId), checkIn, checkOut, guests }] as const,
  ownerActiveCount: () => [...reservationKeys.owners(), "active-count"] as const,
};
