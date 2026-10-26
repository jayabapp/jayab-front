"use client";

import { extraDiscoveryFilters } from "@features/properties/lib/discovery-filter-policy";
import { countActiveFilters } from "@features/properties/lib/count-active-filters";
import { COMMISSION_RANGE } from "@features/properties/constants/filter-ranges";
import { countFilterGroup } from "@features/properties/lib/count-active-filters";
import { useFormatNumber } from "@hooks/useFormatNumber";
import { useTranslations } from "next-intl";
import { poolFilterTypes } from "@/utils/constantss";
import { useStoreInit } from "@/store";
import { AREA_RANGE } from "@features/properties/constants/filter-ranges";

import type { PropertyFilterFormProps } from "@/types/components/modules/property-search-filters";

import DiscoveryPriceFilter from "./parts/DiscoveryPriceFilter.client";
import PropertyModelFilter from "./PropertyModelFilter.client";
import PropertyRulesFilter from "./parts/PropertyRulesFilter";
import FilterPanelHeader from "./parts/FilterPanelHeader";
import PriceRangeFilter from "./parts/PriceRangeFilter.client";
import FilterCounter from "./parts/FilterCounter.client";
import FilterSection from "./parts/FilterSection.client";
import FilterCheck from "./parts/FilterCheck.client";
import DateFilter from "./parts/DateFilter.client";
import isEmpty from "lodash/isEmpty";

const COMMISSION_MAX = COMMISSION_RANGE.max;
const AREA_MAX = AREA_RANGE.max;

