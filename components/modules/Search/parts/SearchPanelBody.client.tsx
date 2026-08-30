"use client";

import type { SearchPanelBodyProps } from "@/types/components/modules/search";
import { SearchBoxCitySelector } from "@modules/HomeCities";
import { Suspense } from "react";

import SearchSelectedLocations from "./SearchSelectedLocations.client";
import SearchPopularPlaces from "./SearchPopularPlaces.client";
import SearchHistoryChips from "./SearchHistoryChips.client";
import SearchSuggestions from "./SearchSuggestions.client";

/**
 * The body every search surface shares: resolved locations, remote suggestions,
 * local history, popular destinations and the city-list entry point.
 */
const SearchPanelBody = ({
  isLoading,
  onClose,
  onTermChange,
  suggestions,
  term,
}: SearchPanelBodyProps) => (
  <>
    <SearchSelectedLocations onClose={onClose} />
    <SearchSuggestions
      data={suggestions}
      onClose={onClose}
      searchedText={term}
      isLoading={isLoading}
    />
    <Suspense>
      <SearchHistoryChips onSelect={onTermChange} />
    </Suspense>
    <Suspense>
      <SearchPopularPlaces onClose={onClose} />
    </Suspense>
    <SearchBoxCitySelector onSubmitCB={onClose} />
  </>
);

export default SearchPanelBody;
