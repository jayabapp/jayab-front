"use client";

import type { SearchHistoryChipsProps } from "@/types/components/modules/search";
import { useSearchHistory } from "@features/search/hooks/useSearchHistory";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const SearchHistoryChips = ({ onSelect }: SearchHistoryChipsProps) => {
  const { entries, forget } = useSearchHistory();

  return (
    <div className="flex px-4 pt-0 flex-col w-full">
      {isEmpty(entries) ? null : (
        <div className="w-full flex items-center gap-2 mb-2">
          <p className="text-sm md:text-base md:font-medium">{_STRINGS.UR_SEARCH_HISTORY}</p>
        </div>
      )}
      <div className="w-full flex flex-wrap gap-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-full gap-4 py-0.5 px-2 pl-1 flex items-center justify-center border border-brand-600/30 bg-brand-600/5 text-xs"
          >
            <button
              type="button"
              className="text-sm cursor-pointer"
              onClick={() => onSelect(entry.title)}
            >
              {entry.title}
            </button>
            <button
              type="button"
              onClick={() => forget(entry.id)}
              aria-label={`${_STRINGS.REMOVE_FILTERS} ${entry.title}`}
              className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600/30 flex items-center justify-center"
            >
              <ContentImage
                alt=""
                width={10}
                height={10}
                src="/assets/icons/adds/x_mark.svg"
                className="w-2.5 h-2.5 opacity-30 p-0.5 text-neutral-900 aspect-square"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistoryChips;