const PropertyFilterForm = ({
  filters,
  onReset,
  queries,
  setFilters,
  propertyTypes,
  baselineFilters,
  hiddenFilters = [],
}: PropertyFilterFormProps) => {
  const t = useTranslations();
  const formatNumber = useFormatNumber();

  const { userInfo } = useStoreInit((data) => data);
  const isHidden = (key: string) => hiddenFilters.includes(key);
  const countFilters = extraDiscoveryFilters(filters, baselineFilters);
  const activeCount = countActiveFilters(countFilters, hiddenFilters);

  const excludesPool = `${filters?.has_pool ?? ""}` === "0";

  return (
    <div className="flex w-full flex-col px-3">
      {onReset ? (
        <div className="sticky top-0 z-1 bg-surface pt-3">
          <FilterPanelHeader
            activeCount={activeCount}
            onReset={onReset}
            resetLabel={
              isEmpty(baselineFilters)
                ? t("listing.clearAllFilters")
                : t("listing.removeExtraFilters")
            }
          />
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
          count={countFilterGroup(countFilters, ["property_type"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            mobileFilters={filters}
            queryKey="property_type"
            setMobileFilters={setFilters}
            list={propertyTypes?.PROPERTY_TYPE || []}
            containerClass="grid w-full grid-cols-2 gap-x-3"
          />
        </FilterSection>
      )}

      <FilterSection
        defaultOpen
        title={t("listing.priceRange")}
        count={countFilters.min_price || countFilters.max_price ? 1 : 0}
      >
        <DiscoveryPriceFilter
          filters={filters}
          searchFilters={filters}
          setFilters={setFilters}
        />
      </FilterSection>

      <FilterSection
        defaultOpen
        title={t("listing.capacity")}
        count={countFilterGroup(countFilters, [
          "total_guests",
          "total_bedrooms",
        ])}
      >
        {isHidden("total_guests") ? (
          <></>
        ) : (
          <FilterCounter
            query={queries}
            queryKey="total_guests"
            mobileFilters={filters}
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
            setMobileFilters={setFilters}
            title={t("listing.roomCount")}
          />
        )}
      </FilterSection>

      <div className="w-full border-b border-surface-muted py-1">
        <DateFilter filters={filters} setFilters={setFilters} />
      </div>

      <FilterSection
        defaultOpen
        title={t("listing.quickFilters")}
        count={countFilterGroup(countFilters, [
          "has_discount",
          "has_blue_tick",
          "is_authorized",
        ])}
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
        {isHidden("has_blue_tick") ? (
          <></>
        ) : (
          <FilterCheck
            withBadge
            query={queries}
            mobileFilters={filters}
            queryKey="has_blue_tick"
            title={t("listing.premium")}
            setMobileFilters={setFilters}
          />
        )}
        {isHidden("is_authorized") ? (
          <></>
        ) : (
          <FilterCheck
            query={queries}
            queryKey="is_authorized"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            title={t("listing.verified")}
          />
        )}
      </FilterSection>

      {isHidden("has_pool") ? (
        <></>
      ) : (
        <FilterSection
          title={t("common.poolStatus")}
          count={countFilterGroup(countFilters, ["has_pool", "pool_type"])}
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
            <div className="mt-2 border-t border-surface-muted pt-2">
              <p className="pb-1 text-xs text-ink-subtle">
                {t("common.poolType")}
              </p>
              <PropertyModelFilter
                isMulty
                query={queries}
                queryKey="pool_type"
                mobileFilters={filters}
                setMobileFilters={setFilters}
                list={propertyTypes?.POOL_TYPE || []}
                containerClass="grid w-full grid-cols-2 gap-x-3"
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
          count={countFilterGroup(countFilters, ["welfare"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="welfare"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.WELFARE || []}
            containerClass="grid w-full grid-cols-2 gap-x-3"
          />
        </FilterSection>
      )}

      {isHidden("entertainment") ? (
        <></>
      ) : (
        <FilterSection
          title={t("common.entertainment")}
          count={countFilterGroup(countFilters, ["entertainment"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            mobileFilters={filters}
            queryKey="entertainment"
            setMobileFilters={setFilters}
            list={propertyTypes?.ENTERTAINMENT || []}
            containerClass="grid w-full grid-cols-2 gap-x-3"
          />
        </FilterSection>
      )}

      {isHidden("kitchen") ? (
        <></>
      ) : (
        <FilterSection
          title={t("common.kitchenAcc")}
          count={countFilterGroup(countFilters, ["kitchen"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="kitchen"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.KITCHEN || []}
            containerClass="grid w-full grid-cols-2 gap-x-3"
          />
        </FilterSection>
      )}

      {isHidden("cool_heat") ? (
        <></>
      ) : (
        <FilterSection
          title={t("common.coolHeat")}
          count={countFilterGroup(countFilters, ["cool_heat"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="cool_heat"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.COOL_HEAT || []}
            containerClass="grid w-full grid-cols-2 gap-x-3"
          />
        </FilterSection>
      )}

      {isHidden("pattern") ? (
        <></>
      ) : (
        <FilterSection
          title={t("common.envPattern")}
          count={countFilterGroup(countFilters, ["pattern"])}
        >
          <PropertyModelFilter
            isMulty
            query={queries}
            queryKey="pattern"
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={propertyTypes?.PATTERN || []}
            containerClass="grid w-full grid-cols-2 gap-x-3"
          />
        </FilterSection>
      )}

      <FilterSection
        title={t("listing.roomSize")}
        count={
          countFilters.min_building_area || countFilters.max_building_area
            ? 1
            : 0
        }
      >
        <div className="flex w-full flex-col gap-4 pb-2 pt-1">
          <p className="text-xs text-ink-muted">
            {t("common.from")} {formatNumber(filters?.min_building_area || 0)}{" "}
            {t("common.to")}{" "}
            {formatNumber(filters?.max_building_area || AREA_MAX)}{" "}
            {t("listing.squareMeter")}
          </p>
          <PriceRangeFilter
            lowLimit={0}
            filters={filters}
            upLimit={AREA_MAX}
            setFilters={setFilters}
            steps={AREA_RANGE.step}
            lowerKey="min_building_area"
            higherKey="max_building_area"
          />
        </div>
      </FilterSection>

      <PropertyRulesFilter
        filters={filters}
        queries={queries}
        setFilters={setFilters}
        countFilters={countFilters}
        propertyTypes={propertyTypes}
        hiddenFilters={hiddenFilters}
      />

      {userInfo?.advisor_id ? (
        <FilterSection
          title={t("listing.comiishRangePerc")}
          count={
            countFilters.min_commission || countFilters.max_commission ? 1 : 0
          }
        >
          <div className="flex w-full flex-col gap-4 pb-2 pt-1">
            <p className="text-xs text-ink-muted">
              {t("common.from")} {formatNumber(filters?.min_commission || 0)}%{" "}
              {t("common.to")}{" "}
              {formatNumber(filters?.max_commission || COMMISSION_MAX)}%
            </p>
            <PriceRangeFilter
              lowLimit={0}
              filters={filters}
              setFilters={setFilters}
              upLimit={COMMISSION_MAX}
              lowerKey="min_commission"
              higherKey="max_commission"
              steps={COMMISSION_RANGE.step}
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
