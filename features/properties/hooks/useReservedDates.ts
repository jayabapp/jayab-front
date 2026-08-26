"use client";

import { reservedDatesOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

export const useReservedDates = (id: number | string) =>
  useQuery(reservedDatesOptions(id));
