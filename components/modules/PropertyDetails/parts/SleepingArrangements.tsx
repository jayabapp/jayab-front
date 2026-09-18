import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";
import MiniInfoCard from "./MiniInfoCard";
import FactRow from "./FactRow";

const SleepingArrangements = ({ property }: PropertySpecsSectionProps) => {
  const bedrooms = property?.bedrooms;
  const rooms = bedrooms?.bedrooms ?? [];

  const sharedBits = [
    bedrooms?.additional_bed
      ? `${bedrooms.additional_bed} ${_STRINGS.EXTRA_BEDDING}`
      : null,
    bedrooms?.sofa_bed ? _STRINGS.SOFA_BED : null,
  ].filter(Boolean);

  const toilets = [
    bedrooms?.wc ? `${bedrooms.wc} ${_STRINGS.WC_IR}` : null,
    bedrooms?.wc_ir ? `${bedrooms.wc_ir} ${_STRINGS.WC_INTERNATIONAL}` : null,
  ].filter(Boolean);

  const bathrooms =
    (bedrooms?.bathroom_general ?? 0) +
    (bedrooms?.bathroom_tub ?? 0) +
    (bedrooms?.bathroom_in_wc ?? 0) +
    (bedrooms?.bathroom_master ?? 0);

  if (!rooms.length && !sharedBits.length && !toilets.length && !bathrooms)
    return <></>;

  return (
    <div className="flex flex-col gap-4">
      {rooms.length || sharedBits.length ? (
        <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible">
          {rooms.map((beds, index) => (
            <MiniInfoCard
              icon="bed"
              className="min-w-[8.5rem] shrink-0"
              key={`bedroom-${index}`}
              title={`${_STRINGS.ROOM} ${index + 1}`}
              value={`${beds} ${_STRINGS.BEDS}`}
              note={
                index === 0 && bedrooms?.master_room
                  ? _STRINGS.MASTER_ROOM
                  : null
              }
            />
          ))}

          {sharedBits.length ? (
            <MiniInfoCard
              icon="bed"
              className="min-w-[8.5rem] shrink-0"
              title={_STRINGS.SHARED_SPACE}
              value={sharedBits.join(" • ")}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      {toilets.length || bathrooms ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {toilets.length ? (
            <FactRow icon="toilet" title={_STRINGS.WC} summary={toilets} />
          ) : (
            <></>
          )}
          {bathrooms ? (
            <FactRow
              icon="bath"
              title={_STRINGS.BATHROOM}
              summary={[`${bathrooms} ${_STRINGS.ADAD}`]}
            />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SleepingArrangements;
