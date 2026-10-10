"use client";

import { countActiveFilters} from "@features/properties/lib/count-active-filters";
import { countFilterGroup} from "@features/properties/lib/count-active-filters";
import { useTranslations } from "next-intl";
import { poolFilterTypes } from "@/utils/constantss";
import { useStoreInit } from "@/store";

import type { PropertyFilterFormProps } from "@/types/components/modules/property-search-filters";

import PropertyModelFilter from "./PropertyModelFilter.client";
import PropertyRulesFilter from "./parts/PropertyRulesFilter";
import FilterPanelHeader from "./parts/FilterPanelHeader";
import numberWithCommas from "@/helpers/numberWithCommas";
import PriceRangeFilter from "./parts/PriceRangeFilter.client";
import FilterCounter from "./parts/FilterCounter.client";
import FilterSection from "./parts/FilterSection.client";
import FilterCheck from "./parts/FilterCheck.client";
import DateFilter from "./parts/DateFilter.client";

const COMMISSION_MAX = 50;
const PRICE_MAX = 40000000;
const AREA_MAX = 1000;

const PropertyFilterForm = ({
  filters,
  onReset,
  queries,
  setFilters,
  propertyTypes,
  hiddenFilters = [],
}: PropertyFilterFormProps) => {
  const t = useTranslations();

  const { userInfo } = useStoreInit((data) => data);
  const isHidden = (key: string) => hiddenFilters.includes(key);
  const activeCount = countActiveFilters(filters, hiddenFilters);

  const excludesPool = `${filters?.has_pool ?? ""}` === "0";

  return (
    <div className="flex w-full flex-col px-3">
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
          title={t("common.propertyType")}
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
        title={t("listing.priceRange")}
        count={filters?.min_price || filters?.max_price ? 1 : 0}
      >
        <div className="flex w-full flex-col gap-4 pb-2 pt-1">
          <p className="text-xs text-neutral-600">
            {t("common.from")} {numberWithCommas(filters?.min_price || 0)}{" "}
            {t("common.to")} {numberWithCommas(filters?.max_price || PRICE_MAX)}{" "}
            {t("common.toman")}
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
        title={t("listing.capacity")}
        count={countFilterGroup(filters, ["total_guests", "total_bedrooms"])}
      >
        {isHidden("total_guests") ? (
          <></>
        ) : (
          <FilterCounter
            query={queries}
            mobileFilters={filters}
            queryKey="total_guests"
            title={t("common.pplCount")}
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
            title={t("listing.roomCount")}
            setMobileFilters={setFilters}
          />
        )}
      </FilterSection>

      <div className="w-full border-b border-neutral-100 py-1">
        <DateFilter filters={filters} setFilters={setFilters} />
      </div>

      <FilterSection
        title={t("listing.quickFilters")}
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
            title={t("listing.hasDiscount")}
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
            title={t("listing.permiumProps")}
          />
        )}
      </FilterSection>

      {isHidden("has_pool") ? (
        <></>
      ) : (
        <FilterSection
          title={t("common.poolStatus")}
          count={countFilterGroup(filters, ["has_pool", "pool_type"])}
        >
          <PropertyModelFilter
            query={queries}
            queryKey="has_pool"
            mobileFilters={filters}
            list={poolFilterTypes.map(({ titleKey, ...type }) => ({
              ...type,
              title: t(titleKey),
            }))}
            setMobileFilters={setFilters}
          />
          {excludesPool || isHidden("pool_type") ? (
            <></>
          ) : (
            <div className="mt-2 border-t border-neutral-100 pt-2">
              <p className="pb-1 text-xs text-neutral-500">
                {t("common.poolType")}
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
          title={t("common.welfare")}
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
          title={t("common.entertainment")}
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
          title={t("common.kitchenAcc")}
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
          title={t("common.coolHeat")}
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
          title={t("common.envPattern")}
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
        title={t("listing.roomSize")}
        count={filters?.min_building_area || filters?.max_building_area ? 1 : 0}
      >
        <div className="flex w-full flex-col gap-4 pb-2 pt-1">
          <p className="text-xs text-neutral-600">
            {t("common.from")}{" "}
            {numberWithCommas(filters?.min_building_area || 0)} {t("common.to")}{" "}
            {numberWithCommas(filters?.max_building_area || AREA_MAX)}{" "}
            {t("listing.squareMeter")}
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
          title={t("listing.comiishRangePerc")}
          count={filters?.min_commission || filters?.max_commission ? 1 : 0}
        >
          <div className="flex w-full flex-col gap-4 pb-2 pt-1">
            <p className="text-xs text-neutral-600">
              {t("common.from")}{" "}
              {numberWithCommas(filters?.min_commission || 0)}% {t("common.to")}{" "}
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
