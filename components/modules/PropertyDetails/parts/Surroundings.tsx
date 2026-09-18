import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";
import ClampText from "./ClampText.client";
import FactRow from "./FactRow";

/** Neighbourhood, access road and distances — how the place sits in its area. */
const Surroundings = ({ property }: PropertySpecsSectionProps) => {
  const descriptions = property?.property_descriptions;
  const options = property?.options;

  const hasFacts = options?.pattern || options?.access || options?.neighborhood;
  if (!hasFacts && !descriptions?.pattern_dscr && !descriptions?.distance_dscr)
    return <></>;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {options?.pattern ? (
          <FactRow icon="home" title={options.pattern} summary={[_STRINGS.ENV_PATTERN]} />
        ) : (
          <></>
        )}
        {options?.access ? (
          <FactRow icon="map-pin" title={options.access} summary={[_STRINGS.ACCESS_ROUTE]} />
        ) : (
          <></>
        )}
        {options?.neighborhood ? (
          <FactRow
            icon="users"
            title={options.neighborhood}
            summary={[_STRINGS.PROP_NEIGHTBOUR]}
          />
        ) : (
          <></>
        )}
      </div>

      {descriptions?.pattern_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-neutral-900">
            {_STRINGS.ACCSESS_ROUTE_DESC}
          </p>
          <ClampText lines={3}>{descriptions.pattern_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}

      {descriptions?.distance_dscr ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-neutral-900">
            {_STRINGS.DISTANCETO_POINT}
          </p>
          <ClampText lines={3}>{descriptions.distance_dscr}</ClampText>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Surroundings;
