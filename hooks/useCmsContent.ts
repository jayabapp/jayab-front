"use client";

import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { cmsContentQueryKey } from "@/api_services/home/cms-content";
import { ContentByKeyDto } from "@/api_services/home/home.interface";
import { HomeService } from "@/api_services/home/home.service";
import { useQuery } from "@tanstack/react-query";

export interface UseCmsContentResult {
  isError: boolean;
  isLoading: boolean;
  content: ContentByKeyDto | undefined;
}

export const useCmsContent = (
  key: string,
  options?: { enabled?: boolean },
): UseCmsContentResult => {
  const query = useQuery({
    queryKey: cmsContentQueryKey(key),
    queryFn: () => HomeService.GetContentByKey({ key }),
    enabled: options?.enabled ?? true,
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });
  return {
    content: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export default useCmsContent;
