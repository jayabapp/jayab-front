import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { cmsKeys, homeKeys } from "./home.keys";
import { HomeService } from "@/api_services/home/home.service";

import { type ContentQuestionFilters } from "./home.keys";
import { type ContentListFilters } from "./home.keys";

import type { LandingsPlacements } from "@/enum/landings.enum";
import type { BannerPosition } from "@/enum/banners.enum";

export const homeBannersOptions = (positions: BannerPosition[]) =>
  queryOptions({
    queryKey: homeKeys.banners(positions),
    queryFn: ({ signal }) => HomeService.GetBanners({ positions }, signal),
    staleTime: STALE_TIME.SHORT,
  });

export const homeLandingsOptions = (placement?: LandingsPlacements) =>
  queryOptions({
    queryKey: homeKeys.landings(placement),
    queryFn: ({ signal }) => HomeService.getLandings({ placement }, signal),
    staleTime: STALE_TIME.MEDIUM,
  });

export const cmsContentOptions = (key: string) =>
  queryOptions({
    queryKey: cmsKeys.content(key),
    queryFn: ({ signal }) => HomeService.GetContentByKey({ key }, signal),
    staleTime: STALE_TIME.LONG,
    gcTime: GC_TIME.LONG,
  });

export const contentListOptions = (filters: ContentListFilters) =>
  queryOptions({
    queryKey: cmsKeys.list(filters),
    queryFn: ({ signal }) =>
      HomeService.GetContent(
        { key: filters.key, page: filters.page, per_page: filters.perPage },
        signal,
      ),
    staleTime: STALE_TIME.MEDIUM,
  });

export const blogListOptions = (perPage = 18) =>
  infiniteQueryOptions({
    queryKey: [...cmsKeys.lists(), "blog", { perPage }] as const,
    queryFn: ({ pageParam, signal }) =>
      HomeService.GetContent(
        { key: "blog", page: pageParam, per_page: perPage, summary: true },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.meta?.next ?? undefined,
    staleTime: STALE_TIME.MEDIUM,
  });

export const contentQuestionsOptions = (filters: ContentQuestionFilters) =>
  queryOptions({
    queryKey: cmsKeys.questions(filters),
    queryFn: ({ signal }) =>
      HomeService.FindAllComments(
        {
          content_id: filters.contentId,
          page: filters.page,
          per_page: filters.perPage,
          product_id: filters.productId,
        },
        signal,
      ),
    staleTime: STALE_TIME.SHORT,
  });
