"use client";

import { normalizePersianSearchText } from "@features/search/lib/normalize-persian-search-text";
import { searchSuggestionsOptions } from "@features/search/api/search.options";
import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";

export const useSearchSuggestions = (term: string, enabled = true) => {
  const normalizedTerm = normalizePersianSearchText(term).slice(0, 80);
  const debouncedTerm = useDebouncedValue(normalizedTerm, 400);
  const query = useQuery({
    ...searchSuggestionsOptions(debouncedTerm),
    enabled: enabled && debouncedTerm.length >= 2,
  });

  return {
    ...query,
    isDebouncing:
      enabled && normalizedTerm.length >= 2 && normalizedTerm !== debouncedTerm,
    normalizedTerm,
  };
};
