import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import ProductSkeleton from "@/components/properties/ProductSkeleton";
import SinglePorpertyAccards from "@/components/properties/SinglePropertyAccards";
import SinglePropertycallender from "@/components/properties/SinglePropertycallender";
import SinglePropertyIntroduction from "@/components/properties/SinglePropertyIntroduction";

import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ room_slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const paramData = await params;
  const { data: properyData } = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(paramData?.room_slug));

  return {
    title: properyData?.title || "آگهی",
    description: properyData?.title,
  };
}

const SinglePropertyPage = async ({ params }: { params: Promise<{ room_slug: string }> }) => {
  const pageParams = await params;

  const { data: properyData } = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(pageParams?.room_slug));

  return (
    <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-1  md:grid-cols-2  !h-auto   !overflow-x-visible">
      {!!properyData ? (
        <>
          <ProductImagesContainer productImageId={null} data={properyData} />
          <SinglePropertyIntroduction data={properyData} />
          {/* <SingleMobilePropertyIntroductions data={properyData} /> */}
          <SinglePorpertyAccards data={properyData} />

          <SinglePropertycallender data={properyData} />
        </>
      ) : (
        <ProductSkeleton />
      )}{" "}
    </div>
  );
};

export default SinglePropertyPage;
