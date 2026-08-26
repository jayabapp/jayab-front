"use client";

import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { CitiesSuggestTypes } from "@/enum/cities_suggest.enum";
import { useCitiesStore } from "@/store";
import { HomeService } from "@/api_services/home/home.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import queryBuilder from "@/helpers/queryBuilder";

export const usePropertySearch = (onNavigate?: () => void) => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ q }: { q: string }) =>
      HomeService.Search({ q: normalizePersianSearchText(q) }),
    onSuccess: (data) => {
      if (!data?.client_query) return;
      useCitiesStore.setState({
        locationsData: {
          cities: data.cities_list?.filter(
            (item) => item.level === CitiesSuggestTypes.CITY,
          ),
          provinces: data.cities_list?.filter(
            (item) => item.level === CitiesSuggestTypes.PROVINCE,
          ),
          regions: data.cities_list?.filter(
            (item) => item.level === CitiesSuggestTypes.REGION,
          ),
        },
      });
      onNavigate?.();
      router.push(`/rooms?${queryBuilder(data.client_query)}`);
    },
  });
};
