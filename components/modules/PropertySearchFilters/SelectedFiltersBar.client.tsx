"use client";

import { sortDynamicFiltersInOrder } from "@/utils/constantss";
import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { useCallback, useState } from "react";
import { extraDiscoveryFilters } from "@features/properties/lib/discovery-filter-policy";
import { useDiscoveryBaseline } from "@features/properties/context/DiscoveryContext";
import { countActiveFilters } from "@features/properties/lib/count-active-filters";
import { countFilterGroup } from "@features/properties/lib/count-active-filters";
import { orderFilterChips } from "@features/properties/lib/filter-order";
import { filterOrderRank } from "@features/properties/lib/filter-order";
import { useTranslations } from "next-intl";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { getRuleOptions } from "@features/properties/lib/rule-options";
import { tripDateLabel } from "@features/properties/lib/trip-date-label";
import { RegionButton } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import { PRICE_RANGE } from "@features/properties/constants/filter-ranges";
import { parseIdList } from "@features/cities/lib/city-selection";
import { AREA_RANGE } from "@features/properties/constants/filter-ranges";
import { useMapArea } from "@features/properties/hooks/useMapArea";
import { Icon } from "@elements/Icon";

import type { SelectedFiltersBarProps } from "@/types/components/modules/property-search-filters";
import type { OrderedFilterChip } from "@/types/components/modules/property-search-filters";
import type { ReactNode } from "react";

import SearchDateRangePicker from "./parts/DateRangePicker/SearchDateRangePicker.client";
import SelectiveFilterChip from "./parts/SelectiveFilterChip.client";
import RemovableFilterChip from "./parts/RemovableFilterChip";
import FilterEditorChip from "./parts/FilterEditorChip.client";
import { FilterEditorBody } from "./parts/FilterEditorChip.client";
import RulesFilterChip from "./parts/RulesFilterChip.client";
import RangeFilterChip from "./parts/RangeFilterChip.client";
import updateDateRange from "./parts/DateRangePicker/updateDateRange";
import TripFilterPill from "./parts/TripFilterPill.client";
import FilterCounter from "./parts/FilterCounter.client";
import SwiperSlide from "@elements/Carousel/SwiperSlide";
import isEmpty from "lodash/isEmpty";
import Swiper from "@elements/Carousel/Swiper.client";
import moment from "moment-jalaali";
import Modal from "@elements/Modal";

const JALALI_INPUT_DATE_FORMAT = "jYYYY/jMM/jD";

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

const TRIP_KEYS = ["checkin", "checkout", "total_guests"] as const;

