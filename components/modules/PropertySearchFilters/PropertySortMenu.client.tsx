"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useStoreInit } from "@/store";
import { SORT_TYPES } from "@/utils/constantss";
import { Icon } from "@elements/Icon";

import type { PropertySortMenuProps } from "@/types/components/modules/property-search-filters";

const ADVISOR_ONLY_SORT = "commission_desc";
const DEFAULT_SORT = SORT_TYPES[0].id;

const PropertySortMenu = ({ query }: PropertySortMenuProps) => {
  const t = useTranslations("listing");
  const tr = useTranslations();

  const replaceQuery = useDiscoveryQueryReplace();
  const { userInfo } = useStoreInit((state) => state);

  const sortTypes = SORT_TYPES.filter(
    (entry) => userInfo?.advisor_id || entry.id !== ADVISOR_ONLY_SORT,
  ).map(({ titleKey, id, icon }) => ({
    id: id as string,
    title: tr(titleKey),
    icon,
  }));

  const activeId = query?.sort_type ?? DEFAULT_SORT;
  const activeTitle = sortTypes.find((entry) => entry.id === activeId)?.title;

  const setSort = (id: string) => {
    const body: Record<string, unknown> = { ...query };
    if (id === DEFAULT_SORT) delete body.sort_type;
    else body.sort_type = id;
    replaceQuery(body);
  };

  return (
    <Menu as="div" className="relative inline-block shrink-0 text-end">
      <MenuButton className="flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full md:gap-1.5 border border-line bg-surface px-2.5 text-xs font-semibold text-ink md:h-11 md:px-4 md:text-sm">
        <Icon name="sort" size={16} className="text-link" />
        <span>{t("sortBy")}</span>
        {activeTitle ? (
          <span className="hidden font-bold text-on-selected md:inline">
            {activeTitle}
          </span>
        ) : null}
        <Icon
          size={16}
          name="chevron-down"
          className="hidden text-ink-subtle md:block"
        />
      </MenuButton>

      <MenuItems
        transition
        anchor={{ to: "bottom end", gap: 8, padding: 12 }}
        className="z-20 w-52 origin-top-right overflow-hidden rounded-20 border border-line bg-surface shadow-elevated focus:outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <div className="flex flex-col gap-1 px-3 py-2">
          <p className="py-1 text-sm text-ink-muted">{t("sortBy")}</p>

          {sortTypes.map((entry) => (
            <MenuItem key={entry.id}>
              <button
                type="button"
                onClick={() => setSort(entry.id)}
                className="relative flex min-h-11 w-full cursor-pointer items-center gap-2 border-t border-line py-2 pe-8"
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
  );
};

export default PropertySortMenu;
