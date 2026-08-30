"use client";

import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import { useOwnerProperties } from "@features/owner-property/hooks/useOwnerProperties";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { useState } from "react";

import OwnerPhotoUpgradeModal from "@/components/profile/photo-upgrade/OwnerPhotoUpgradeModal";
import EmptyState from "@elements/EmptyState";
import isEmpty from "lodash/isEmpty";

const Properties = () => {
  const [selectedPhotoUpgradeProperty, setSelectedPhotoUpgradeProperty] =
    useState<PropertyListDto | null>(null);

  const { data: properties, isLoading } = useOwnerProperties();

  return (
    <div className=" profile-container    ">
      {isLoading ? (
        <div className="grid w-full grid-cols-1 gap-4 p-2 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : isEmpty(properties) ? (
        <EmptyState />
      ) : (
        <div className="w-full p-2  !grid  gap-4 grid-cols-1 md:grid-cols-2 ">
          {properties?.map((e) => (
            <PropertyCard
              isOwner
              data={e}
              key={`propertyCard${e?.id}`}
              onPhotoUpgradeClick={setSelectedPhotoUpgradeProperty}
            />
          ))}
        </div>
      )}
      <OwnerPhotoUpgradeModal
        property={selectedPhotoUpgradeProperty}
        onHide={() => setSelectedPhotoUpgradeProperty(null)}
      />
    </div>
  );
};

export default Properties;
