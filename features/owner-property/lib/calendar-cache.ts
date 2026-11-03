import type { OwnerCallendarItemDto } from "@/types/features/owner-property";
import type { JalaaliDayDto } from "@/types/features/owner-property";
import type { QueryClient } from "@tanstack/react-query";

import { ownerPropertyKeys } from "@features/owner-property/api/owner-property.keys";
import { produce } from "immer";

import moment from "moment-jalaali";

const JALALI_DAY = "jYYYY/jMM/jD";

export const toJalaaliDays = (dates: string[]): JalaaliDayDto[] =>
  dates
    .filter((date) => !!date)
    .map((date) => {
      const parsed = moment(date, JALALI_DAY);
      return {
        day: Number(parsed.format("jD")),
        month: Number(parsed.format("jM")),
        year: Number(parsed.format("jYYYY")),
      };
    });

export const includesToday = (dates: string[]) =>
  dates.some((date) =>
    moment().isSame(moment(date, JALALI_DAY).format("YYYY/MM/DD"), "day"),
  );

export const patchOwnerCalendarDays = (
  client: QueryClient,
  propertyId: string | number,
  days: JalaaliDayDto[],
  patch: Partial<OwnerCallendarItemDto>,
) => {
  for (const day of days) {
    client.setQueryData<OwnerCallendarItemDto[]>(
      ownerPropertyKeys.calendar(propertyId, day.year, day.month),
      (previous) =>
        !previous
          ? previous
          : produce(previous, (draft) => {
              const index = draft.findIndex(
                (entry) =>
                  entry.day === day.day &&
                  entry.month == day.month &&
                  entry.year == day.year,
              );
              if (index < 0) return;
              draft[index] = { ...draft[index], ...patch };
            }),
    );
  }
};
