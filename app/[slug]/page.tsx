import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerPropertyPage } from "@features/properties/server/property.server";
import { searchParamsToFilters } from "@features/properties/lib/search-params";
import { landingQueryDefaults } from "@features/properties/lib/landing-filters";
import { seedPropertyList } from "@features/properties/server/property.server";
import { getServerLanding } from "@features/home/server/home.server";
import { headers } from "next/headers";

import deviceTypeDetector from "@/helpers/device.detector";
import LandingTemplate from "@templates/Landing";
import getQueryClient from "@/api_services/common/get-query-client";

import type { Metadata } from "next";

type LandingPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
}: LandingPageProps): Promise<Metadata> => {
  const paramData = await params;
  const requestHeaders = await headers();
  const xCanonical = requestHeaders?.get("x-canonical");
  const { data: landing } = await getServerLanding(paramData.slug);

  return {
    title: landing?.content?.seo?.metaTitle || landing?.content?.title,
    description:
      landing?.content?.seo?.metaDescription || landing?.content?.slug,
    alternates: {
      canonical: landing?.content?.seo?.canonicalURL || xCanonical,
    },
  };
};

const LandingPage = async ({ params, searchParams }: LandingPageProps) => {
  const [paramData, searchParamsData, devices] = await Promise.all([
    params,
    searchParams,
    deviceTypeDetector(),
  ]);
  const { data: landing } = await getServerLanding(paramData.slug);

  const filters = {
    ...landingQueryDefaults(landing),
    ...searchParamsToFilters(searchParamsData),
  };

  const queryClient = getQueryClient();
  const page = await getServerPropertyPage(filters);
  seedPropertyList(queryClient, filters, page?.data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingTemplate devices={devices} landing={landing} />
    </HydrationBoundary>
  );
};

export default LandingPage;
