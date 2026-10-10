"use client";

import { AMENITY_PREVIEW_COUNT } from "@features/properties/constants/amenities";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toAmenityItems } from "@features/properties/mappers/amenities.mapper";

import type { PropertySpecsSectionProps } from "@/types/components/modules/property-details";

import AmenitiesModal from "./AmenitiesModal.client";
import ShowAllButton from "./ShowAllButton";
import IconListItem from "./IconListItem";
import ClampText from "./ClampText.client";

const Amenities = ({ property }: PropertySpecsSectionProps) => {
  const t = useTranslations("listing");

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
            label={item.title}
            icon={item.fallbackIcon}
            key={`${item.group}-${item.title}`}
            image={item.icon ? getPropertyImageUrl(item.icon) : null}
          />
        ))}
      </div>

      {amenities.length > preview.length ? (
        <ShowAllButton
          count={amenities.length}
          onClick={() => setShowAll(true)}
          label={t("propertyFacilities")}
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
