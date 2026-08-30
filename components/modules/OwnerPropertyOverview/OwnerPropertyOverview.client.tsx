"use client";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { PropertyDetailsSkeleton } from "@modules/PropertyDetails";
import { PropertyGallery } from "@modules/PropertyGallery";

import OwnerPropertyIntroduction from "./OwnerPropertyIntroduction.client";
import OwnerPropertyCalendar from "./OwnerPropertyCalendar.client";
import OwnerPropertyActions from "./OwnerPropertyActions.client";

const OwnerPropertyOverview = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { data: property, isLoading } = useOwnerProperty(propertyId);

  if (isLoading) return <PropertyDetailsSkeleton />;
  if (!property) return null;

  return (
    <>
      <PropertyGallery
        title={property?.title}
        images={property?.images ?? []}
      />
      <OwnerPropertyIntroduction property={property} />
      <OwnerPropertyCalendar property={property} />
      <OwnerPropertyActions property={property} />
    </>
  );
};

export default OwnerPropertyOverview;
