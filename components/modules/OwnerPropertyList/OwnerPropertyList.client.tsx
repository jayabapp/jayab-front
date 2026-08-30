"use client";

import { useOwnerProperties } from "@features/owner-property/hooks/useOwnerProperties";
import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import type { PropertyListDto } from "@/types/features/properties";
import { useState } from "react";

import OwnerPhotoUpgradeModal from "@/components/profile/photo-upgrade/OwnerPhotoUpgradeModal";
import EmptyState from "@elements/EmptyState";
import isEmpty from "lodash/isEmpty";

const SKELETON_COUNT = 4;

const OwnerPropertyList = () => {
  const [photoUpgradeProperty, setPhotoUpgradeProperty] =
    useState<PropertyListDto | null>(null);
  const { data: properties, isLoading } = useOwnerProperties();

  return (
    <>
      {isLoading ? (
        <div className="grid w-full grid-cols-1 gap-4 p-2 md:grid-cols-2">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : isEmpty(properties) ? (
        <EmptyState />
      ) : (
        <div className="w-full p-2 !grid gap-4 grid-cols-1 md:grid-cols-2">
          {properties?.map((property) => (
            <PropertyCard
              isOwner
              data={property}
              key={`propertyCard${property?.id}`}
              onPhotoUpgradeClick={setPhotoUpgradeProperty}
            />
          ))}
        </div>
      )}

      <OwnerPhotoUpgradeModal
        property={photoUpgradeProperty}
        onHide={() => setPhotoUpgradeProperty(null)}
      />
    </>
  );
};

export default OwnerPropertyList;
