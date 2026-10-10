"use client";

import { useTranslations } from "next-intl";

import type { SearchSuggestionsProps } from "@/types/components/modules/search";
import type { SearchOptionKind } from "@/types/features/search";

import SuggestionRowSkeleton from "./SuggestionRowSkeleton";
import SearchOptionRow from "./SearchOptionRow";
import isEmpty from "lodash/isEmpty";

const GROUP_ORDER: SearchOptionKind[] = ["place", "property", "guide"];

const GROUP_LABEL = {
  place: "search.searchGroupPlaces",
  property: "search.searchGroupProperties",
  guide: "search.searchGroupGuides",
} as const satisfies Record<SearchOptionKind, string>;

const SearchSuggestions = ({
  listId,
  onPick,
  isStale,
  onHover,
  listRef,
  options,
  isLoading,
  activeIndex,
  searchedText,
}: SearchSuggestionsProps) => {
  const t = useTranslations();

  if (isLoading)
    return (
      <div className="w-full px-4 pb-2">
        <SuggestionRowSkeleton />
      </div>
    );

  if (isEmpty(options))
    return !!searchedText && searchedText.trim().length >= 2 ? (
      <div className="w-full px-4 pb-2 pt-1">
        <p className="rounded-10 bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-600">
          {t("search.searchNoResult")}
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
      aria-busy={!!isStale}
      aria-label={t("search.searchSuggestions")}
      className={`flex w-full flex-col gap-0.5 px-2 pb-2 pt-1 transition-opacity duration-200 ${
        isStale ? "opacity-50" : "opacity-100"
      }`}
    >
      {GROUP_ORDER.map((kind) => ({
        kind,
        group: options.filter((option) => option.kind === kind),
      }))
        .filter(({ group }) => !isEmpty(group))
        .map(({ group, kind }) => (
          <div className="flex w-full flex-col" key={kind}>
            <p className="px-2 pb-1 pt-2 text-xxs font-bold text-neutral-500">
              {t(GROUP_LABEL[kind])}
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
