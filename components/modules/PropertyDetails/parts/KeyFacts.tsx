import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";
import FactRow from "./FactRow";

const KeyFacts = ({ property }: PropertySpecsSectionProps) => {
  const stdCapacity = property?.std_capacity ?? 0;
  const maxCapacity = property?.max_capacity ?? 0;
  const extraGuests = Math.max(maxCapacity - stdCapacity, 0);
  const bedrooms = property?.bedrooms;
  const bedCount = (bedrooms?.bedrooms ?? []).reduce(
    (total, beds) => total + (Number(beds) || 0),
    0,
  );

  const poolTypes = property?.options?.pool_type ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FactRow
        icon="users"
        title={`${_STRINGS.UP_TO} ${maxCapacity} ${_STRINGS.GUESTS}`}
        summary={[
          stdCapacity
            ? `${_STRINGS.STANDARD_CAPACITY_SHORT} ${stdCapacity} ${_STRINGS.NAFAR}`
            : null,
          extraGuests
            ? `${extraGuests} ${_STRINGS.EXTRA_GUESTS_SHORT}`
            : null,
        ]}
      />

      <FactRow
        icon="bed"
        title={`${bedrooms?.total_bedrooms ?? 0} ${_STRINGS.ROOM}`}
        summary={[
          bedCount ? `${bedCount} ${_STRINGS.BEDS}` : null,
          bedrooms?.additional_bed
            ? `${bedrooms.additional_bed} ${_STRINGS.EXTRA_BEDDING}`
            : null,
          bedrooms?.sofa_bed ? _STRINGS.SOFA_BED : null,
        ]}
      />

      <FactRow
        icon="ruler"
        title={`${numberWithCommas(property?.building_area)} ${_STRINGS.METER}`}
        summary={[
          property?.land_area
            ? `${_STRINGS.LAND_AREA_SHORT} ${numberWithCommas(property.land_area)} ${_STRINGS.METER}`
            : null,
        ]}
      />

      {property?.has_pool ? (
        <FactRow
          icon="pool"
          title={poolTypes[0] || _STRINGS.HAS_POOL}
          summary={poolTypes.slice(1)}
        />
      ) : (
        <FactRow
          icon="home"
          title={property?.options?.property_type || ""}
          summary={[property?.options?.ownership]}
        />
      )}
    </div>
  );
};

export default KeyFacts;
