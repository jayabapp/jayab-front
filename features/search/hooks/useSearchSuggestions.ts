"use client";

import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { searchSuggestionsOptions } from "@features/search/api/search.options";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { searchKeys } from "@features/search/api/search.keys";
import { useEffect } from "react";

const MIN_TERM_LENGTH = 2;
const MAX_TERM_LENGTH = 80;

/**
 * Remote suggestions for the search panel.
 *
 * Race safety comes from the query key: every keystroke produces its own
 * normalized key, so a slow response can only ever settle its own cache entry and
 * can never overwrite the result of a newer term. Closing the panel (or
 * unmounting it) aborts the request that is still in flight rather than letting it
 * finish unobserved.
 */
export const useSearchSuggestions = (term: string, enabled = true) => {
  const queryClient = useQueryClient();
  const normalizedTerm = normalizePersianSearchText(term).slice(0, MAX_TERM_LENGTH);
  const debouncedTerm = useDebouncedValue(normalizedTerm, 400);
  const isQueryable = debouncedTerm.length >= MIN_TERM_LENGTH;

  const query = useQuery({
    ...searchSuggestionsOptions(debouncedTerm),
    enabled: enabled && isQueryable,
  });

  // Cleanup fires both when the term changes and when the panel unmounts, so a
  // superseded request is aborted instead of running to completion unobserved.
  useEffect(() => {
    if (!isQueryable) return;
    return () => {
      void queryClient.cancelQueries({
        queryKey: searchKeys.suggestions(debouncedTerm),
        exact: true,
      });
    };
  }, [isQueryable, debouncedTerm, queryClient]);

  useEffect(() => {
    if (enabled || !isQueryable) return;
    void queryClient.cancelQueries({
      queryKey: searchKeys.suggestions(debouncedTerm),
      exact: true,
    });
  }, [enabled, isQueryable, debouncedTerm, queryClient]);

  return {
    ...query,
    isDebouncing:
      enabled && normalizedTerm.length >= MIN_TERM_LENGTH && normalizedTerm !== debouncedTerm,
    normalizedTerm,
  };
};
