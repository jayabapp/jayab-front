"use client";

import {
  MAX_SEARCH_TERM_LENGTH,
  MIN_SEARCH_TERM_LENGTH,
  searchSuggestionsOptions,
} from "@features/search/api/search.options";
import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { searchKeys } from "@features/search/api/search.keys";
import { useEffect } from "react";

const SUGGESTIONS_DEBOUNCE_MS = 400;

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
  const normalizedTerm = normalizePersianSearchText(term).slice(0, MAX_SEARCH_TERM_LENGTH);
  const debouncedTerm = useDebouncedValue(normalizedTerm, SUGGESTIONS_DEBOUNCE_MS);

  // Two cases skip the debounce entirely.
  //
  // Below the minimum length there is nothing to wait for: the query is disabled
  // either way, and holding the previous term for another 400ms would leave rows
  // on screen for a search the user has already cleared.
  //
  // Backspacing into a term the cache already answered is the other. `gcTime`
  // keeps a session's terms around, so re-showing them should cost nothing —
  // waiting out the timer would repaint the list for data we are already
  // holding. Reading the cache during render is safe here because it can only
  // ever *skip* the wait: if the entry is missing the debounce still fires and
  // re-renders on its own.
  const isCached = !!queryClient.getQueryData(searchKeys.suggestions(normalizedTerm));
  const activeTerm =
    normalizedTerm.length < MIN_SEARCH_TERM_LENGTH || isCached ? normalizedTerm : debouncedTerm;

  const query = useQuery({
    ...searchSuggestionsOptions(activeTerm),
    enabled: enabled && activeTerm.length >= MIN_SEARCH_TERM_LENGTH,
  });

  // Cleanup fires both when the term changes and when the panel unmounts, so a
  // superseded request is aborted instead of running to completion unobserved.
  useEffect(() => {
    if (activeTerm.length < MIN_SEARCH_TERM_LENGTH) return;
    return () => {
      void queryClient.cancelQueries({
        queryKey: searchKeys.suggestions(activeTerm),
        exact: true,
      });
    };
  }, [activeTerm, queryClient]);

  useEffect(() => {
    if (enabled || activeTerm.length < MIN_SEARCH_TERM_LENGTH) return;
    void queryClient.cancelQueries({
      queryKey: searchKeys.suggestions(activeTerm),
      exact: true,
    });
  }, [enabled, activeTerm, queryClient]);

  const isDebouncing = enabled && normalizedTerm !== activeTerm;

  return {
    ...query,
    // "Nothing to show yet" — the only state that earns a skeleton.
    isLoading: query.isPending && enabled && activeTerm.length >= MIN_SEARCH_TERM_LENGTH,
    // "What is on screen belongs to an older term." The caller dims rather than
    // replaces, so the list never collapses under the reader's thumb.
    isStale: isDebouncing || query.isFetching || query.isPlaceholderData,
    isDebouncing,
    normalizedTerm,
  };
};
