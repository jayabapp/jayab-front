"use client";

import type { PropertySortMenuProps } from "@/types/components/modules/property-search-filters";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { SORT_TYPES } from "@/utils/constantss";
import { ContentImage } from "@elements/Image";
import { useStoreInit } from "@/store";

import queryBuilder from "@/helpers/queryBuilder";
import _STRINGS from "@/utils/LocalStrings";

const ADVISOR_ONLY_SORT = "commission_desc";

const PropertySortMenu = ({ query }: PropertySortMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((state) => state);

  const sortTypes = userInfo?.advisor_id
    ? SORT_TYPES
    : SORT_TYPES.filter((entry) => entry?.id !== ADVISOR_ONLY_SORT);

  const activeSort =
    sortTypes.find((entry) => entry?.id === query?.sort_type) ||
    SORT_TYPES?.[0];

  const setSort = (id?: string | number | null) => {
    const body: Record<string, unknown> = { ...query };
    delete body.page;
    if (id == null) delete body.sort_type;
    else body.sort_type = id;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className="w-fit flex lg:flex-row shrink-0 gap-3 items-center justify-between rounded-10">
      <Menu as="div" className="relative shrink-0 inline-block text-left mr-1">
        <MenuButton className="md:h-6.5 shrink-0 rounded-lg cursor-pointer flex justify-between items-center">
          <div className="gap-2 h-6.5 px-2 shrink-0 rounded-full bg-white border-brand-200 border flex items-center justify-center">
            <p className="shrink-0 text-xs md:text-sm">{activeSort?.title}</p>
            <ContentImage
              alt=""
              width={12}
              height={12}
              className="w-3 h-3 aspect-square"
              src="/assets/icons/shared/chevron.svg"
            />
          </div>
        </MenuButton>

        <MenuItems
          transition
          className="absolute shadow-xl top-0 md:top-auto left-0 z-20 mt-2 w-48 origin-top-center rounded-20 bg-white custom-shadow ring-1 ring-black ring-opacity-5 focus:outline-none overflow-scroll transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="flex gap-2 px-3 items-center flex-col py-2 border-b border-neutral-200">
            <div className="w-full flex items-center justify-between py-1">
              <p className="text-sm">{_STRINGS.SORT_BY}</p>
            </div>

            {sortTypes.map((entry, index) => (
              <MenuItem key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSort(entry?.id)}
                  className="w-full pl-8 py-2 border-t first:border-t-0 pt-2 gap-2 flex items-center cursor-pointer relative"
                >
                  {query?.sort_type === entry?.id ||
                  (!query?.sort_type && index === 0) ? (
                    <ContentImage
                      alt=""
                      width={12}
                      height={12}
                      className="absolute left-2"
                      src="/assets/icons/adds/blue_tick.svg"
                    />
                  ) : null}
                  <ContentImage
                    alt=""
                    width={20}
                    height={20}
                    src={entry?.icon}
                    className="w-5 h-5 aspect-square"
                  />
                  <p className="text-sm text-black opacity-70">
                    {entry?.title}
                  </p>
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default PropertySortMenu;
