"use client";

import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { HomeService } from "@/api_services/home/home.service";
import { useEffect, useRef } from "react";
import { useCitiesStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { PropertySearchInput } from "@/types/features/search";

import queryBuilder from "@/helpers/queryBuilder";

const MAX_TERM_LENGTH = 80;

/**
 * Turns a free-text query into the `/rooms` filter URL the backend derives from it.
 *
 * Submitting again while a request is in flight aborts the previous one and stamps
 * the new request with a higher sequence number, so a late response from an earlier
 * submit can neither navigate nor overwrite the location store.
 */
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
      // The user's own choices win over anything the text resolved to: if they
      // said 4 guests, that is not a guess to be overwritten by `/extract`.
      router.push(`/rooms?${queryBuilder({ ...data.client_query, ...extra })}`);
    },
  });
};
