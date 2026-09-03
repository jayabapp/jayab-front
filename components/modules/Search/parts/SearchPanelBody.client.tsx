"use client";

import type { SearchPanelBodyProps } from "@/types/components/modules/search";
import { SearchBoxCitySelector } from "@modules/HomeCities";
import { Suspense } from "react";

import SearchSelectedLocations from "./SearchSelectedLocations.client";
import SearchPopularPlaces from "./SearchPopularPlaces.client";
import SearchHistoryChips from "./SearchHistoryChips.client";
import SearchSuggestions from "./SearchSuggestions.client";
import isEmpty from "lodash/isEmpty";

/**
 * The body every search surface shares: resolved locations, remote suggestions,
 * local history, popular destinations and the city-list entry point.
 *
 * History and popular places are hidden once there are suggestions on screen —
 * they are the empty-state content, and stacking them under a live result list
 * pushed the results the reader is actually looking at off the top of the panel.
 */
const SearchPanelBody = ({
  activeIndex,
  isLoading,
  listId,
  listRef,
  onClose,
  onHover,
  onPick,
  onTermChange,
  options,
  term,
}: SearchPanelBodyProps) => {
  const isBrowsing = isEmpty(options) && !isLoading;

  return (
    <>
      <SearchSelectedLocations onClose={onClose} />

      <SearchSuggestions
        listId={listId}
        options={options}
        listRef={listRef}
        onHover={onHover}
        onPick={onPick}
        searchedText={term}
        isLoading={isLoading}
        activeIndex={activeIndex}
      />

      {isBrowsing ? (
        <>
          <Suspense>
            <SearchHistoryChips onSelect={onTermChange} />
          </Suspense>
          <Suspense>
            <SearchPopularPlaces onClose={onClose} />
          </Suspense>
          <SearchBoxCitySelector onSubmitCB={onClose} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default SearchPanelBody;
