"use client";

import type { SearchSuggestionsProps } from "@/types/components/modules/search";
import type { SearchOptionKind } from "@/types/features/search";

import SuggestionRowSkeleton from "./SuggestionRowSkeleton";
import SearchOptionRow from "./SearchOptionRow";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

// Rendered in this order; a group disappears entirely when it has no options.
const GROUP_ORDER: SearchOptionKind[] = ["place", "property", "guide"];

const GROUP_LABEL: Record<SearchOptionKind, string> = {
  place: _STRINGS.SEARCH_GROUP_PLACES,
  property: _STRINGS.SEARCH_GROUP_PROPERTIES,
  guide: _STRINGS.SEARCH_GROUP_GUIDES,
};

/**
 * The suggestion listbox.
 *
 * Options arrive already flattened and ordered, so the index a row reports is
 * the same index the keyboard cursor uses — the group headings are drawn from
 * the same sequence rather than from separate arrays.
 */
const SearchSuggestions = ({
  activeIndex,
  isLoading,
  listId,
  listRef,
  onHover,
  onPick,
  options,
  searchedText,
}: SearchSuggestionsProps) => {
  if (isLoading)
    return (
      <div className="w-full px-4 pb-2">
        <SuggestionRowSkeleton />
      </div>
    );

  // Only an answered-and-empty search says "nothing found"; an untouched panel
  // stays quiet and lets history and popular places do the talking.
  if (isEmpty(options))
    return !!searchedText && searchedText.trim().length >= 2 ? (
      <div className="w-full px-4 pb-2 pt-1">
        <p className="rounded-10 bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-600">
          {_STRINGS.SEARCH_NO_RESULT}
        </p>
      </div>
    ) : (
      <></>
    );

  return (
    <div
      id={listId}
      ref={listRef}
      role="listbox"
      aria-label={_STRINGS.SEARCH_SUGGESTIONS}
      className="flex w-full flex-col gap-0.5 px-2 pb-2 pt-1"
    >
      {/* Empty groups are dropped before the map rather than returned as empty
          fragments from inside it: a fragment in an array still needs a key, and
          React warns about it. */}
      {GROUP_ORDER.map((kind) => ({
        kind,
        group: options.filter((option) => option.kind === kind),
      }))
        .filter(({ group }) => !isEmpty(group))
        .map(({ group, kind }) => (
          <div className="flex w-full flex-col" key={kind}>
            <p className="px-2 pb-1 pt-2 text-xxs font-bold text-neutral-500">
              {GROUP_LABEL[kind]}
            </p>
            {group.map((option) => {
              const index = options.indexOf(option);
              return (
                <SearchOptionRow
                  index={index}
                  key={option.id}
                  option={option}
                  onHover={onHover}
                  onSelect={() => onPick(option)}
                  isActive={index === activeIndex}
                />
              );
            })}
          </div>
        ))}
    </div>
  );
};

export default SearchSuggestions;
