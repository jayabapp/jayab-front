"use client";

import { useOwnerProperty } from "@features/owner-property/hooks/useOwnerProperty";
import { useParams } from "next/navigation";

import SingleOwnerPropertyIntroduction from "@/components/properties/owner/SingleOwnerPropertyIntroduction";
import SingleOwnerPropertycallender from "@/components/properties/owner/SingleOwnerPropertycallender";
import SingleOwnerPropertyOptons from "@/components/properties/owner/SingleOwnerPropertyOptons.tsx";
import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import ProductSkeleton from "@/components/properties/ProductSkeleton";

const OwnerSingleProperty = () => {
  const params = useParams();
  const { property_id } = params;
  const { data, isLoading, refetch } = useOwnerProperty(`${property_id ?? ""}`);
  return (
    <div className=" profile-container  !pb-48 lg:!pb-36   gap-4 justify-start items-start  grid grid-cols-1  md:grid-cols-2  !h-auto    ">
      {!!isLoading ? (
        <ProductSkeleton />
      ) : !!data ? (
        <>
          <ProductImagesContainer productImageId={null} data={data} />
          <SingleOwnerPropertyIntroduction data={data} />
          <SingleOwnerPropertycallender
            data={data}
            setRefresh={() => void refetch()}
          />
          <SingleOwnerPropertyOptons
            data={data}
            setRefresh={() => void refetch()}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OwnerSingleProperty;
