"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { blogListOptions } from "@features/home/api/home.options";
import { useCallback, useMemo } from "react";
import { cmsKeys } from "@features/home/api/home.keys";

import type { ContentDto } from "@/api_services/home/home.interface";

export const useBlogList = (perPage = 18) => {
  const queryClient = useQueryClient();
  const query = useInfiniteQuery(blogListOptions(perPage));
  const blogs = useMemo(() => {
    const unique = new Map<number, ContentDto>();
    query.data?.pages.forEach((page) =>
      page?.data?.forEach((item) => unique.set(item.id, item)),
    );
    return [...unique.values()];
  }, [query.data]);
  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: cmsKeys.lists() }),
    [queryClient],
  );

  return {
    ...query,
    blogs,
    refresh,
  };
};
