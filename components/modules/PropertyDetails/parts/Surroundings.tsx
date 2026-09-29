import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import type { IconName } from "@/types/components/elements/icon";

import _STRINGS from "@/utils/LocalStrings";
import ClampText from "./ClampText.client";
import { Icon } from "@elements/Icon";

/** A single "label: value" row — label bold, value regular, per §14.4. */
const SurroundingFact = ({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-neutral-500" />
    <p className="text-sm text-neutral-800 md:text-base">
      <span className="font-bold text-neutral-900">{label}:</span>{" "}
      <span className="font-normal">{value}</span>
    </p>
  </div>
);

/** Neighbourhood, access road and distances — how the place sits in its area. */
const Surroundings = ({ property }: PropertySpecsSectionProps) => {
  const descriptions = property?.property_descriptions;
  const options = property?.options;

  const hasFacts = options?.pattern || options?.access || options?.neighborhood;
  if (!hasFacts && !descriptions?.pattern_dscr && !descriptions?.distance_dscr)
    return <></>;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options?.pattern ? (
          <SurroundingFact
            icon="home"
            label={_STRINGS.ENV_PATTERN}
            value={options.pattern}
          />
        ) : (
          <></>
        )}
        {options?.access ? (
          <SurroundingFact
            icon="map-pin"
            label={_STRINGS.ACCESS_ROUTE}
            value={options.access}
          />
        ) : (
          <></>
        )}
        {options?.neighborhood ? (
          <SurroundingFact
            icon="users"
            label={_STRINGS.PROP_NEIGHTBOUR}
            value={options.neighborhood}
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
