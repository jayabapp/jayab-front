import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Filterpage from "@/components/SinglePageComponents/Filterpage";
import SsrFilterPage from "@/components/SinglePageComponents/SsrFilterPage";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { Suspense } from "react";

function Fallback() {
  return <LottieLoading />;
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

  const { data: firstData } = await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
    cursor: 0,
    per_page: 20,
    ...searchParamsData,
  });

  return (
    <>
      <Suspense fallback={<Fallback />}>
        <SsrFilterPage firstData={firstData} landings={landings} />
      </Suspense>
    </>
  );
}
