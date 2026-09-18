import type { LocationSectionProps } from "@/types/components/modules/property-details";
import { Icon } from "@elements/Icon";

import PropertyLocationRow from "./PropertyLocationRow.client";
import _STRINGS from "@/utils/LocalStrings";

const LocationSection = ({
  latitude,
  longitude,
  place,
}: LocationSectionProps) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2 text-sm text-neutral-800">
      <Icon name="map-pin" size={20} className="text-neutral-800" />
      <span>{place}</span>
    </div>

    {latitude && longitude ? (
      <PropertyLocationRow latitude={latitude} longitude={longitude} />
    ) : (
      <></>
    )}

    <p className="text-xs text-neutral-500">
      {_STRINGS.EXACT_ADDRESS_AFTER_CONTACT}
    </p>
  </div>
);

export default LocationSection;
