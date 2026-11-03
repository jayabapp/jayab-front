"use client";

import { SearchBoxCitySelector } from "@modules/HomeCities";
import { Suspense } from "react";

import type { SearchPanelBodyProps } from "@/types/components/modules/search";

import SearchSelectedLocations from "./SearchSelectedLocations.client";
import SearchPopularPlaces from "./SearchPopularPlaces.client";
import SearchHistoryChips from "./SearchHistoryChips.client";
import SearchSuggestions from "./SearchSuggestions.client";
import isEmpty from "lodash/isEmpty";

const SearchPanelBody = ({
  term,
  listId,
  onPick,
  isStale,
  listRef,
  onClose,
  onHover,
  options,
  isLoading,
  activeIndex,
  onPickCities,
  hideCityList,
  onTermChange,
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
        isStale={isStale}
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
          {hideCityList ? (
            <></>
          ) : (
            <SearchBoxCitySelector
              onSubmitCB={onClose}
              onPickCities={onPickCities}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default SearchPanelBody;
