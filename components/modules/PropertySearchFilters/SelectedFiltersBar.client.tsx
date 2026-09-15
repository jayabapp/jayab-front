"use client";

import type { SelectedFiltersBarProps } from "@/types/components/modules/property-search-filters";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { FILTER_ORDER_PARAM } from "@features/properties/lib/filter-order";
import { parseFilterOrder } from "@features/properties/lib/filter-order";
import { filterOrderRank } from "@features/properties/lib/filter-order";
import { parseIdList } from "@features/cities/lib/city-selection";
import { sortDynamicFiltersInOrder } from "@/utils/constantss";
import { RegionButton } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import type { ReactNode } from "react";
import { useCallback } from "react";

import SelectiveFilterChip from "./parts/SelectiveFilterChip.client";
import RemovableFilterChip from "./parts/RemovableFilterChip";
import numberWithCommas from "@/helpers/numberWithCommas";
import SwiperSlide from "@elements/Carousel/SwiperSlide";
import Swiper from "@elements/Carousel/Swiper.client";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import moment from "moment-jalaali";

const JALALI_DATE_FORMAT = "jDD/jMMMM/jYYYY";

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

const RULE_FILTERS = [
  { key: "party", title: _STRINGS.PARTY },
  { key: "pet", title: _STRINGS.PET },
];

const LEADING_DYNAMIC_KEY = "PROPERTY_TYPE";

