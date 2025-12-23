import ModalServer from "./ModalServer";

type Props = {
  params: Promise<{ room_slug: string }>;
};

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const paramData = await params;
//   const response: any = await serverCall(baseUrl + apiRoutes.GET_SINGLEPROPERTY_SlUG(paramData?.room_slug));

//   const properyData = response?.data || null;

//   return {
//     title: properyData?.title || "آگهی",
//     description: properyData?.title || "",
//   };
// }

export default async function Page({ params }: { params: Promise<{ room_slug: string }> }) {
  const pageParams = await params;
  // return <ModalClient params={pageParams} />;
  return (
    <>
      <ModalServer params={params} />
    </>
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
