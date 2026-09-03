"use client";

import type { SelectedFiltersBarProps } from "@/types/components/modules/property-search-filters";
import { parseIdList } from "@features/cities/lib/city-selection";
import { sortDynamicFiltersInOrder } from "@/utils/constantss";
import { usePathname, useRouter } from "next/navigation";
import { RegionButton } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import { useCallback } from "react";

import SelectiveFilterChip from "./parts/SelectiveFilterChip.client";
import RemovableFilterChip from "./parts/RemovableFilterChip";
import numberWithCommas from "@/helpers/numberWithCommas";
import SwiperSlide from "@elements/Carousel/SwiperSlide";
import Swiper from "@elements/Carousel/Swiper.client";
import queryBuilder from "@/helpers/queryBuilder";
import _STRINGS from "@/utils/LocalStrings";
import indexOf from "lodash/indexOf";
import isEmpty from "lodash/isEmpty";
import moment from "moment-jalaali";

const JALALI_DATE_FORMAT = "jDD/jMMMM/jYYYY";

/**
 * Label for a range chip.
 *
 * A range does not always have both ends: `PriceRangeFilter` deliberately drops
 * a bound that is still sitting on its slider limit, so "up to 5 million" is
 * stored as `max_price` alone. The chips used to require both keys, which meant
 * exactly those one-sided filters — the common case — were applied to the
 * results while showing nothing the user could see or click to remove.
 */
const rangeLabel = (
  title: string,
  lower: string | undefined,
  higher: string | undefined,
  unit: string,
) => {
  const from = lower ? `${_STRINGS.FROM} ${numberWithCommas(lower)}` : "";
  const to = higher ? `${_STRINGS.TO} ${numberWithCommas(higher)}` : "";
  return `${title} ${[from, to].filter(Boolean).join(" ")} ${unit}`.trim();
};
// Party and pet render as their own chips instead of going through the dynamic list.
const RULE_FILTERS = [
  { key: "party", title: _STRINGS.PARTY },
  { key: "pet", title: _STRINGS.PET },
];

/**
 * The horizontal strip of currently applied filters above the property results.
 * Every chip clears the query keys it owns; the dynamic attribute chips open their
 * own picker instead.
 */
