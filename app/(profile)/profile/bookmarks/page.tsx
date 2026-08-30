"use client";

import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import { usePropertyBookmarks } from "@features/properties/hooks/usePropertyBookmarks";

import EmptyState from "@elements/EmptyState";
import isEmpty from "lodash/isEmpty";

const BookMarks = () => {
  const { data: properties, isLoading } = usePropertyBookmarks();

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
          {" "}
          {properties?.map((e) => (
            <PropertyCard data={e} key={`propertyCard${e?.id}`} />
          ))}{" "}
        </div>
      )}
    </div>
  );
};

export default BookMarks;
