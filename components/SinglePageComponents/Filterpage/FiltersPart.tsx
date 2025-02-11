"use client";
import DateFilter from "@/components/Filters/DateFilter";
import FilterCheck from "@/components/Filters/FilterCheck";
import FilterCounter from "@/components/Filters/FilterCounter";
import PriceRange from "@/components/Filters/PriceRange";
import ProductModels from "@/components/Filters/ProductModelx";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import numberWithCommas from "@/helpers/numberWithCommas";
import { useStoreInit } from "@/store";
import { poolFilterTypes } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const FiltersPart = ({ queries, setFilters, filters, propertyTypes }: any) => {
  const { userInfo } = useStoreInit((data) => data);
  return (
    <div className="  z-2 h-fit flex-col items-center p-3  bg-white dark:bg-zinc-800 rounded-xl w-full ">
      <div className=" hidden md:flex   items-center gap-2 mb-4 ">
        <img src="/assets/icons/property/filter_icon.svg" />
        <p className="font-medium  text-lg">{_STRINGS.FILTERS}</p>
      </div>
      <SimpleAccordion
        item={{ parenClass: "  pb-4  border-b w-full p-2 !px-0", disableBorderB: true }}
        title={_STRINGS.PROPERTY_TYPE}
        isOpenFirst
      >
        <ProductModels
          mobileFilters={filters}
          setMobileFilters={setFilters}
          queryKey={"property_type"}
          list={propertyTypes?.PROPERTY_TYPE || []}
          query={queries}
        />
      </SimpleAccordion>
      <SimpleAccordion
        item={{ parenClass: "  pb-4  border-b w-full p-2 !px-0", disableBorderB: true }}
        title={_STRINGS.POOL_STATUS}
        isOpenFirst
      >
        <ProductModels
          mobileFilters={filters}
          setMobileFilters={setFilters}
          queryKey={"has_pool"}
          list={poolFilterTypes || []}
          query={queries}
        />
      </SimpleAccordion>

      {queries?.has_pool == "0" ? (
        <></>
      ) : (
        <SimpleAccordion
          item={{ parenClass: "   pb-4  border-b w-full p-2 !px-0", disableBorderB: true }}
          title={_STRINGS.POOL_TYPE}
        >
          <ProductModels
            mobileFilters={filters}
            setMobileFilters={setFilters}
            queryKey={"pool_type"}
            list={propertyTypes?.POOL_TYPE || []}
            query={queries}
            isMulty
          />
        </SimpleAccordion>
      )}

      <FilterCounter
        title={_STRINGS.ROOM_COUNT}
        mobileFilters={filters}
        setMobileFilters={setFilters}
        queryKey={"total_bedrooms"}
        query={queries}
      />
      <FilterCounter
        title={_STRINGS.PPL_COUNT}
        mobileFilters={filters}
        setMobileFilters={setFilters}
        queryKey={"total_guests"}
        query={queries}
      />
      <SimpleAccordion
        item={{ parenClass: "  pb-4  border-b w-full p-2 !px-0", disableBorderB: true }}
        title={_STRINGS.ENTERTAINMENT}
      >
        <ProductModels
          mobileFilters={filters}
          setMobileFilters={setFilters}
          queryKey={"entertainment"}
          isMulty
          list={propertyTypes?.ENTERTAINMENT || []}
          query={queries}
        />
      </SimpleAccordion>

      {!!userInfo?.advisor_id ? <DateFilter filters={filters} setFilters={setFilters} /> : <></>}

      <FilterCheck
        title={_STRINGS.HAS_DISCOUNT}
        mobileFilters={filters}
        setMobileFilters={setFilters}
        queryKey={"has_discount"}
        query={queries}
      />
      <FilterCheck
        withBadge
        title={_STRINGS.PERMIUM_PROPS}
        mobileFilters={filters}
        setMobileFilters={setFilters}
        queryKey={"is_premium"}
        query={queries}
      />

      {/* COMMISION RANGE  */}

      {!!userInfo?.advisor_id ? (
        <div className="flex text-xs  mt-4 md:text-sm w-full flex-col gap-4 px-4 ">
          <div className="w-full flex items-center justify-between">
            <p className="text-sm">{_STRINGS.COMIISH_RANGE_PERC}</p>
            {!!filters.min_commission || filters.max_commission ? (
              <p className="text-xs">
                {filters?.min_commission ? ` از  ${numberWithCommas(filters?.min_commission || 0)}%` : ""}

                {!!filters.max_commission ? ` تا ${numberWithCommas(filters.max_commission || 0)}%` : ""}
              </p>
            ) : (
              <></>
            )}
          </div>

          <PriceRange
            lowerKey="min_commission"
            higherKey="max_commission"
            steps={5}
            filters={filters}
            setFilters={setFilters}
            query={queries}
            lowLimit={0}
            upLimit={50}
          />
          {/* <div
            className={` ${
              !!filters.max_commission || !!filters.min_commission ? " h-8" : "h-0 opacity-0"
            }  transition-all `}
          >
            <p className="text-sm opacity-70">{filters?.min_commission ? ` از   ${filters?.min_commission} %` : ""} </p>
            <p className="text-sm opacity-70">{!!filters.max_commission ? ` تا  ${filters.max_commission} %` : ""} </p>
          </div> */}
        </div>
      ) : (
        <></>
      )}

      {/*  PRICE RANGE */}
      <div className="flex text-xs  mt-4 md:text-sm w-full flex-col gap-4 px-4 ">
        <div className="w-full flex items-center justify-between">
          <p className="text-sm">{_STRINGS.PRICE_RANGE}</p>
          {!!filters.max_price || filters.min_price ? (
            <p className="text-xs">
              {filters?.min_price ? ` از  ${numberWithCommas(filters?.min_price)}` : ""}{" "}
              {!!filters.max_price ? ` تا ${numberWithCommas(filters.max_price)}` : ""} تومان
            </p>
          ) : (
            <></>
          )}
        </div>

        <PriceRange
          lowerKey="min_price"
          higherKey="max_price"
          steps={500000}
          filters={filters}
          setFilters={setFilters}
          query={queries}
          lowLimit={500000}
          upLimit={40000000}
        />
        {/* <div className={` ${!!filters.max_price || !!filters.min_price ? " h-8" : "h-0 opacity-0"}  transition-all `}>
          <p className="text-sm opacity-70">
            {filters?.min_price ? ` از  ${numberWithCommas(filters?.min_price)} تومان` : ""}{" "}
          </p>
          <p className="text-sm opacity-70">
            {!!filters.max_price ? ` تا ${numberWithCommas(filters.max_price)} تومان` : ""}{" "}
          </p>
        </div> */}
      </div>
      <div className="flex text-xs  mt-4 md:text-sm w-full flex-col gap-4 px-4 ">
        <div className="w-full flex items-center justify-between">
          <p className="text-sm">{_STRINGS.ROOM_SIZE}</p>
          {!!filters.min_building_area || filters.max_building_area ? (
            <p className="text-xs">
              {filters?.min_building_area ? ` از  ${numberWithCommas(filters?.min_building_area)}` : ""}{" "}
              {!!filters.max_building_area ? ` تا ${numberWithCommas(filters.max_building_area)}` : ""} متر مربع
            </p>
          ) : (
            <></>
          )}
        </div>
        <PriceRange
          lowerKey="min_building_area"
          higherKey="max_building_area"
          steps={50}
          filters={filters}
          setFilters={setFilters}
          query={queries}
          lowLimit={50}
          upLimit={1000}
        />
      </div>
    </div>
  );
};

export default FiltersPart;
