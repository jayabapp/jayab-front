"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import React from "react";
import _STRINGS from "@/utils/LocalStrings";
import LinearTextBlock from "@/components/properties/SinglePropertyAccards/LinearTextBlock";
import SelectedOptions from "./PropertySelectedOptions";
import PropertySelectedOptions from "./PropertySelectedOptions";
const PrimaryAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
        noBorder: true,
        titleClass: "font-bold",
      }}
      title="اطلاعات اصلی ملک"
    >
      <div className="flex items-center flex-col gap-4">
        <LinearTextBlock title={_STRINGS.PROPERTY_TYPE} value={1} />
        <LinearTextBlock title={_STRINGS.LAND_AREA} value={"ss"} unit={_STRINGS.METER} />
        <LinearTextBlock title={_STRINGS.PROPERTY_AREA} value={"ss"} unit={_STRINGS.METER} />
        <LinearTextBlock title={_STRINGS.PROPERTY_AREA} value={"ss"} unit={_STRINGS.METER} />
        <LinearTextBlock title={_STRINGS.FLOOR_COUNT} value={"ss"} />
        <LinearTextBlock title={_STRINGS.UNITS_IN_FLOOR} value={"ss"} />
        <LinearTextBlock title={_STRINGS.FLOOR} value={"ss"} />
        <LinearTextBlock title={_STRINGS.OWNERSHIP_TYPE} value={"ss"} />
        <LinearTextBlock title={_STRINGS.PROVINCE} value={"ss"} />
        <LinearTextBlock title={_STRINGS.CITY} value={"ss"} />
        <LinearTextBlock title={_STRINGS.ROOM_COUNTS} value={"ss"} unit={_STRINGS.ROOM} />
        <LinearTextBlock title={_STRINGS.CREATED_AT_YEAR} value={"ss"} />
        <LinearTextBlock title={_STRINGS.BUILDING_DIRECTION} value={"ss"} />
        <LinearTextBlock title={_STRINGS.POOL_STATUS} value={"ss"} />

        {!!data?.has_pool ? (
          <div className="flex w-full flex-col  gap-3">
            <p className="text-primary-700 font-bold">{_STRINGS.POOL_TYPE}</p>
            {data?.options?.pool_type?.map((e) => (
              <PropertySelectedOptions title={e} key={`${e}poolType`} />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default PrimaryAccard;
