"use client";

import { sortDynamicFiltersInOrder } from "@/utils/constantss";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { zero_filter_remove_keys } from "@/utils/constantss";
import { useCallback, useState } from "react";
import { countActiveFilters } from "@features/properties/lib/count-active-filters";
import { useTranslations } from "next-intl";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { filterOrderRank } from "@features/properties/lib/filter-order";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { RegionButton } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import { parseIdList } from "@features/cities/lib/city-selection";
import { Icon } from "@elements/Icon";

import type { SelectedFiltersBarProps } from "@/types/components/modules/property-search-filters";
import type { ReactNode } from "react";

import SearchDateRangePicker from "./parts/DateRangePicker/SearchDateRangePicker.client";
import SelectiveFilterChip from "./parts/SelectiveFilterChip.client";
import RemovableFilterChip from "./parts/RemovableFilterChip";
import updateDateRange from "./parts/DateRangePicker/updateDateRange";
import TripFilterPill from "./parts/TripFilterPill.client";
import FilterCounter from "./parts/FilterCounter.client";
import SwiperSlide from "@elements/Carousel/SwiperSlide";
import isEmpty from "lodash/isEmpty";
import Swiper from "@elements/Carousel/Swiper.client";
import moment from "moment-jalaali";
import Modal from "@elements/Modal";

const TRIP_DATE_FORMAT = "jD jMMMM";
const JALALI_INPUT_DATE_FORMAT = "jYYYY/jMM/jD";

const rangeLabel = (
  title: string,
  lower: string | undefined,
  higher: string | undefined,
  unit: string,
  words: { from: string; to: string },
  format: (value: string) => string,
) => {
  const from = lower ? `${words.from} ${format(lower)}` : "";
  const to = higher ? `${words.to} ${format(higher)}` : "";
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
  KITCHEN: "common.kitchenAcc",
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
  const jalali = useJalaliFormat();
  const formatNumber = useFormatNumber();

  const replaceQuery = useDiscoveryQueryReplace();
  const regionsIds = parseIdList(query?.regions);

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

  const renderDynamicChip = (key: string) => (
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
  );

  // Filters set elsewhere (sidebar, sheet, URL) show up after the fixed set so they can be seen and cleared.
  const appliedChips: ReactNode[] = [];

  if (!isEmpty(cityWithRegions?.child))
    appliedChips.push(
      <SwiperSlide key="selected-regions" className="!w-auto flex">
        <RegionButton
          containerClass=""
          regionsIds={regionsIds}
          regionTitles={regionTitles}
          setShowRegions={setShowRegions}
          onClearRegions={() => removeFiltersKeys(["regions"])}
        />
      </SwiperSlide>,
    );

  if (query?.total_bedrooms)
    appliedChips.push(
      <SwiperSlide key="selected-bedrooms" className="!w-auto">
        <RemovableFilterChip
          onRemove={() => removeFiltersKeys(["total_bedrooms"])}
          label={`${t("listing.roomCount")} : ${query?.total_bedrooms}`}
        />
      </SwiperSlide>,
    );

  if (query?.max_commission || query?.min_commission)
    appliedChips.push(
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
            formatNumber,
          )}
        />
      </SwiperSlide>,
    );

  if (query?.max_price || query?.min_price)
    appliedChips.push(
      <SwiperSlide key="selected-price" className="!w-auto">
        <RemovableFilterChip
          onRemove={() => removeFiltersKeys(["max_price", "min_price"])}
          label={rangeLabel(
            t("common.price"),
            query?.min_price,
            query?.max_price,
            t("common.toman"),
            { from: t("common.from"), to: t("common.to") },
            formatNumber,
          )}
        />
      </SwiperSlide>,
    );

  if (query?.max_building_area || query?.min_building_area)
    appliedChips.push(
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
            formatNumber,
          )}
        />
      </SwiperSlide>,
    );

  if (query?.has_discount === "1")
    appliedChips.push(
      <SwiperSlide key="selected-discount" className="!w-auto">
        <RemovableFilterChip
          label={t("listing.hasDiscount")}
          onRemove={() => removeFiltersKeys(["has_discount"])}
        />
      </SwiperSlide>,
    );

  if (query?.is_premium === "1")
    appliedChips.push(
      <SwiperSlide key="selected-premium" className="!w-auto">
        <RemovableFilterChip
          label={t("listing.permiumProps")}
          onRemove={() => removeFiltersKeys(["is_premium"])}
        />
      </SwiperSlide>,
    );

  for (const rule of RULE_FILTERS.filter((entry) => query?.[entry.key]))
    appliedChips.push(
      <SwiperSlide key={`selected-${rule.key}`} className="!w-auto">
        <RemovableFilterChip
          label={t(rule.title)}
          onRemove={() => removeFiltersKeys([rule.key])}
        />
      </SwiperSlide>,
    );

  const activeCount = countActiveFilters(query);

  return (
    <>
      <Swiper autoFit edgeArrows parentClass={`chip-row-fade ${containerClass ?? ""}`}>
        <SwiperSlide className="z-5 flex !w-auto">
          <button
            type="button"
            onClick={() => setFilterModalShow(true)}
            className="filter-chip filter-chip-primary"
          >
            <ContentImage
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
              src="/assets/icons/property/white_filter_icon.svg"
            />
            <span>{t("listing.otherFilters")}</span>
            {activeCount ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-on-action px-1.5 text-xs font-bold text-action">
                {formatNumber(activeCount)}
              </span>
            ) : null}
          </button>
        </SwiperSlide>

        <SwiperSlide className="!w-auto">
          <TripFilterPill
            dateLabel={
              query?.checkin && query?.checkout
                ? `${jalali(query.checkin, TRIP_DATE_FORMAT)} ${t("common.to")} ${jalali(query.checkout, TRIP_DATE_FORMAT)}`
                : null
            }
            guestLabel={
              query?.total_guests
                ? t("common.people", { count: Number(query.total_guests) })
                : null
            }
            onDateClick={() => setDateEditorOpen(true)}
            onGuestClick={() => setGuestEditorOpen(true)}
            onClearDate={() => removeFiltersKeys(["checkout", "checkin"])}
            onClearGuests={() => removeFiltersKeys(["total_guests"])}
          />
        </SwiperSlide>

        {dynamicKeys
          .filter((key) => key === LEADING_DYNAMIC_KEY)
          .map(renderDynamicChip)}

        <SwiperSlide key="selected-pool" className="!w-auto">
          <button
            type="button"
            aria-pressed={!!query?.has_pool}
            onClick={() =>
              query?.has_pool
                ? removeFiltersKeys(["has_pool"])
                : setFilterValue("has_pool", 1)
            }
            className={`filter-chip ${query?.has_pool ? "filter-chip-active" : "filter-chip-idle"}`}
          >
            <Icon name="pool" size={20} className="text-link" />
            <span>
              {query?.has_pool === "0"
                ? t("listing.noPool")
                : t("listing.hasPool")}
            </span>
            {query?.has_pool ? (
              <Icon name="check" size={16} className="text-link" />
            ) : null}
          </button>
        </SwiperSlide>

        {dynamicKeys
          .filter((key) => key !== LEADING_DYNAMIC_KEY)
          .map(renderDynamicChip)}

        {appliedChips}
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
