import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import SpecRow from "./SpecRow";

export const SPEC_ACCORDION_ITEM = {
  parenClass: " bg-white border border-neutral-300 !mt-0 rounded-10 w-full",
};

const PropertyPrimarySpecs = ({ property }: PropertySpecsSectionProps) => (
  <SimpleAccordion
    isOpenFirst
    item={SPEC_ACCORDION_ITEM}
    title={_STRINGS.MAIN_PROPERTY_INFO}
  >
    <div className="flex items-center flex-col gap-4">
      <SpecRow
        title={_STRINGS.PROPERTY_TYPE}
        value={property?.options?.property_type}
      />
      <SpecRow
        unit={_STRINGS.METER}
        title={_STRINGS.LAND_AREA}
        value={numberWithCommas(property?.land_area)}
      />
      <SpecRow
        unit={_STRINGS.METER}
        title={_STRINGS.PROPERTY_AREA}
        value={numberWithCommas(property?.building_area)}
      />
      <SpecRow title={_STRINGS.FLOOR_COUNT} value={property?.floors} />
      <SpecRow
        title={_STRINGS.UNITS_IN_FLOOR}
        value={property?.unit_per_floor}
      />
      <SpecRow
        title={_STRINGS.FLOOR}
        value={property?.floor === 0 ? _STRINGS.GROUND_FLOOR : property?.floor}
      />
      <SpecRow
        title={_STRINGS.OWNERSHIP}
        value={property?.options?.ownership}
      />
      <SpecRow title={_STRINGS.PROVINCE} value={property?.province} />
      <SpecRow title={_STRINGS.CITY} value={property?.city} />
      <SpecRow
        unit={_STRINGS.ROOM}
        title={_STRINGS.ROOM_COUNTS}
        value={property?.bedrooms?.total_bedrooms}
      />
      <SpecRow
        title={_STRINGS.CREATED_AT_YEAR}
        value={property?.construction_year}
      />
      <SpecRow
        title={_STRINGS.BUILDING_DIRECTION}
        value={property?.options?.building_direction}
      />

      <div className="flex flex-col gap-1 w-full">
        <p className="text-sm font-medium">{_STRINGS.PROP_EXACT_ADDRESS}</p>
        <p className="font-medium">{property?.address}</p>
      </div>

      {property?.property_descriptions?.ad_dscr ||
      property?.property_descriptions?.property_dscr ? (
        <div className="flex flex-col gap-1 w-full">
          <p className="text-sm font-medium">{_STRINGS.PROP_DESC}</p>
          <p className="font-medium whitespace-pre-wrap">
            {property?.property_descriptions?.ad_dscr ||
              property?.property_descriptions?.property_dscr}
          </p>
        </div>
      ) : null}
    </div>
  </SimpleAccordion>
);

export default PropertyPrimarySpecs;
