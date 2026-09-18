"use client";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { AMENITY_PREVIEW_COUNT } from "@features/properties/constants/amenities";
import { toAmenityItems } from "@features/properties/mappers/amenities.mapper";
import { useMemo, useState } from "react";

import AmenitiesModal from "./AmenitiesModal.client";
import ShowAllButton from "./ShowAllButton";
import _STRINGS from "@/utils/LocalStrings";
import ClampText from "./ClampText.client";
import IconListItem from "./IconListItem";

const Amenities = ({ property }: PropertySpecsSectionProps) => {
  const [showAll, setShowAll] = useState(false);
  const amenities = useMemo(() => toAmenityItems(property), [property]);

  if (!amenities.length) return <></>;

  const preview = amenities.slice(0, AMENITY_PREVIEW_COUNT);
  const facilityNote = property?.property_descriptions?.facility_dscr;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {preview.map((item) => (
          <IconListItem
            key={`${item.group}-${item.title}`}
            label={item.title}
            image={item.icon ? getPropertyImageUrl(item.icon) : null}
          />
        ))}
      </div>

      {amenities.length > preview.length ? (
        <ShowAllButton
          count={amenities.length}
          onClick={() => setShowAll(true)}
          label={_STRINGS.PROPERTY_FACILITIES}
        />
      ) : (
        <></>
      )}

      {facilityNote ? <ClampText lines={3}>{facilityNote}</ClampText> : <></>}

      <AmenitiesModal
        show={showAll}
        amenities={amenities}
        onHide={() => setShowAll(false)}
      />
    </div>
  );
};

export default Amenities;