const SelectedFiltersBar = ({
  query,
  propertyTypes,
  containerClass,
  cityWithRegions,
  setShowRegions,
  setFilterModalShow,
}: SelectedFiltersBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const regionsIds = parseIdList(query?.regions);

  const removeFiltersKeys = useCallback(
    (keys: string[]) => {
      const body: Record<string, unknown> = { ...query };
      for (const key of keys) delete body[key];
      delete body.page;
      router.replace(`${pathname}?${queryBuilder(body)}`);
    },
    [pathname, query, router],
  );

  const setFilterValue = (key: string, value: unknown) => {
    const body: Record<string, unknown> = { ...query };
    if (value) body[key] = value;
    else delete body[key];
    delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const dynamicKeys = Object.keys(propertyTypes)
    .filter((key) => !["PARTY", "PET"].includes(key))
    .sort((left, right) =>
      indexOf(sortDynamicFiltersInOrder, left) > indexOf(sortDynamicFiltersInOrder, right)
        ? 1
        : -1,
    )
    .sort((left) => (query[left.toLowerCase()] ? -1 : 1));
  const activeDynamicKeyCount = dynamicKeys.filter(
    (key) => !!query[key.toLowerCase()],
  ).length;

  return (
    <Swiper autoFit parentClass={containerClass}>
      <SwiperSlide className="z-5 flex lg:hidden !w-auto">
        <button
          type="button"
          onClick={() => setFilterModalShow(true)}
          className="col-span-3 flex w-fit px-3 h-[1.625rem] rounded-full bg-brand-600 items-center gap-2"
        >
          <ContentImage
            alt=""
            width={12}
            height={12}
            className="cursor-pointer w-3 h-3 shrink-0"
            src="/assets/icons/property/white_filter_icon.svg"
          />
          <span className="text-white text-xs">{_STRINGS.OTHER_FILTERS}</span>
        </button>
      </SwiperSlide>

      {isEmpty(cityWithRegions?.child) ? null : (
        <SwiperSlide className="!w-auto flex lg:hidden">
          <RegionButton
            containerClass=""
            regionsIds={regionsIds}
            setShowRegions={setShowRegions}
            onClearRegions={() => removeFiltersKeys(["regions"])}
          />
        </SwiperSlide>
      )}

      {query?.total_bedrooms ? (
        <SwiperSlide key="selected-bedrooms" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["total_bedrooms"])}
            label={`${_STRINGS.ROOM_COUNT} : ${query?.total_bedrooms}`}
          />
        </SwiperSlide>
      ) : null}

      {query?.total_guests ? (
        <SwiperSlide key="selected-guests" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["total_guests"])}
            label={`${_STRINGS.PPL_COUNT} : ${query?.total_guests}`}
          />
        </SwiperSlide>
      ) : null}

      {query?.checkout && query?.checkin ? (
        <SwiperSlide key="selected-date" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["checkout", "checkin"])}
            label={`${_STRINGS.FROM} ${moment(query?.checkin).format(JALALI_DATE_FORMAT)} ${_STRINGS.TO} ${moment(query?.checkout).format(JALALI_DATE_FORMAT)}`}
          />
        </SwiperSlide>
      ) : null}

      {query?.max_commission || query?.min_commission ? (
        <SwiperSlide key="selected-commission" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["max_commission", "min_commission"])}
            label={rangeLabel(
              _STRINGS.COMMIS_JUST_PERC,
              query?.min_commission,
              query?.max_commission,
              "%",
            )}
          />
        </SwiperSlide>
      ) : null}

      {query?.max_price || query?.min_price ? (
        <SwiperSlide key="selected-price" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["max_price", "min_price"])}
            label={rangeLabel(
              _STRINGS.PRICE,
              query?.min_price,
              query?.max_price,
              _STRINGS.TOMAN,
            )}
          />
        </SwiperSlide>
      ) : null}

      {query?.max_building_area || query?.min_building_area ? (
        <SwiperSlide key="selected-area" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["max_building_area", "min_building_area"])}
            label={rangeLabel(
              _STRINGS.ROOM_SIZE,
              query?.min_building_area,
              query?.max_building_area,
              _STRINGS.METER,
            )}
          />
        </SwiperSlide>
      ) : null}

      {query?.has_discount === "1" ? (
        <SwiperSlide key="selected-discount" className="!w-auto">
          <RemovableFilterChip
            label={_STRINGS.HAS_DISCOUNT}
            onRemove={() => removeFiltersKeys(["has_discount"])}
          />
        </SwiperSlide>
      ) : null}

      {query?.is_premium === "1" ? (
        <SwiperSlide key="selected-premium" className="!w-auto">
          <RemovableFilterChip
            label={_STRINGS.PERMIUM_PROPS}
            onRemove={() => removeFiltersKeys(["is_premium"])}
          />
        </SwiperSlide>
      ) : null}

      {RULE_FILTERS.filter((rule) => query?.[rule.key]).map((rule) => (
        <SwiperSlide key={`selected-${rule.key}`} className="!w-auto">
          <RemovableFilterChip
            label={rule.title}
            onRemove={() => removeFiltersKeys([rule.key])}
          />
        </SwiperSlide>
      ))}

      {dynamicKeys.map((key) => (
        <SwiperSlide className="!w-auto" key={`dynamic-${key}`}>
          <SelectiveFilterChip
            queryKey={key.toLowerCase()}
            removeFiltersKeys={removeFiltersKeys}
            list={propertyTypes?.[key.toUpperCase()]}
            title={(_STRINGS as Record<string, string>)?.[key.toUpperCase()] || ""}
          />
        </SwiperSlide>
      ))}

      {dynamicKeys.length === 0 || activeDynamicKeyCount > 0 ? (
        <SwiperSlide key="selected-pool" className="!w-auto">
          <button
            type="button"
            onClick={() => setFilterValue("has_pool", 1)}
            className={`filter-chip gap-0 px-1 ${query?.has_pool ? "filter-chip-active" : "filter-chip-idle"}`}
          >
            <span className="text-xs px-2">
              {query?.has_pool === "0" ? _STRINGS.NO_POOL : _STRINGS.HAS_POOL}
            </span>
            {query?.has_pool ? (
              <span
                role="button"
                tabIndex={0}
                aria-label={`${_STRINGS.REMOVE_FILTERS} ${_STRINGS.HAS_POOL}`}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  event.stopPropagation();
                  removeFiltersKeys(["has_pool"]);
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  removeFiltersKeys(["has_pool"]);
                }}
                className="flex aspect-square h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-brand-600"
              >
                <ContentImage
                  alt=""
                  width={8}
                  height={8}
                  className="w-2 h-2 rotate-45 aspect-square"
                  src="/assets/icons/adds/blue_plus.svg"
                />
              </span>
            ) : null}
          </button>
        </SwiperSlide>
      ) : null}
    </Swiper>
  );
};

export default SelectedFiltersBar;
