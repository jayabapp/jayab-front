"use client";

import { usePropertyBookmarks } from "@features/properties/hooks/usePropertyBookmarks";

import PropertyCardSkeleton from "@/components/properties/PropertyCardSkeleton";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
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
        <EmptyList />
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
