import { ListingLocationMap } from "@modules/PropertyMap";
import { Icon } from "@elements/Icon";

import type { LocationSectionProps } from "@/types/components/modules/property-details";

import LocationNavigateLink from "./LocationNavigateLink.client";

const LocationSection = ({
  place,
  latitude,
  longitude,
  approxLocation,
}: LocationSectionProps) => {
  const hasExact = Boolean(latitude && longitude);

  return (
    <div className="flex flex-col gap-3">
      <ListingLocationMap
        latitude={latitude}
        longitude={longitude}
        approxLocation={approxLocation}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-ink">
          <Icon name="map-pin" size={20} className="text-ink" />
          <span>{place}</span>
        </div>
        {hasExact ? (
          <LocationNavigateLink
            latitude={Number(latitude)}
            longitude={Number(longitude)}
            className="w-full md:w-auto"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
