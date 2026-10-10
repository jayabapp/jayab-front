"use client";

import { sortDynamicFiltersInOrder } from "@/utils/constantss";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { zero_filter_remove_keys } from "@/utils/constantss";
import { useCallback, useState } from "react";
import { FILTER_ORDER_PARAM } from "@features/properties/lib/filter-order";
import { parseFilterOrder } from "@features/properties/lib/filter-order";
import { useTranslations } from "next-intl";
import { filterOrderRank } from "@features/properties/lib/filter-order";
import { RegionButton } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import { parseIdList } from "@features/cities/lib/city-selection";

import type { SelectedFiltersBarProps } from "@/types/components/modules/property-search-filters";
import type { ReactNode } from "react";

import SearchDateRangePicker from "./parts/DateRangePicker/SearchDateRangePicker.client";
import SelectiveFilterChip from "./parts/SelectiveFilterChip.client";
import RemovableFilterChip from "./parts/RemovableFilterChip";
import numberWithCommas from "@/helpers/numberWithCommas";
import updateDateRange from "./parts/DateRangePicker/updateDateRange";
import FilterCounter from "./parts/FilterCounter.client";
import SwiperSlide from "@elements/Carousel/SwiperSlide";
import isEmpty from "lodash/isEmpty";
import Swiper from "@elements/Carousel/Swiper.client";
import moment from "moment-jalaali";
import Modal from "@elements/Modal";

const JALALI_DATE_FORMAT = "jDD/jMMMM/jYYYY";
const JALALI_INPUT_DATE_FORMAT = "jYYYY/jMM/jD";

const rangeLabel = (
  title: string,
  lower: string | undefined,
  higher: string | undefined,
  unit: string,
  words: { from: string; to: string },
) => {
  const from = lower ? `${words.from} ${numberWithCommas(lower)}` : "";
  const to = higher ? `${words.to} ${numberWithCommas(higher)}` : "";
  return `${title} ${[from, to].filter(Boolean).join(" ")} ${unit}`.trim();
};

const RULE_FILTERS = [
  { key: "party", title: "listing.party" },
  { key: "pet", title: "listing.pet" },
] as const;

const DYNAMIC_FILTER_TITLES = {
  PROPERTY_TYPE: "common.propertyType",
  POOL_TYPE: "common.poolType",
  PATTERN: "common.envPattern",
  ENTERTAINMENT: "common.entertainment",
  WELFARE: "common.welfare",
  COOL_HEAT: "common.coolHeat",
  KITCHEN: "listing.kitchen",
  OWNERSHIP: "listing.ownership",
} as const;

const LEADING_DYNAMIC_KEY = "PROPERTY_TYPE";

const SelectedFiltersBar = ({
  query,
  propertyTypes,
  containerClass,
  cityWithRegions,
  setShowRegions,
  setFilterModalShow,
}: SelectedFiltersBarProps) => {
  const t = useTranslations();

  const replaceQuery = useDiscoveryQueryReplace();
  const regionsIds = parseIdList(query?.regions);
  const filterOrder = parseFilterOrder(query?.[FILTER_ORDER_PARAM]);

  const [dateEditorOpen, setDateEditorOpen] = useState(false);
  const [guestEditorOpen, setGuestEditorOpen] = useState(false);

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

  const setQueryFilters = useCallback(
    (
      next:
        | Record<string, unknown>
        | ((current: Record<string, unknown>) => Record<string, unknown>),
    ) => {
      const body: Record<string, unknown> = {
        ...(typeof next === "function" ? next(query ?? {}) : next),
      };
      for (const key of zero_filter_remove_keys) {
        if (body?.[key] === 0 || body?.[key] === "0") delete body[key];
      }
      replaceQuery(body);
    },
    [query, replaceQuery],
  );

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
            Object.hasOwn(DYNAMIC_FILTER_TITLES, key.toUpperCase())
              ? t(
                  DYNAMIC_FILTER_TITLES[
                    key.toUpperCase() as keyof typeof DYNAMIC_FILTER_TITLES
                  ],
                )
              : ""
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
            label={`${t("listing.roomCount")} : ${query?.total_bedrooms}`}
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
            onLabelClick={() => setGuestEditorOpen(true)}
            label={`${t("common.pplCount")} : ${query?.total_guests}`}
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
            onLabelClick={() => setDateEditorOpen(true)}
            label={`${t("common.from")} ${moment(query?.checkin).format(JALALI_DATE_FORMAT)} ${t("common.to")} ${moment(query?.checkout).format(JALALI_DATE_FORMAT)}`}
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
              t("listing.commisJustPerc"),
              query?.min_commission,
              query?.max_commission,
              "%",
              { from: t("common.from"), to: t("common.to") },
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
              t("common.price"),
              query?.min_price,
              query?.max_price,
              t("common.toman"),
              { from: t("common.from"), to: t("common.to") },
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
              t("listing.roomSize"),
              query?.min_building_area,
              query?.max_building_area,
              t("common.meter"),
              { from: t("common.from"), to: t("common.to") },
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
            label={t("listing.hasDiscount")}
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
            label={t("listing.permiumProps")}
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
            {query?.has_pool === "0"
              ? t("listing.noPool")
              : t("listing.hasPool")}
          </span>
          {query?.has_pool ? (
            <span
              role="button"
              tabIndex={0}
              aria-label={`${t("common.removeFilters")} ${t("listing.hasPool")}`}
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
              className="flex aspect-square h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-action"
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
    <>
      <Swiper autoFit parentClass={containerClass}>
        <SwiperSlide className="z-5 flex lg:hidden !w-auto">
          <button
            type="button"
            onClick={() => setFilterModalShow(true)}
            className="col-span-3 flex w-fit px-3 h-[1.625rem] rounded-full bg-action items-center gap-2"
          >
            <ContentImage
              alt=""
              width={12}
              height={12}
              className="cursor-pointer w-3 h-3 shrink-0"
              src="/assets/icons/property/white_filter_icon.svg"
            />
            <span className="text-white text-xs">
              {t("listing.otherFilters")}
            </span>
          </button>
        </SwiperSlide>

        {orderedChips.map((chip) => chip.node)}
      </Swiper>

      <Modal show={dateEditorOpen} onHide={() => setDateEditorOpen(false)}>
        <SearchDateRangePicker
          setSelectedDay={(day) =>
            updateDateRange({
              date: day,
              cb: () => setDateEditorOpen(false),
              state: query,
              setState: setQueryFilters,
            })
          }
          selectedDates={{
            endDate: query?.checkout
              ? moment(query.checkout).format(JALALI_INPUT_DATE_FORMAT)
              : null,
            startDate: query?.checkin
              ? moment(query.checkin).format(JALALI_INPUT_DATE_FORMAT)
              : null,
          }}
        />
      </Modal>

      <Modal show={guestEditorOpen} onHide={() => setGuestEditorOpen(false)}>
        <div className="flex w-full flex-col gap-3 p-4">
          <FilterCounter
            query={query}
            mobileFilters={query}
            queryKey="total_guests"
            title={t("common.pplCount")}
            setMobileFilters={setQueryFilters}
          />
          <button
            type="button"
            onClick={() => setGuestEditorOpen(false)}
            className="filter-chip filter-chip-active w-full items-center justify-center"
          >
            {t("common.confirmGuests")}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default SelectedFiltersBar;
