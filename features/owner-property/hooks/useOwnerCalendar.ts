"use client";

import { ownerCalendarOptions } from "../api/owner-property.options";
import { useQuery } from "@tanstack/react-query";

export const useOwnerCalendar = (
  id: string | number,
  year: number | string,
  month: number | string,
) => useQuery(ownerCalendarOptions(id, year, month));
