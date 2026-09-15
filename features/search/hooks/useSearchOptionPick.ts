"use client";

import { buildLocationLabel } from "@features/cities/lib/location-label";
import { pickLocationQuery } from "@features/cities/lib/location-label";
import { useSearchHistory } from "@features/search/hooks/useSearchHistory";
import { useCitiesStore } from "@/store";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import type { SearchOption } from "@/types/features/search";

export const useSearchOptionPick = (term: string, close: () => void) => {
  const router = useRouter();
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
            label: buildLocationLabel(locations),
            path,
            query: pickLocationQuery(
              Object.fromEntries(new URLSearchParams(search)),
            ),
          },
        });
      }
      close();
      router.push(option.href);
    },
    [close, remember, router, term],
  );
};