const SelectedFiltersBar = ({
  query,
  propertyTypes,
  containerClass,
  setShowRegions,
  cityWithRegions,
  setFilterModalShow,
}: SelectedFiltersBarProps) => {
  const t = useTranslations();
  const jalali = useJalaliFormat();
  const formatNumber = useFormatNumber();

  const baseline = useDiscoveryBaseline();
  const replaceQuery = useDiscoveryQueryReplace();
  const { rawArea, clearArea } = useMapArea();

  const [dateEditorOpen, setDateEditorOpen] = useState(false);
  const [guestEditorOpen, setGuestEditorOpen] = useState(false);

  const extra = extraDiscoveryFilters(query, baseline);
  const regionsIds = parseIdList(extra.regions as string | undefined);

  const removeFiltersKeys = useCallback(
    (keys: readonly string[]) => {
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

  const isLocked = (keys: readonly string[]) =>
    keys.some((key) => baseline[key] !== undefined);
  const isActive = (keys: readonly string[]) =>
    countFilterGroup(extra, keys) > 0;

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

  const slide = (id: string, node: ReactNode, className = "!w-auto") => (
    <SwiperSlide key={id} className={className}>
      {node}
    </SwiperSlide>
  );

  const dynamicChip = (key: string): OrderedFilterChip => {
    const queryKey = key.toLowerCase();
    return {
      id: key,
      queryKeys: [queryKey],
      active: parseIdList(extra[queryKey] as string | undefined).length > 0,
      node: slide(
        `dynamic-${key}`,
        <SelectiveFilterChip
          queryKey={queryKey}
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
        />,
      ),
    };
  };

  const hasPoolSelection = extra.has_pool === "0" || extra.has_pool === "1";
  const hasRules =
    getRuleOptions(propertyTypes, { party: "", pet: "" }).length > 0;

  const chips: OrderedFilterChip[] = [
    {
      id: "trip",
      queryKeys: TRIP_KEYS,
      active: isActive(TRIP_KEYS),
      node: slide(
        "trip",
        <TripFilterPill
          dateLabel={
            extra.checkin && extra.checkout
              ? tripDateLabel(
                  String(extra.checkin),
                  String(extra.checkout),
                  t("common.to"),
                  jalali,
                )
              : null
          }
          guestLabel={
            extra.total_guests
              ? t("common.people", { count: Number(extra.total_guests) })
              : null
          }
          onDateClick={() => setDateEditorOpen(true)}
          onGuestClick={() => setGuestEditorOpen(true)}
          onClearDate={() => removeFiltersKeys(["checkout", "checkin"])}
          onClearGuests={() => removeFiltersKeys(["total_guests"])}
        />,
      ),
    },
  ];

  // Where the search happens, taking the place of a named city.
  if (rawArea)
    chips.push({
      id: "map-area",
      queryKeys: ["bbox"],
      active: true,
      node: slide(
        "map-area",
        <RemovableFilterChip
          onRemove={clearArea}
          label={t("listing.mapArea")}
        />,
      ),
    });

  if (!isEmpty(cityWithRegions?.child))
    chips.push({
      id: "regions",
      queryKeys: ["regions"],
      active: regionsIds.length > 0,
      node: slide(
        "regions",
        <RegionButton
          regionsIds={regionsIds}
          regionTitles={regionTitles}
          setShowRegions={setShowRegions}
          onClearRegions={() => removeFiltersKeys(["regions"])}
        />,
        "!w-auto flex",
      ),
    });

  const propertyTypeKey = dynamicKeys.find((key) => key === "PROPERTY_TYPE");
  if (propertyTypeKey && !isLocked(["property_type"]))
    chips.push(dynamicChip(propertyTypeKey));

  const priceKeys = [PRICE_RANGE.lowerKey, PRICE_RANGE.higherKey];
  if (!isLocked(priceKeys))
    chips.push({
      id: "price",
      queryKeys: priceKeys,
      active: isActive(priceKeys),
      node: slide(
        "price",
        <RangeFilterChip
          icon="wallet"
          unit={t("common.toman")}
          steps={PRICE_RANGE.step}
          upLimit={PRICE_RANGE.max}
          labelTitle={t("common.price")}
          lowerKey={PRICE_RANGE.lowerKey}
          title={t("listing.priceRange")}
          higherKey={PRICE_RANGE.higherKey}
        />,
      ),
    });

  if (!isLocked(["total_bedrooms"]))
    chips.push({
      id: "bedrooms",
      queryKeys: ["total_bedrooms"],
      active: isActive(["total_bedrooms"]),
      node: slide(
        "bedrooms",
        <FilterEditorChip
          icon="bed"
          panelClass="w-72"
          keys={["total_bedrooms"]}
          title={t("listing.roomCount")}
          label={`${t("listing.roomCount")} : ${extra.total_bedrooms}`}
          renderEditor={(draft, setDraft) => (
            <FilterCounter
              mobileFilters={draft}
              queryKey="total_bedrooms"
              setMobileFilters={setDraft}
              title={t("listing.roomCount")}
            />
          )}
        />,
      ),
    });

  const areaKeys = [AREA_RANGE.lowerKey, AREA_RANGE.higherKey];
  if (!isLocked(areaKeys))
    chips.push({
      id: "area",
      queryKeys: areaKeys,
      active: isActive(areaKeys),
      node: slide(
        "area",
        <RangeFilterChip
          icon="ruler"
          steps={AREA_RANGE.step}
          upLimit={AREA_RANGE.max}
          unit={t("common.meter")}
          title={t("listing.roomSize")}
          lowerKey={AREA_RANGE.lowerKey}
          higherKey={AREA_RANGE.higherKey}
        />,
      ),
    });

  if (!isLocked(["has_pool"]))
    chips.push({
      id: "pool",
      queryKeys: ["has_pool"],
      active: hasPoolSelection,
      node: slide(
        "pool",
        <span
          className={`filter-chip ${hasPoolSelection ? "filter-chip-active" : "filter-chip-idle"}`}
        >
          <button
            type="button"
            aria-pressed={hasPoolSelection}
            className="flex h-full cursor-pointer items-center gap-1.5"
            onClick={() =>
              hasPoolSelection
                ? removeFiltersKeys(["has_pool"])
                : setFilterValue("has_pool", 1)
            }
          >
            <Icon name="pool" size={20} className="text-link" />
            <span>
              {extra.has_pool === "0"
                ? t("listing.noPool")
                : t("listing.hasPool")}
            </span>
          </button>
          {hasPoolSelection ? (
            <button
              type="button"
              onClick={() => removeFiltersKeys(["has_pool"])}
              aria-label={t("listing.removeFilterNamed", {
                title: t("listing.hasPool"),
              })}
              className="flex size-5 cursor-pointer items-center justify-center rounded-full border border-action"
            >
              <Icon name="x" size={16} />
            </button>
          ) : null}
        </span>,
      ),
    });

  for (const key of dynamicKeys.filter((entry) => entry !== "PROPERTY_TYPE"))
    if (!isLocked([key.toLowerCase()])) chips.push(dynamicChip(key));

  if (hasRules && !isLocked(["party", "pet"]))
    chips.push({
      id: "rules",
      queryKeys: ["party", "pet"],
      active: isActive(["party", "pet"]),
      node: slide("rules", <RulesFilterChip propertyTypes={propertyTypes} />),
    });

  if (extra.max_commission || extra.min_commission)
    chips.push({
      id: "commission",
      queryKeys: ["min_commission", "max_commission"],
      active: true,
      node: slide(
        "commission",
        <RemovableFilterChip
          onRemove={() =>
            removeFiltersKeys(["max_commission", "min_commission"])
          }
          label={[
            t("listing.commisJustPerc"),
            extra.min_commission
              ? `${t("common.from")} ${formatNumber(String(extra.min_commission))}`
              : "",
            extra.max_commission
              ? `${t("common.to")} ${formatNumber(String(extra.max_commission))}`
              : "",
            "%",
          ]
            .filter(Boolean)
            .join(" ")}
        />,
      ),
    });

  const activeCount = countActiveFilters(extra);

  return (
    <>
      <Swiper
        autoFit
        edgeArrows
        parentClass={`chip-row-fade discovery-filter-chips ${containerClass ?? ""}`}
      >
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
              className="size-3.5 shrink-0"
              src="/assets/icons/property/white_filter_icon.svg"
            />
            <span>{t("listing.otherFilters")}</span>
            {activeCount ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-on-action px-1 text-2xs font-bold text-action">
                {formatNumber(activeCount)}
              </span>
            ) : null}
          </button>
        </SwiperSlide>

        {orderFilterChips(chips, query).map(({ node }) => node)}
      </Swiper>

      <Modal show={dateEditorOpen} onHide={() => setDateEditorOpen(false)}>
        <div className="p-4">
          <FilterEditorBody
            keys={["checkin", "checkout"]}
            isValid={(draft) =>
              (!draft.checkin && !draft.checkout) ||
              Boolean(draft.checkin && draft.checkout)
            }
            onDone={() => setDateEditorOpen(false)}
            renderEditor={(draft, setDraft) => (
              <SearchDateRangePicker
                setSelectedDay={(day) =>
                  updateDateRange({
                    date: day,
                    state: draft,
                    setState: setDraft,
                  })
                }
                selectedDates={{
                  endDate: draft.checkout
                    ? moment(String(draft.checkout)).format(
                        JALALI_INPUT_DATE_FORMAT,
                      )
                    : null,
                  startDate: draft.checkin
                    ? moment(String(draft.checkin)).format(
                        JALALI_INPUT_DATE_FORMAT,
                      )
                    : null,
                }}
              />
            )}
          />
        </div>
      </Modal>

      <Modal show={guestEditorOpen} onHide={() => setGuestEditorOpen(false)}>
        <div className="flex w-full flex-col gap-3 p-4">
          <FilterEditorBody
            keys={["total_guests"]}
            onDone={() => setGuestEditorOpen(false)}
            renderEditor={(draft, setDraft) => (
              <FilterCounter
                mobileFilters={draft}
                queryKey="total_guests"
                title={t("common.pplCount")}
                setMobileFilters={setDraft}
              />
            )}
          />
        </div>
      </Modal>
    </>
  );
};

export default SelectedFiltersBar;
