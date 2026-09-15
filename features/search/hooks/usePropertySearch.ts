"use client";

import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { FILTER_ORDER_PARAM } from "@features/properties/lib/filter-order";
import { buildLocationLabel } from "@features/cities/lib/location-label";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { pickLocationQuery } from "@features/cities/lib/location-label";
import { useEffect, useRef } from "react";
import { useCitiesStore } from "@/store";
import { HomeService } from "@/api_services/home/home.service";
import { useMutation } from "@tanstack/react-query";
import { withQuery } from "@features/search/lib/search-url";
import { useRouter } from "next/navigation";

import type { PropertySearchInput } from "@/types/features/search";

const MAX_TERM_LENGTH = 80;

export const usePropertySearch = (onNavigate?: () => void) => {
  const router = useRouter();
  const sequence = useRef(0);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  return useMutation({
    mutationFn: async ({ extra, q }: PropertySearchInput) => {
      controller.current?.abort();
      const nextController = new AbortController();
      controller.current = nextController;
      sequence.current += 1;
      const requestId = sequence.current;
      const term = normalizePersianSearchText(q).slice(0, MAX_TERM_LENGTH);
      const data = await HomeService.Search({ q: term }, nextController.signal);
      return { data, extra, requestId, term };
    },
    onSuccess: ({ data, extra, requestId, term }) => {
      if (requestId !== sequence.current) return;
      onNavigate?.();

      if (data?.property?.slug) {
        router.push(withQuery(`/rooms/${data.property.slug}`, { ...extra }));
        return;
      }
      if (!data?.client_query) {
        router.push(withQuery("/rooms", { q: term, ...extra }));
        return;
      }

      const byLevel = (level: CitiesSuggestTypes) =>
        data.cities_list?.filter((item) => item.level === level) ?? [];
      const entries = {
        cities: byLevel(CitiesSuggestTypes.CITY),
        provinces: byLevel(CitiesSuggestTypes.PROVINCE),
        regions: byLevel(CitiesSuggestTypes.REGION),
      };
      const filterOrder = data.matched_order?.length
        ? data.matched_order.join(",")
        : undefined;
      const remember = (path: string) =>
        useCitiesStore.setState({
          locationsData: {
            ...entries,
            label: buildLocationLabel(entries),
            path,
            query: pickLocationQuery(data.client_query),
          },
        });

      if (data.landing_url) {
        const path = `/${data.landing_url.replace(/^\/+/, "")}`;
        const landingFilters: Record<string, unknown> = {
          ...data.client_query,
          ...extra,
          [FILTER_ORDER_PARAM]: filterOrder,
        };
        delete landingFilters.cities;
        delete landingFilters.provinces;
        delete landingFilters.province_id;
        delete landingFilters.q;
        remember(path);
        router.push(withQuery(path, landingFilters));
        return;
      }

      remember("/rooms");
      router.push(
        withQuery("/rooms", {
          ...data.client_query,
          ...extra,
          [FILTER_ORDER_PARAM]: filterOrder,
        }),
      );
    },
  });
};