const SelectedFiltersBar = ({
  query,
  propertyTypes,
  containerClass,
  cityWithRegions,
  setShowRegions,
  setFilterModalShow,
}: SelectedFiltersBarProps) => {
  const replaceQuery = useDiscoveryQueryReplace();
  const regionsIds = parseIdList(query?.regions);
  const filterOrder = parseFilterOrder(query?.[FILTER_ORDER_PARAM]);

  const removeFiltersKeys = useCallback(
    (keys: string[]) => {
      const body: Record<string, unknown> = { ...query };
      for (const key of keys) delete body[key];
      replaceQuery(body);
    },
    [query, replaceQuery],
  );

  const setFilterValue = (key: string, value: unknown) => {
    const body: Record<string, unknown> = { ...query };
    if (value) body[key] = value;
    else delete body[key];
    replaceQuery(body);
  };

  const dynamicKeys = Object.keys(propertyTypes)
    .filter((key) => !["PARTY", "PET"].includes(key))
    .sort(
      (left, right) =>
        filterOrderRank(sortDynamicFiltersInOrder, left) -
        filterOrderRank(sortDynamicFiltersInOrder, right),
    );

  const regionTitles = (cityWithRegions?.child ?? [])
    .filter((region) => regionsIds.includes(`${region?.id}`))
    .map((region) => region?.title)
    .filter((title): title is string => !!title);

  const renderDynamicChip = (key: string) => ({
    key: key.toLowerCase(),
    node: (
      <SwiperSlide className="!w-auto" key={`dynamic-${key}`}>
        <SelectiveFilterChip
          queryKey={key.toLowerCase()}
          removeFiltersKeys={removeFiltersKeys}
          list={propertyTypes?.[key.toUpperCase()]}
          title={
            (_STRINGS as Record<string, string>)?.[key.toUpperCase()] || ""
          }
        />
      </SwiperSlide>
    ),
  });

  const chips: { key: string; node: ReactNode }[] = [];

  if (!isEmpty(cityWithRegions?.child))
    chips.push({
      key: "regions",
      node: (
        <SwiperSlide key="selected-regions" className="!w-auto flex">
          <RegionButton
            containerClass=""
            regionsIds={regionsIds}
            regionTitles={regionTitles}
            setShowRegions={setShowRegions}
            onClearRegions={() => removeFiltersKeys(["regions"])}
          />
        </SwiperSlide>
      ),
    });

  if (query?.total_bedrooms)
    chips.push({
      key: "total_bedrooms",
      node: (
        <SwiperSlide key="selected-bedrooms" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["total_bedrooms"])}
            label={`${_STRINGS.ROOM_COUNT} : ${query?.total_bedrooms}`}
          />
        </SwiperSlide>
      ),
    });

  if (query?.total_guests)
    chips.push({
      key: "total_guests",
      node: (
        <SwiperSlide key="selected-guests" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["total_guests"])}
            label={`${_STRINGS.PPL_COUNT} : ${query?.total_guests}`}
          />
        </SwiperSlide>
      ),
    });

  if (query?.checkout && query?.checkin)
    chips.push({
      key: "checkin",
      node: (
        <SwiperSlide key="selected-date" className="!w-auto">
          <RemovableFilterChip
            onRemove={() => removeFiltersKeys(["checkout", "checkin"])}
            label={`${_STRINGS.FROM} ${moment(query?.checkin).format(JALALI_DATE_FORMAT)} ${_STRINGS.TO} ${moment(query?.checkout).format(JALALI_DATE_FORMAT)}`}
          />
        </SwiperSlide>
      ),
    });

  if (query?.max_commission || query?.min_commission)
    chips.push({
      key: "min_commission",
      node: (
        <SwiperSlide key="selected-commission" className="!w-auto">
          <RemovableFilterChip
            onRemove={() =>
              removeFiltersKeys(["max_commission", "min_commission"])
            }
            label={rangeLabel(
              _STRINGS.COMMIS_JUST_PERC,
              query?.min_commission,
              query?.max_commission,
              "%",
            )}
          />
        </SwiperSlide>
      ),
    });

  if (query?.max_price || query?.min_price)
    chips.push({
      key: "min_price",
      node: (
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
      ),
    });

  if (query?.max_building_area || query?.min_building_area)
    chips.push({
      key: "min_building_area",
      node: (
        <SwiperSlide key="selected-area" className="!w-auto">
          <RemovableFilterChip
            onRemove={() =>
              removeFiltersKeys(["max_building_area", "min_building_area"])
            }
            label={rangeLabel(
              _STRINGS.ROOM_SIZE,
              query?.min_building_area,
              query?.max_building_area,
              _STRINGS.METER,
            )}
          />
        </SwiperSlide>
      ),
    });

  if (query?.has_discount === "1")
    chips.push({
      key: "has_discount",
      node: (
        <SwiperSlide key="selected-discount" className="!w-auto">
          <RemovableFilterChip
            label={_STRINGS.HAS_DISCOUNT}
            onRemove={() => removeFiltersKeys(["has_discount"])}
          />
        </SwiperSlide>
      ),
    });

  if (query?.is_premium === "1")
    chips.push({
      key: "is_premium",
      node: (
        <SwiperSlide key="selected-premium" className="!w-auto">
          <RemovableFilterChip
            label={_STRINGS.PERMIUM_PROPS}
            onRemove={() => removeFiltersKeys(["is_premium"])}
          />
        </SwiperSlide>
      ),
    });

  for (const rule of RULE_FILTERS.filter((entry) => query?.[entry.key]))
    chips.push({
      key: rule.key,
      node: (
        <SwiperSlide key={`selected-${rule.key}`} className="!w-auto">
          <RemovableFilterChip
            label={rule.title}
            onRemove={() => removeFiltersKeys([rule.key])}
          />
        </SwiperSlide>
      ),
    });

  chips.push(
    ...dynamicKeys
      .filter((key) => key === LEADING_DYNAMIC_KEY)
      .map(renderDynamicChip),
  );

  chips.push({
    key: "has_pool",
    node: (
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
    ),
  });

  chips.push(
    ...dynamicKeys
      .filter((key) => key !== LEADING_DYNAMIC_KEY)
      .map(renderDynamicChip),
  );

  const orderedChips = chips
    .map((chip, index) => ({ ...chip, index }))
    .sort(
      (left, right) =>
        filterOrderRank(filterOrder, left.key) -
          filterOrderRank(filterOrder, right.key) || left.index - right.index,
    );

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

      {orderedChips.map((chip) => chip.node)}
    </Swiper>
  );
};

export default SelectedFiltersBar;
