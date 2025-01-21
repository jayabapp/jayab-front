"use client";

import { PropertyService } from "@/api_services/property/property.service";
import Headers from "@/components/headers";
import Modal from "@/components/Modal";
import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import SinglePorpertyAccards from "@/components/properties/SinglePropertyAccards";
import SinglePropertycallender from "@/components/properties/SinglePropertycallender";
import SinglePropertyIntroduction from "@/components/properties/SinglePropertyIntroduction";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";

import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import React, { useState, use } from "react";

export default function SingleDeceasedPage({ params }: { params: Promise<{ property_slug: string }> }) {
  const incomingParams = use(params);
  const pathname = usePathname();

  const { data: properyData, isPending } = useQuery({
    queryKey: [PropertyService?.GET_SINGLEPROPERTY_SlUG_CACHEKEY, incomingParams?.property_slug],
    queryFn: () => {
      if (incomingParams?.property_slug)
        return PropertyService?.GetSinglePropertyWithSlug({ Property_slug: incomingParams?.property_slug });
      else {
        return null;
      }
    },
  });

  return (
    <Modal
      onHide={() => {}}
      show={pathname.includes("rooms/") ? true : false}
      options={{
        containerClass:
          " app-size app-text  relative  rounded-lg overflow-y-scroll  bg-white !rounded-none dark:bg-dark-900",
        parentClass: "bg-white",
      }}
    >
      <Headers />
      <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-1  md:grid-cols-2  !h-auto   !overflow-x-visible">
        {!!isPending ? (
          <LottieLoading />
        ) : !!properyData ? (
          <>
            <ProductImagesContainer productImageId={null} data={properyData} />
            <SinglePropertyIntroduction data={properyData} />
            {/* <SingleMobilePropertyIntroductions data={properyData} /> */}
            <SinglePorpertyAccards data={properyData} />
            <SinglePropertycallender data={properyData} />
          </>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
}
