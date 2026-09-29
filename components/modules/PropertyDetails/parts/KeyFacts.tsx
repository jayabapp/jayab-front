import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import FactRow from "./FactRow";

// Order and wording follow FEATURE.md §13.2: property type, capacity, bedrooms,
// area — in that order, and every row is skipped instead of rendering a
// zero/missing value as broken text.
const KeyFacts = ({ property }: PropertySpecsSectionProps) => {
  const propertyType = property?.options?.property_type;

  const stdCapacity = property?.std_capacity ?? 0;
  const maxCapacity = property?.max_capacity ?? 0;
  const extraGuests = Math.max(maxCapacity - stdCapacity, 0);

  const bedrooms = property?.bedrooms;
  const totalBedrooms = bedrooms?.total_bedrooms ?? 0;
  const bedCount = (bedrooms?.bedrooms ?? []).reduce(
    (total, beds) => total + (Number(beds) || 0),
    0,
  );

  const buildingAreaText = property?.building_area
    ? `${numberWithCommas(property.building_area)} ${_STRINGS.METER} ${_STRINGS.BUILDING_AREA_SUFFIX}`
    : null;
  const surroundingAreaText = property?.land_area
    ? `${numberWithCommas(property.land_area)} ${_STRINGS.METER} ${_STRINGS.SURROUNDING_AREA_SUFFIX}`
    : null;
  const areaTitle = [buildingAreaText, surroundingAreaText]
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {propertyType ? (
        <FactRow
          icon="home"
          title={propertyType}
          summary={[property?.options?.ownership]}
        />
      ) : (
        <></>
      )}

      {maxCapacity ? (
        <FactRow
          icon="users"
          title={`${_STRINGS.UP_TO} ${maxCapacity} ${_STRINGS.GUESTS}`}
          summary={[
            stdCapacity
              ? `${stdCapacity} ${_STRINGS.STANDARD_GUESTS_SUFFIX}`
              : null,
            extraGuests ? `${extraGuests} ${_STRINGS.EXTRA_GUESTS_SHORT}` : null,
          ]}
        />
      ) : (
        <></>
      )}

      {totalBedrooms ? (
        <FactRow
          icon="bed"
          title={`${totalBedrooms} ${_STRINGS.ROOM}`}
          summary={[
            bedCount ? `${bedCount} ${_STRINGS.BEDS}` : null,
            bedrooms?.additional_bed
              ? `${bedrooms.additional_bed} ${_STRINGS.EXTRA_BEDDING}`
              : null,
            bedrooms?.sofa_bed ? _STRINGS.SOFA_BED : null,
          ]}
        />
      ) : (
        <></>
      )}

      {areaTitle ? <FactRow icon="ruler" title={areaTitle} /> : <></>}
    </div>
  );
};

export default KeyFacts;
