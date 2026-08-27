"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { advisorsOptions } from "../api/advisor.options";
import type { AdvisorFilters } from "../api/advisor.keys";

export const useAdvisors = (filters: AdvisorFilters) => {
  const query = useInfiniteQuery(advisorsOptions(filters));
  const advisors = Array.from(new Map(
    (query.data?.pages.flat() ?? []).map((advisor) => [advisor.id, advisor]),
  ).values());
  return { ...query, advisors };
};
