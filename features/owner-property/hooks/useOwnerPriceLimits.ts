"use client";

import { ownerPriceLimitsOptions } from "../api/owner-property.options";
import { useQuery } from "@tanstack/react-query";

export const useOwnerPriceLimits = (
  id: string | number,
  day: number | string,
  month: number | string,
  year: number | string,
) => useQuery(ownerPriceLimitsOptions(id, day, month, year));
