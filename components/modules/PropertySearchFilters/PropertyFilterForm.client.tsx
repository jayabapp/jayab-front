"use client";

import { countActiveFilters, countFilterGroup } from "@features/properties/lib/count-active-filters";
import type { PropertyFilterFormProps } from "@/types/components/modules/property-search-filters";
import { poolFilterTypes } from "@/utils/constantss";
import { useStoreInit } from "@/store";

import PriceRangeFilter from "./parts/PriceRangeFilter.client";
import PropertyModelFilter from "./PropertyModelFilter.client";
import PropertyRulesFilter from "./parts/PropertyRulesFilter";
import FilterPanelHeader from "./parts/FilterPanelHeader";
import numberWithCommas from "@/helpers/numberWithCommas";
import FilterCounter from "./parts/FilterCounter.client";
import FilterSection from "./parts/FilterSection.client";
import FilterCheck from "./parts/FilterCheck.client";
import DateFilter from "./parts/DateFilter.client";
import _STRINGS from "@/utils/LocalStrings";

const COMMISSION_MAX = 50;
const PRICE_MAX = 40000000;
const AREA_MAX = 1000;

/**
 * The filter panel, shared by the desktop sidebar and the mobile sheet.
 *
 * Ordered by how often a filter actually decides a booking rather than by the
 * shape of the API: type, then price, then who is coming and when. The long
 * amenity lists sit below that, because a visitor who cares about the kind of
 * kitchen has already narrowed by the three things above.
 *
 * Every edit lands in a draft; nothing here writes the URL. What makes that
 * bearable is `FilterApplyBar`, which keeps a live count of what the draft
 * would return.
 */
