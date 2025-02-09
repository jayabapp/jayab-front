import ProductImagesContainer from "@/components/properties/imageComponents/PropertiesImagesPart";
import ProductSkeleton from "@/components/properties/ProductSkeleton";
import SinglePorpertyAccards from "@/components/properties/SinglePropertyAccards";
import SinglePropertycallender from "@/components/properties/SinglePropertycallender";
import SinglePropertyIntroduction from "@/components/properties/SinglePropertyIntroduction";
import SingleMobilePropertyIntroductions from "@/components/properties/SinglePropertyIntroduction/SingleMobilePropertyIntroductions";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import Callender from "@/components/widgets/DatePicker/callender";
import serverCall from "@/helpers/serverCall";
import { fakeVilla } from "@/utils/faker";
import { apiRoutes, baseUrl } from "@/utils/urls";
import moment from "moment-jalaali";
import { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ room_slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const room_slug = (await params).room_slug;
  const { data: properyData } = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(room_slug));

  return {
    title: properyData?.title,
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
