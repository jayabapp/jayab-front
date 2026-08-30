"use client";

import type { PropertyFilterFormProps } from "@/types/components/modules/property-search-filters";
import { poolFilterTypes } from "@/utils/constantss";
import { ContentImage } from "@elements/Image";
import { useStoreInit } from "@/store";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import PriceRangeFilter from "./parts/PriceRangeFilter.client";
import PropertyModelFilter from "./PropertyModelFilter.client";
import PropertyRulesFilter from "./parts/PropertyRulesFilter";
import numberWithCommas from "@/helpers/numberWithCommas";
import FilterCounter from "./parts/FilterCounter.client";
import FilterCheck from "./parts/FilterCheck.client";
import DateFilter from "./parts/DateFilter.client";
import _STRINGS from "@/utils/LocalStrings";

const ACCORDION_ITEM = {
  parenClass: "pb-4 border-b w-full p-2 !px-0",
  disableBorderB: true,
};
const COMMISSION_MAX = 50;
const PRICE_MAX = 40000000;
const AREA_MAX = 1000;

const PropertyFilterForm = ({
  filters,
  queries,
  setFilters,
  propertyTypes,
  hiddenFilters = [],
}: PropertyFilterFormProps) => {
  const { userInfo } = useStoreInit((data) => data);
  const isHidden = (key: string) => hiddenFilters.includes(key);

  return (
    <div className="z-2 h-fit flex-col items-center p-3 bg-white rounded-xl w-full">
      <div className="hidden md:flex items-center gap-2 mb-4">
        <ContentImage
          alt=""
          width={20}
          height={20}
          src="/assets/icons/property/filter_icon.svg"
        />
        <p className="font-medium text-lg">{_STRINGS.FILTERS}</p>
      </div>

      {isHidden("property_type") ? null : (
        <SimpleAccordion
          isOpenFirst
          item={ACCORDION_ITEM}
          title={_STRINGS.PROPERTY_TYPE}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            mobileFilters={filters}
            queryKey="property_type"
            setMobileFilters={setFilters}
            list={propertyTypes?.PROPERTY_TYPE || []}
          />
        </SimpleAccordion>
      )}

      {isHidden("has_pool") ? null : (
        <SimpleAccordion
          isOpenFirst
          item={ACCORDION_ITEM}
          title={_STRINGS.POOL_STATUS}
        >
          <PropertyModelFilter
            query={queries}
            queryKey="has_pool"
            mobileFilters={filters}
            list={poolFilterTypes || []}
            setMobileFilters={setFilters}
          />
        </SimpleAccordion>
      )}

      {queries?.has_pool === "0" || isHidden("pool_type") ? null : (
        <SimpleAccordion item={ACCORDION_ITEM} title={_STRINGS.POOL_TYPE}>
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="pool_type"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.POOL_TYPE || []}
          />
        </SimpleAccordion>
      )}

      {isHidden("total_bedrooms") ? null : (
        <FilterCounter
          query={queries}
          mobileFilters={filters}
          queryKey="total_bedrooms"
          title={_STRINGS.ROOM_COUNT}
          setMobileFilters={setFilters}
        />
      )}

      {isHidden("total_guests") ? null : (
        <FilterCounter
          query={queries}
          mobileFilters={filters}
          queryKey="total_guests"
          title={_STRINGS.PPL_COUNT}
          setMobileFilters={setFilters}
        />
      )}

      {isHidden("entertainment") ? null : (
        <SimpleAccordion item={ACCORDION_ITEM} title={_STRINGS.ENTERTAINMENT}>
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="entertainment"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.ENTERTAINMENT || []}
          />
        </SimpleAccordion>
      )}

      <DateFilter filters={filters} setFilters={setFilters} />

      {isHidden("has_discount") ? null : (
        <FilterCheck
          query={queries}
          queryKey="has_discount"
          mobileFilters={filters}
          setMobileFilters={setFilters}
          title={_STRINGS.HAS_DISCOUNT}
        />
      )}

      {isHidden("is_premium") ? null : (
        <FilterCheck
          withBadge
          query={queries}
          queryKey="is_premium"
          mobileFilters={filters}
          setMobileFilters={setFilters}
          title={_STRINGS.PERMIUM_PROPS}
        />
      )}

      {isHidden("pattern") ? null : (
        <SimpleAccordion item={ACCORDION_ITEM} title={_STRINGS.ENV_PATTERN}>
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="pattern"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.PATTERN || []}
          />
        </SimpleAccordion>
      )}

      {isHidden("welfare") ? null : (
        <SimpleAccordion item={ACCORDION_ITEM} title={_STRINGS.WELFARE}>
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="welfare"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.WELFARE || []}
          />
        </SimpleAccordion>
      )}

      {isHidden("cool_heat") ? null : (
        <SimpleAccordion item={ACCORDION_ITEM} title={_STRINGS.COOL_HEAT}>
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="cool_heat"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.COOL_HEAT || []}
          />
        </SimpleAccordion>
      )}

      {isHidden("kitchen") ? null : (
        <SimpleAccordion item={ACCORDION_ITEM} title={_STRINGS.KITCHEN_ACC}>
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="kitchen"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.KITCHEN || []}
          />
        </SimpleAccordion>
      )}

      <PropertyRulesFilter
        filters={filters}
        queries={queries}
        setFilters={setFilters}
        propertyTypes={propertyTypes}
        hiddenFilters={hiddenFilters}
      />

      {userInfo?.advisor_id ? (
        <div className="flex text-xs mt-4 md:text-sm w-full flex-col gap-4 px-4">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm">{_STRINGS.COMIISH_RANGE_PERC}</p>
            <p className="text-xs">
              {_STRINGS.FROM} {numberWithCommas(filters?.min_commission || 0)}%{" "}
              {_STRINGS.TO}{" "}
              {numberWithCommas(filters?.max_commission || COMMISSION_MAX)}%
            </p>
          </div>
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
      ) : null}

      <div className="flex text-xs mt-4 md:text-sm w-full flex-col gap-4 px-4">
        <div className="w-full flex items-center justify-between">
          <p className="text-sm">{_STRINGS.PRICE_RANGE}</p>
          <p className="text-xs">
            {_STRINGS.FROM} {numberWithCommas(filters?.min_price)} {_STRINGS.TO}{" "}
            {numberWithCommas(filters?.max_price || PRICE_MAX)} {_STRINGS.TOMAN}
          </p>
        </div>
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

      <div className="flex text-xs mt-10 md:text-sm w-full flex-col gap-4 px-4">
        <div className="w-full flex items-center justify-between">
          <p className="text-sm">{_STRINGS.ROOM_SIZE}</p>
          <p className="text-xs">
            {_STRINGS.FROM} {numberWithCommas(filters?.min_building_area)}{" "}
            {_STRINGS.TO}{" "}
            {numberWithCommas(filters?.max_building_area || AREA_MAX)}{" "}
            {_STRINGS.SQUARE_METER}
          </p>
        </div>
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
    </div>
  );
};

export default PropertyFilterForm;
