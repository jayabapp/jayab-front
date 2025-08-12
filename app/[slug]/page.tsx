import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Filterpage from "@/components/SinglePageComponents/Filterpage";
import SsrFilterPage from "@/components/SinglePageComponents/SsrFilterPage";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import * as Sentry from "@sentry/nextjs";
function Fallback() {
  return <LottieLoading />;
}
function isEmpty(value: any) {
  return Boolean(value && typeof value === "object") && !Object.keys(value).length;
}
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const paramData = await params;
  const { data: landings } = await serverCall(baseUrl + apiRoutes.SINGLE_USER_LANDING_PAGE(paramData?.slug));

  return {
    title: landings?.content?.seo?.metaTitle || landings?.content?.title,
    description: landings?.content?.seo?.metaDescription || landings?.content?.slug,

    other: {
      ...Sentry.getTraceData(),
    },
  };
}

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<any>;
}) {
  const paramData = await params;
  const searchParamsData = await searchParams;
  const { data: landings } = await serverCall(baseUrl + apiRoutes.SINGLE_USER_LANDING_PAGE(paramData?.slug));

  const data = (await !isEmpty(searchParamsData))
    ? await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
        cursor: 0,
        per_page: 51,
        ...searchParamsData,
      })
    : null;
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <SsrFilterPage firstData={data?.data ? data?.data : []} landings={landings} />
      </Suspense>
    </>
  );
}
