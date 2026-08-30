"use client";

import { contentListOptions } from "@features/home/api/home.options";
import { useQuery } from "@tanstack/react-query";

import type { ContentListFilters } from "@features/home/api/home.keys";

export const useContentList = (filters: ContentListFilters, enabled = true) => {
  const query = useQuery({ ...contentListOptions(filters), enabled });
  return { ...query, items: query.data?.data ?? [], meta: query.data?.meta };
};
