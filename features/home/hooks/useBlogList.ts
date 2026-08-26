"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { blogListOptions } from "@features/home/api/home.options";
import { useCallback } from "react";
import { cmsKeys } from "@features/home/api/home.keys";

export const useBlogList = (perPage = 18) => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery(blogListOptions(perPage));
  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: cmsKeys.lists() }),
    [queryClient],
  );

  return {
    ...query,
    blogs: query.data?.pages.flatMap((page) => page?.data ?? []) ?? [],
    refresh,
  };
};
