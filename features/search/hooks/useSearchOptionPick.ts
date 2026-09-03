"use client";

import { useSearchHistory } from "@features/search/hooks/useSearchHistory";
import type { SearchOption } from "@/types/features/search";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useCitiesStore } from "@/store";

/**
 * Opening a suggestion — from a click or from Enter on the keyboard cursor.
 *
 * It lives in one place because the two paths must not drift: remembering the
 * term, seeding the location chips and closing the panel are as much a part of
 * "choosing a suggestion" as the navigation is.
 */
export const useSearchOptionPick = (term: string, close: () => void) => {
  const router = useRouter();
  const { remember } = useSearchHistory();

  return useCallback(
    (option?: SearchOption) => {
      if (!option) return;

      remember(term);
      // A place also seeds the chips, so the listing page can show what it
      // filtered by without resolving the ids out of the URL again.
      if (option.kind === "place") {
        useCitiesStore.setState({ locationsData: option.locations ?? {} });
      }
      close();
      router.push(option.href);
    },
    [close, remember, router, term],
  );
};
