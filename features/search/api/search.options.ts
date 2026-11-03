import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { HomeService } from "@/api_services/home/home.service";
import { searchKeys } from "./search.keys";

/**
 * Shared by the options and by the hook that debounces into them, so the length
 * at which a term becomes queryable cannot drift between the two.
 */
export const MIN_SEARCH_TERM_LENGTH = 2;
export const MAX_SEARCH_TERM_LENGTH = 80;

export const searchSuggestionsOptions = (normalizedTerm: string) => {
  const isQueryable = normalizedTerm.length >= MIN_SEARCH_TERM_LENGTH;

  return queryOptions({
    queryKey: searchKeys.suggestions(normalizedTerm),
    queryFn: ({ signal }) => HomeService.GetSearchSuggs({ q: normalizedTerm }, signal),
    enabled: isQueryable,
    // The previous term's rows stay on screen — dimmed by the caller — while the
    // next term is in flight. Without this every keystroke group replaced the
    // whole list with a skeleton, which on a phone is the entire viewport
    // flashing between two nearly identical result sets.
    //
    // Conditional rather than unconditional: with no term there is nothing to
    // keep, and holding the last matches after the input is emptied would leave
    // the panel asserting results for a search the user just deleted.
    placeholderData: isQueryable ? keepPreviousData : undefined,
    staleTime: STALE_TIME.MEDIUM,
    // Deliberately longer than the default 5 minutes. Suggestion payloads are
    // small and a search session revisits the same handful of terms (typing,
    // backspacing, reopening the panel); evicting them mid-session buys back a
    // few kilobytes and costs a round trip on a phone network.
    gcTime: GC_TIME.LONG,
  });
};
