"use client";

import { propertyCalendarOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

export const usePropertyCalendar = (
  id: number | string,
  range: { month: number; year: number },
  enabled = true,
) => useQuery(propertyCalendarOptions(id, range, enabled));
