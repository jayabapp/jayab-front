"use client";

import { useSearchHistory } from "@features/search/hooks/useSearchHistory";
import { Icon } from "@elements/Icon";
import { useTranslations } from "next-intl";

import type { SearchHistoryChipsProps } from "@/types/components/modules/search";

import isEmpty from "lodash/isEmpty";

const SearchHistoryChips = ({ onSelect }: SearchHistoryChipsProps) => {
  const t = useTranslations();

  const { entries, forget } = useSearchHistory();

  return (
    <div className="flex w-full flex-col px-4 pt-4">
      {isEmpty(entries) ? null : (
        <div className="w-full flex items-center gap-2 mb-2">
          <p className="text-sm md:text-base md:font-medium">
            {t("search.urSearchHistory")}
          </p>
        </div>
      )}
      <div className="w-full flex flex-wrap gap-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-full gap-4 py-0.5 px-2 pe-1 flex items-center justify-center border border-action/30 bg-action/5 text-xs"
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
              aria-label={`${t("common.removeFilters")} ${entry.title}`}
              className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-action/30 flex items-center justify-center"
            >
              <Icon name="x" size={16} className="size-3 text-ink-muted" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistoryChips;
