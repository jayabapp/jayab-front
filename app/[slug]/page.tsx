import { apiRoutes, baseUrl } from "@/utils/urls";
import { getServerLanding } from "@features/home/server/home.server";
import { REVALIDATE } from "@/helpers/revalidate";
import { Metadata } from "next";
import { headers } from "next/headers";

import deviceTypeDetector from "@/helpers/device.detector";
import SsrFilterPage from "@/components/SinglePageComponents/SsrFilterPage";
import serverCall from "@/helpers/serverCall";
import isArray from "lodash/isArray";

function isEmpty(value: any) {
  return (
    Boolean(value && typeof value === "object") && !Object.keys(value).length
  );
}
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramData = await params;
  const requestHeaders = await headers();
  const xCanonical = await requestHeaders?.get("x-canonical");

  const { data: landings } = await getServerLanding(paramData.slug);

  return {
    title: landings?.content?.seo?.metaTitle || landings?.content?.title,
    description:
      landings?.content?.seo?.metaDescription || landings?.content?.slug,
    alternates: {
      canonical: landings?.content?.seo?.canonicalURL || xCanonical,
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
  const { data: landings } = await getServerLanding(paramData.slug);

  let defaults: any = {};
  if (!!landings?.query) {
    Object.keys(landings?.query)?.map((e) => {
      if (isArray(landings?.query?.[e]))
        return (defaults[e] = `${landings?.query?.[e]?.map((x) => x)}`);
      else return (defaults[e] = landings?.query?.[e]);
    });
  }

  const data =
    ((await !isEmpty(searchParamsData)) || (await !isEmpty(defaults))) &&
    !searchParamsData?.page
      ? await serverCall(
          baseUrl + apiRoutes.GET_PROPERTIES,
          {
            page: 1,
            per_page: 30,
            ...defaults,
            ...searchParamsData,
          },
          { revalidate: REVALIDATE.PROPERTY_LIST },
        )
      : null;
  const devices = await deviceTypeDetector();
  return (
    <>
      <SsrFilterPage
        devices={devices}
        landings={landings}
        firstData={data?.data ? data?.data : []}
      />
    </>
  );
}
