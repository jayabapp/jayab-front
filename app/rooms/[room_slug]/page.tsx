import ProductSkeleton from "@/components/properties/ProductSkeleton";

import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { Metadata, ResolvingMetadata } from "next";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
const ProductImagesContainer = dynamic(() => import("@/components/properties/imageComponents/PropertiesImagesPart"));
const SinglePropertyIntroduction = dynamic(() => import("@/components/properties/SinglePropertyIntroduction"));
const SinglePropertycallender = dynamic(() => import("@/components/properties/SinglePropertycallender"));
const SinglePorpertyAccards = dynamic(() => import("@/components/properties/SinglePropertyAccards"));
type Props = {
  params: Promise<{ room_slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import { PlaceSchema, ProductSchema } from "@/components/SchemaGenerator/Schemas";
import { notFound, redirect } from "next/navigation";
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const paramData = await params;
  const { data: properyData } = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(paramData?.room_slug));

  return MehaHeaderHelper(properyData);
}

const SinglePropertyPage = async ({ params }: { params: Promise<{ room_slug: string }> }) => {
  const pageParams = await params;

  const { data: properyData } = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(pageParams?.room_slug));

  if (!properyData) {
    notFound();
  }

  if (decodeURI(properyData?.slug) != decodeURI(pageParams?.room_slug)) {
    redirect(`/rooms/${encodeURI(properyData?.slug)}`);
  }

  return (
    <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-1  md:grid-cols-2  !h-auto   !overflow-x-visible">
      {!!properyData ? (
        <>
          <ProductSchema data={properyData} />
          <PlaceSchema data={properyData} />
          <Suspense>
            {" "}
            <ProductImagesContainer productImageId={null} data={properyData} />
          </Suspense>
          <Suspense>
            {" "}
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
        <ProductSkeleton />
      )}{" "}
    </div>
  );
};

export default SinglePropertyPage;
