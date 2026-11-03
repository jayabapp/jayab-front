"use client";

import { buildLocationLabel } from "@features/cities/lib/location-label";
import { pickLocationQuery } from "@features/cities/lib/location-label";
import { useSearchHistory } from "@features/search/hooks/useSearchHistory";
import { useLocationWords } from "@features/cities/hooks/useLocationWords";
import { useCitiesStore } from "@/store";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import queryBuilder from "@/helpers/queryBuilder";

import type { SearchOption } from "@/types/features/search";

export const useSearchOptionPick = (term: string, close: () => void) => {
  const router = useRouter();
  const words = useLocationWords();
  const { remember } = useSearchHistory();

  return useCallback(
    (option?: SearchOption) => {
      if (!option) return;
      remember(term);
      if (option.kind === "place") {
        const locations = option.locations ?? {};
        const [path, search = ""] = option.href.split("?");
        useCitiesStore.setState({
          locationsData: {
            ...locations,
            label: buildLocationLabel(locations, words),
            path,
            query: pickLocationQuery(
              Object.fromEntries(new URLSearchParams(search)),
            ),
          },
        });
      }
      close();
      const { categoryLanding } = useCitiesStore.getState();
      const ids = (list?: { id?: number | null }[]) =>
        list
          ?.map((entry) => entry.id)
          .filter(Boolean)
          .join(",") || undefined;
      const place =
        option.kind === "place"
          ? queryBuilder({
              cities: ids(option.locations?.cities),
              provinces: ids(option.locations?.provinces),
              regions: ids(option.locations?.regions),
            })
          : "";
      router.push(
        categoryLanding && place
          ? `${categoryLanding.path}?${place}`
          : option.href,
      );
    },
    [close, remember, router, term, words],
  );
};
