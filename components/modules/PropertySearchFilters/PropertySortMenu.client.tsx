"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useStoreInit } from "@/store";
import { SORT_TYPES } from "@/utils/constantss";
import { Icon } from "@elements/Icon";

import type { PropertySortMenuProps } from "@/types/components/modules/property-search-filters";

import queryBuilder from "@/helpers/queryBuilder";

const ADVISOR_ONLY_SORT = "commission_desc";
// The listing's own order is newest first, so "newest" doubles as the unsorted state.
const DEFAULT_SORT = SORT_TYPES[0].id;

const PropertySortMenu = ({ query }: PropertySortMenuProps) => {
  const t = useTranslations("listing");
  const tr = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((state) => state);

  const sortTypes = SORT_TYPES.filter(
    (entry) => userInfo?.advisor_id || entry.id !== ADVISOR_ONLY_SORT,
  ).map(({ titleKey, id }) => ({ id: id as string, title: tr(titleKey) }));

  const activeId = query?.sort_type ?? DEFAULT_SORT;

  const setSort = (id: string) => {
    const body: Record<string, unknown> = { ...query };
    delete body.page;
    if (id === DEFAULT_SORT) delete body.sort_type;
    else body.sort_type = id;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("sortBy")}
      className="flex min-w-0 max-w-full flex-wrap items-center gap-0.5 rounded-20 border border-line bg-surface p-0.5 md:flex-nowrap md:rounded-full md:p-1"
    >
      <span className="flex h-7 shrink-0 items-center gap-1 ps-3 pe-1.5 text-xs font-semibold text-ink md:h-9 md:text-sm">
        <Icon name="sort" size={16} className="text-link" />
        {t("sortBy")}
      </span>
      <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-line" />
      {sortTypes.map((entry) => {
        const isActive = entry.id === activeId;
        return (
          <button
            key={entry.id}
            role="radio"
            type="button"
            aria-checked={isActive}
            onClick={() => setSort(entry.id)}
            className={`h-7 shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs transition-colors md:h-9 md:px-3.5 md:text-sm ${
              isActive
                ? "bg-selected font-bold text-on-selected"
                : "font-medium text-ink-muted hover:bg-surface-muted"
            }`}
          >
            {entry.title}
          </button>
        );
      })}
    </div>
  );
};

export default PropertySortMenu;