const PropertyFilterForm = ({
  filters,
  hiddenFilters = [],
  onReset,
  propertyTypes,
  queries,
  setFilters,
}: PropertyFilterFormProps) => {
  const { userInfo } = useStoreInit((data) => data);
  const isHidden = (key: string) => hiddenFilters.includes(key);
  const activeCount = countActiveFilters(filters, hiddenFilters);

  // Read from the draft, not from `queries`. Reading the URL here meant that
  // choosing "بدون استخر" left the pool-type list on screen until the filters
  // were submitted, so the user could pick a pool type for a property they had
  // just said must not have a pool, and both went to the API together.
  const excludesPool = `${filters?.has_pool ?? ""}` === "0";

  return (
    <div className="flex w-full flex-col px-3">
      {/* Pinned to the top of whichever container is scrolling — the desktop
          sidebar or the mobile sheet. The active count and the reset are the two
          things a user reaches for after scrolling deep into the amenity lists,
          which is exactly where a header that scrolls away is out of reach. */}
      {onReset ? (
        <div className="sticky top-0 z-1 bg-white pt-3">
          <FilterPanelHeader activeCount={activeCount} onReset={onReset} />
        </div>
      ) : (
        <div className="pt-3" />
      )}

      {isHidden("property_type") ? (
        <></>
      ) : (
        <FilterSection
          defaultOpen
          title={_STRINGS.PROPERTY_TYPE}
          count={countFilterGroup(filters, ["property_type"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            mobileFilters={filters}
            queryKey="property_type"
            setMobileFilters={setFilters}
            list={propertyTypes?.PROPERTY_TYPE || []}
          />
        </FilterSection>
      )}

      <FilterSection
        defaultOpen
        title={_STRINGS.PRICE_RANGE}
        count={filters?.min_price || filters?.max_price ? 1 : 0}
      >
        <div className="flex w-full flex-col gap-4 pb-2 pt-1">
          <p className="text-xs text-neutral-600">
            {_STRINGS.FROM} {numberWithCommas(filters?.min_price || 0)}{" "}
            {_STRINGS.TO} {numberWithCommas(filters?.max_price || PRICE_MAX)}{" "}
            {_STRINGS.TOMAN}
          </p>
          <PriceRangeFilter
            lowLimit={0}
            steps={500000}
            upLimit={PRICE_MAX}
            filters={filters}
            lowerKey="min_price"
            higherKey="max_price"
            setFilters={setFilters}
          />
        </div>
      </FilterSection>

      <FilterSection
        defaultOpen
        title={_STRINGS.CAPACITY}
        count={countFilterGroup(filters, ["total_guests", "total_bedrooms"])}
      >
        {isHidden("total_guests") ? (
          <></>
        ) : (
          <FilterCounter
            query={queries}
            mobileFilters={filters}
            queryKey="total_guests"
            title={_STRINGS.PPL_COUNT}
            setMobileFilters={setFilters}
          />
        )}
        {isHidden("total_bedrooms") ? (
          <></>
        ) : (
          <FilterCounter
            query={queries}
            mobileFilters={filters}
            queryKey="total_bedrooms"
            title={_STRINGS.ROOM_COUNT}
            setMobileFilters={setFilters}
          />
        )}
      </FilterSection>

      <div className="w-full border-b border-neutral-100 py-1">
        <DateFilter filters={filters} setFilters={setFilters} />
      </div>

      <FilterSection
        title={_STRINGS.QUICK_FILTERS}
        defaultOpen
        count={countFilterGroup(filters, ["has_discount", "is_premium"])}
      >
        {isHidden("has_discount") ? (
          <></>
        ) : (
          <FilterCheck
            query={queries}
            queryKey="has_discount"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            title={_STRINGS.HAS_DISCOUNT}
          />
        )}
        {isHidden("is_premium") ? (
          <></>
        ) : (
          <FilterCheck
            withBadge
            query={queries}
            queryKey="is_premium"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            title={_STRINGS.PERMIUM_PROPS}
          />
        )}
      </FilterSection>

      {isHidden("has_pool") ? (
        <></>
      ) : (
        <FilterSection
          title={_STRINGS.POOL_STATUS}
          count={countFilterGroup(filters, ["has_pool", "pool_type"])}
        >
          <PropertyModelFilter
            query={queries}
            queryKey="has_pool"
            mobileFilters={filters}
            list={poolFilterTypes || []}
            setMobileFilters={setFilters}
          />
          {excludesPool || isHidden("pool_type") ? (
            <></>
          ) : (
            <div className="mt-2 border-t border-neutral-100 pt-2">
              <p className="pb-1 text-xs text-neutral-500">
                {_STRINGS.POOL_TYPE}
              </p>
              <PropertyModelFilter
                isMulty
                query={queries}
                queryKey="pool_type"
                mobileFilters={filters}
                setMobileFilters={setFilters}
                list={propertyTypes?.POOL_TYPE || []}
              />
            </div>
          )}
        </FilterSection>
      )}

      {isHidden("welfare") ? (
        <></>
      ) : (
        <FilterSection
          title={_STRINGS.WELFARE}
          count={countFilterGroup(filters, ["welfare"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="welfare"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.WELFARE || []}
          />
        </FilterSection>
      )}

      {isHidden("entertainment") ? (
        <></>
      ) : (
        <FilterSection
          title={_STRINGS.ENTERTAINMENT}
          count={countFilterGroup(filters, ["entertainment"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="entertainment"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.ENTERTAINMENT || []}
          />
        </FilterSection>
      )}

      {isHidden("kitchen") ? (
        <></>
      ) : (
        <FilterSection
          title={_STRINGS.KITCHEN_ACC}
          count={countFilterGroup(filters, ["kitchen"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="kitchen"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.KITCHEN || []}
          />
        </FilterSection>
      )}

      {isHidden("cool_heat") ? (
        <></>
      ) : (
        <FilterSection
          title={_STRINGS.COOL_HEAT}
          count={countFilterGroup(filters, ["cool_heat"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="cool_heat"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.COOL_HEAT || []}
          />
        </FilterSection>
      )}

      {isHidden("pattern") ? (
        <></>
      ) : (
        <FilterSection
          title={_STRINGS.ENV_PATTERN}
          count={countFilterGroup(filters, ["pattern"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="pattern"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.PATTERN || []}
          />
        </FilterSection>
      )}

      <FilterSection
        title={_STRINGS.ROOM_SIZE}
        count={
          filters?.min_building_area || filters?.max_building_area ? 1 : 0
        }
      >
        <div className="flex w-full flex-col gap-4 pb-2 pt-1">
          <p className="text-xs text-neutral-600">
            {_STRINGS.FROM} {numberWithCommas(filters?.min_building_area || 0)}{" "}
            {_STRINGS.TO}{" "}
            {numberWithCommas(filters?.max_building_area || AREA_MAX)}{" "}
            {_STRINGS.SQUARE_METER}
          </p>
          <PriceRangeFilter
            steps={50}
            lowLimit={0}
            upLimit={AREA_MAX}
            filters={filters}
            setFilters={setFilters}
            lowerKey="min_building_area"
            higherKey="max_building_area"
          />
        </div>
      </FilterSection>

      <PropertyRulesFilter
        filters={filters}
        queries={queries}
        setFilters={setFilters}
        propertyTypes={propertyTypes}
        hiddenFilters={hiddenFilters}
      />

      {userInfo?.advisor_id ? (
        <FilterSection
          title={_STRINGS.COMIISH_RANGE_PERC}
          count={filters?.min_commission || filters?.max_commission ? 1 : 0}
        >
          <div className="flex w-full flex-col gap-4 pb-2 pt-1">
            <p className="text-xs text-neutral-600">
              {_STRINGS.FROM} {numberWithCommas(filters?.min_commission || 0)}%{" "}
              {_STRINGS.TO}{" "}
              {numberWithCommas(filters?.max_commission || COMMISSION_MAX)}%
            </p>
            <PriceRangeFilter
              steps={5}
              lowLimit={0}
              filters={filters}
              upLimit={COMMISSION_MAX}
              setFilters={setFilters}
              lowerKey="min_commission"
              higherKey="max_commission"
            />
          </div>
        </FilterSection>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PropertyFilterForm;
