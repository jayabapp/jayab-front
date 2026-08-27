import { ownerPropertyKeys } from "@features/owner-property/api/owner-property.keys";
import { reservationKeys } from "../api/reservation.keys";
import { propertyKeys } from "@features/properties/api/property.keys";

import type { QueryClient } from "@tanstack/react-query";

export const invalidateReservationCaches = async (
  client: QueryClient,
  propertyId?: number,
) => {
  await Promise.all([
    client.invalidateQueries({ queryKey: reservationKeys.all }),
    client.invalidateQueries({ queryKey: reservationKeys.ownerActiveCount() }),
    propertyId
      ? client.invalidateQueries({
          queryKey: propertyKeys.reservedDates(propertyId),
        })
      : Promise.resolve(),
    propertyId
      ? client.invalidateQueries({
          queryKey: [
            ...propertyKeys.all,
            "calendar",
            { id: String(propertyId) },
          ],
        })
      : Promise.resolve(),
    propertyId
      ? client.invalidateQueries({
          queryKey: [...ownerPropertyKeys.all, "calendar", String(propertyId)],
        })
      : Promise.resolve(),
  ]);
};
