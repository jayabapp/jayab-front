import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import SpecRow from "@elements/SpecRow";

// Shared by all six spec sections. They sit inside one `.surface-panel` now, so
// each is a divided row rather than its own bordered card — nested borders on a
// tinted canvas read as clutter.
export const SPEC_ACCORDION_ITEM = {
  parenClass: "!mt-0 w-full border-b border-neutral-100 last:border-b-0",
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
    </div>
  </SimpleAccordion>
);

export default PropertyPrimarySpecs;
