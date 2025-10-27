"use client";

import { PropertyService } from "@/api_services/property/property.service";
import Headers from "@/components/headers";
import Modal from "@/components/Modal";
import AnimationlessModal from "@/components/Modal/AnimationlessModal";
import dynamic from "next/dynamic";

import ProductSkeleton from "@/components/properties/ProductSkeleton";

// import LottieLoading from "@/components/shared/Lotties/LottieLoading";

import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import React, { useState, use, Suspense } from "react";
import { mobileFooterBlackList } from "@/utils/constantss";
import Footer from "@/components/Footer";

const ProductImagesContainer = dynamic(() => import("@/components/properties/imageComponents/PropertiesImagesPart"));
const SinglePropertyIntroduction = dynamic(() => import("@/components/properties/SinglePropertyIntroduction"));
const SinglePropertycallender = dynamic(() => import("@/components/properties/SinglePropertycallender"));
const SinglePorpertyAccards = dynamic(() => import("@/components/properties/SinglePropertyAccards"));
export default function SingleDeceasedPage({ params }: { params: Promise<{ room_slug: string }> }) {
  const incomingParams = use(params);
  const pathname = usePathname();

  const { data: properyData, isPending } = useQuery({
    queryKey: [PropertyService?.GET_SINGLEPROPERTY_SlUG_CACHEKEY, incomingParams?.room_slug],
    queryFn: () => {
      if (incomingParams?.room_slug)
        return PropertyService?.GetSinglePropertyWithSlug({ Property_slug: incomingParams?.room_slug });
      else {
        return null;
      }
    },
  });

  return (
    <AnimationlessModal
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
          <ProductSkeleton />
        ) : !!properyData ? (
          <>
            <Suspense>
              <ProductImagesContainer productImageId={null} data={properyData} />
            </Suspense>
            <Suspense>
              <SinglePropertyIntroduction data={properyData} />
            </Suspense>
            {/* <SingleMobilePropertyIntroductions data={properyData} /> */}
            <Suspense>
              <SinglePorpertyAccards data={properyData} />
            </Suspense>
            <Suspense>
              <SinglePropertycallender data={properyData} />
            </Suspense>
          </>
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </AnimationlessModal>
  );
}

// import PropertiesModal from "@/components/properties/PropertiesModal";

// import serverCall from "@/helpers/serverCall";
// import { apiRoutes, baseUrl } from "@/utils/urls";
// import { Metadata, ResolvingMetadata } from "next";
// import React from "react";

// type Props = {
//   params: Promise<{ room_slug: string }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
//   const paramData = await params;
//   const { data: properyData } = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(paramData?.room_slug));

//   return {
//     title: properyData?.title || "آگهی",
//     description: properyData?.title,
//   };
// }

// const SinglePropertyPage = async ({ params }: { params: Promise<{ room_slug: string }> }) => {
//   const pageParams = await params;

//   return <PropertiesModal room_slug={pageParams?.room_slug} />;
// };

// export default SinglePropertyPage;
