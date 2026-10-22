"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
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
  ).map(({ titleKey, id, icon }) => ({ id: id as string, title: tr(titleKey), icon }));

  const activeId = query?.sort_type ?? DEFAULT_SORT;

  const setSort = (id: string) => {
    const body: Record<string, unknown> = { ...query };
    delete body.page;
    if (id === DEFAULT_SORT) delete body.sort_type;
    else body.sort_type = id;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <>
      {/* Desktop: every option as one pill row. */}
      <div
        role="radiogroup"
        aria-label={t("sortBy")}
        className="hidden min-w-0 max-w-full items-center gap-0.5 rounded-full border border-line bg-surface p-1 md:flex"
      >
        <span className="flex h-9 shrink-0 items-center gap-1 ps-3 pe-1.5 text-sm font-semibold text-ink">
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
              className={`h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 text-sm transition-colors ${
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

      {/* Mobile: a dropdown, like before. The panel is anchored (floating-ui), so it
          repositions to stay inside the viewport instead of spilling past its edge. */}
      <Menu as="div" className="relative inline-block shrink-0 text-end md:hidden">
        <MenuButton className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-semibold text-ink">
          <Icon name="sort" size={16} className="text-link" />
          {t("sortBy")}
        </MenuButton>

        <MenuItems
          transition
          anchor={{ to: "bottom end", gap: 8, padding: 12 }}
          className="z-20 w-48 origin-top-right overflow-hidden rounded-20 border border-line bg-surface shadow-elevated focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="flex flex-col gap-1 px-3 py-2">
            <p className="py-1 text-sm text-ink-muted">{t("sortBy")}</p>

            {sortTypes.map((entry) => (
              <MenuItem key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSort(entry.id)}
                  className="relative flex w-full cursor-pointer items-center gap-2 border-t border-line py-2 pe-8"
                >
                  {entry.id === activeId ? (
                    <Icon
                      name="check"
                      size={16}
                      className="absolute end-2 text-link"
                    />
                  ) : null}
                  {entry.icon ? (
                    <ContentImage
                      alt=""
                      width={20}
                      height={20}
                      src={entry.icon}
                      className="size-5"
                    />
                  ) : (
                    <Icon name="sparkles" size={20} className="text-link" />
                  )}
                  <span className="text-sm text-ink">{entry.title}</span>
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </>
  );
};

export default PropertySortMenu;
