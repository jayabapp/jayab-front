import { PropertyService } from "@/api_services/property/property.service";
import FilterCheck from "@/components/Filters/FilterCheck";
import FilterCounter from "@/components/Filters/FilterCounter";
import ProductModels from "@/components/Filters/ProductModelx";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import { poolFilterTypes } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const FiltersPart = ({ queries, setFilters, filters, propertyTypes }: any) => {
  return (
    <div className="  z-2 h-fit flex-col items-center p-3  bg-white dark:bg-zinc-800 rounded-xl w-full ">
      <div className="flex items-center gap-2 mb-4 ">
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
    </div>
  );
};

export default FiltersPart;
