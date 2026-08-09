import { Metadata, ResolvingMetadata } from "next";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { ProductSchema } from "@/components/SchemaGenerator/Schemas";
import { PlaceSchema } from "@/components/SchemaGenerator/Schemas";
import { REVALIDATE } from "@/helpers/revalidate";
import { redirect } from "next/navigation";

import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";

import ProductSkeleton from "@/components/properties/ProductSkeleton";
import serverCall from "@/helpers/serverCall";
import dynamic from "next/dynamic";

const ProductImagesContainer = dynamic(
  () => import("@/components/properties/imageComponents/PropertiesImagesPart"),
);
const SinglePropertyIntroduction = dynamic(
  () => import("@/components/properties/SinglePropertyIntroduction"),
);
const SinglePropertycallender = dynamic(
  () => import("@/components/properties/SinglePropertycallender"),
);
const SinglePorpertyAccards = dynamic(
  () => import("@/components/properties/SinglePropertyAccards"),
);
type Props = {
  params: Promise<{ room_slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const paramData = await params;
  const { data: properyData } = await serverCall(
    baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(paramData?.room_slug),
    null,
    {
      redirect404: true,
      redirect410: true,
      revalidate: REVALIDATE.PROPERTY_DETAIL,
    },
  );
  const metaHeaders = await MehaHeaderHelper(properyData, {
    descriptionLimit: 160,
  });
  return metaHeaders;
}

const SinglePropertyPage = async ({
  params,
}: {
  params: Promise<{ room_slug: string }>;
}) => {
  const pageParams = await params;

  const { data: properyData } = await serverCall(
    baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(pageParams?.room_slug),
    null,
    {
      redirect404: true,
      redirect410: true,
      revalidate: REVALIDATE.PROPERTY_DETAIL,
    },
  );

  if (decodeURI(properyData?.slug) != decodeURI(pageParams?.room_slug))
    redirect(`/rooms/${encodeURI(properyData?.slug)}`);

  return (
    <div className=" !pb-48 lg:!pb-36   gap-4 justify-start items-start container grid grid-cols-1  md:grid-cols-2  !h-auto   !overflow-x-visible">
      <div className=" w-full col-span-full hidden md:flex ">
        {" "}
        <SingleProductBreadCrumb
          dataArray={[
            { title: "خانه", link: "/" },
            { title: "آگهی ها", link: "/rooms" },
            {
              title: properyData?.title || "",
              link: "#",
            },
          ]}
        />
      </div>
      {!!properyData ? (
        <>
          <ProductSchema data={properyData} />
          <PlaceSchema data={properyData} />
          <ProductImagesContainer productImageId={null} data={properyData} />
          <div className=" w-full col-span-full flex md:hidden ">
            {" "}
            <SingleProductBreadCrumb
              dataArray={[
                { title: "خانه", link: "/" },
                { title: "آگهی ها", link: "/rooms" },
                {
                  title: properyData?.title || "",
                  link: "#",
                },
              ]}
            />
          </div>
          <SinglePropertyIntroduction data={properyData} />
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
