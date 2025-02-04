"use client";

import { PropertyService } from "@/api_services/property/property.service";
import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import SingleOwnerPropertycallender from "@/components/properties/owner/SingleOwnerPropertycallender";
import SingleOwnerPropertyIntroduction from "@/components/properties/owner/SingleOwnerPropertyIntroduction";
import SingleOwnerPropertyOptons from "@/components/properties/owner/SingleOwnerPropertyOptons.tsx";
import ProductSkeleton from "@/components/properties/ProductSkeleton";

import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const OwnerSingleProperty = () => {
  const params = useParams();
  const [refresh, setRefresh] = useState(false);
  const { property_id } = params;
  const { data, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROPERTIES_CACHEKEY, property_id, refresh],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.GetSingleOwnerProperty({ property_id: `${property_id}` });
      } else return null;
    },
  });
  return (
    <div className=" profile-container  !pb-48 lg:!pb-36   gap-4 justify-start items-start  grid grid-cols-1  md:grid-cols-2  !h-auto    ">
      {!!isLoading ? (
        <ProductSkeleton />
      ) : !!data ? (
        <>
          {" "}
          <ProductImagesContainer productImageId={null} data={data} />
          <SingleOwnerPropertyIntroduction data={data} />
          <SingleOwnerPropertycallender data={data} setRefresh={setRefresh} />
          <SingleOwnerPropertyOptons data={data} setRefresh={setRefresh} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OwnerSingleProperty;
