"use client";

import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { useEffect, useRef } from "react";
import { useCitiesStore } from "@/store";
import { HomeService } from "@/api_services/home/home.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { PropertySearchInput } from "@/types/features/search";

import queryBuilder from "@/helpers/queryBuilder";

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
      const data = await HomeService.Search(
        { q: normalizePersianSearchText(q).slice(0, MAX_TERM_LENGTH) },
        nextController.signal,
      );
      return { data, extra, requestId };
    },
    onSuccess: ({ data, extra, requestId }) => {
      if (requestId !== sequence.current) return;
      if (!data?.client_query) return;

      const byLevel = (level: CitiesSuggestTypes) =>
        data.cities_list?.filter((item) => item.level === level);

      useCitiesStore.setState({
        locationsData: {
          cities: byLevel(CitiesSuggestTypes.CITY),
          provinces: byLevel(CitiesSuggestTypes.PROVINCE),
          regions: byLevel(CitiesSuggestTypes.REGION),
        },
      });
      onNavigate?.();
      if (data.landing_url) {
        const landingFilters = { ...data.client_query, ...extra };
        delete landingFilters.cities;
        delete landingFilters.provinces;
        delete landingFilters.province_id;
        delete landingFilters.regions;
        delete landingFilters.q;
        router.push(`/${data.landing_url}?${queryBuilder(landingFilters)}`);
        return;
      }
      router.push(`/rooms?${queryBuilder({ ...data.client_query, ...extra })}`);
    },
  });
};
