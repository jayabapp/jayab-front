"use client";
import { PropertyService } from "@/api_services/property/property.service";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useQuery } from "@tanstack/react-query";
import isEmpty from "lodash/isEmpty";

const Properties = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROPERTIES_LIST_CACHEKEY],

    queryFn: () => {
      return PropertyService.GetOwnerPropertiesList();
    },
  });

  return (
    <div className=" profile-container    ">
      {isLoading ? (
        <LottieLoading />
      ) : isEmpty(properties) ? (
        <EmptyList />
      ) : (
        <div className="w-full p-2  !grid  gap-4 grid-cols-1 md:grid-cols-2 ">
          {" "}
          {properties?.map((e) => (
            <PropertyCard isOwner data={e} key={`propertyCard${e?.id}`} />
          ))}{" "}
        </div>
      )}
    </div>
  );
};

export default Properties;
