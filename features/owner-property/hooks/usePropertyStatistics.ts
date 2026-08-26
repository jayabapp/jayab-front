"use client";

import { propertyStatisticsOptions } from "../api/owner-property.options";
import { useQuery } from "@tanstack/react-query";

export const usePropertyStatistics = (id: string | number) =>
  useQuery(propertyStatisticsOptions(id));
