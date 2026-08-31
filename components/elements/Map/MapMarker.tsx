"use client";

import { ContentImage } from "@elements/Image";

const PlacesMarker = () => {
  return (
    <ContentImage
      width={32}
      height={32}
      alt="marker"
      className="w-8 h-8"
      src="/assets/icons/addresses/location_center.svg"
    />
  );
};

export default PlacesMarker;
