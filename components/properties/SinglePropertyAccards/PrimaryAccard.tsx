"use client";
import { SinglePropDto } from "@/api_services/property/property.interface";
import LinearTextBlock from "@/components/properties/SinglePropertyAccards/LinearTextBlock";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import PropertySelectedOptions from "./PropertySelectedOptions";
const PrimaryAccard = ({ data }: { data: SinglePropDto }) => {
  return (
    <SimpleAccordion
      isOpenFirst
      item={{
        parenClass: " bg-white border border-gray-300 !mt-0  rounded-10 w-full",
      }}
      title="اطلاعات اصلی ملک"
    >
      <div className="flex items-center flex-col gap-4">
        <LinearTextBlock title={_STRINGS.PROPERTY_TYPE} value={data?.options?.property_type} />
        <LinearTextBlock title={_STRINGS.LAND_AREA} value={numberWithCommas(data?.land_area)} unit={_STRINGS.METER} />
        <LinearTextBlock
          title={_STRINGS.PROPERTY_AREA}
          value={numberWithCommas(data?.building_area)}
          unit={_STRINGS.METER}
        />
        <LinearTextBlock title={_STRINGS.FLOOR_COUNT} value={data?.floors} />
        <LinearTextBlock title={_STRINGS.UNITS_IN_FLOOR} value={data?.unit_per_floor} />
        <LinearTextBlock title={_STRINGS.FLOOR} value={data?.floor == 0 ? "همکف" : data?.floor} />
        <LinearTextBlock title={_STRINGS.OWNERSHIP} value={data?.options?.ownership} />
        <LinearTextBlock title={_STRINGS.PROVINCE} value={data?.province} />
        <LinearTextBlock title={_STRINGS.CITY} value={data?.city} />
        <LinearTextBlock title={_STRINGS.ROOM_COUNTS} value={data?.bedrooms?.total_bedrooms} unit={_STRINGS.ROOM} />
        <LinearTextBlock title={_STRINGS.CREATED_AT_YEAR} value={data?.construction_year} />
        <LinearTextBlock title={_STRINGS.BUILDING_DIRECTION} value={data?.options?.building_direction} />
        <LinearTextBlock title={_STRINGS.POOL_STATUS} value={data?.has_pool ? _STRINGS.HAS_POOL : "ندارد"} />

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

        <div className="flex flex-col gap-1 w-full ">
          <p className="text-sm font-medium ">{_STRINGS.PROP_EXACT_ADDRESS} </p>
          <p className="font-medium">{data?.address}</p>
        </div>

        {!!data?.property_descriptions?.ad_dscr || data?.property_descriptions?.property_dscr ? (
          <div className="flex flex-col gap-1 w-full ">
            <p className="text-sm font-medium ">{_STRINGS.PROP_DESC} </p>
            <p className="font-medium whitespace-pre-wrap">
              {data?.property_descriptions?.ad_dscr || data?.property_descriptions?.property_dscr}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </SimpleAccordion>
  );
};

export default PrimaryAccard;
