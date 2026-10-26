import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { canonicalizeDiscoveryFilters } from "@features/properties/lib/discovery-filters";
import { planDiscoveryNavigation } from "@features/properties/lib/discovery-filters";
import { getServerPropertyPage } from "@features/properties/server/property.server";
import { searchParamsToFilters } from "@features/properties/lib/search-params";
import { getServerLandingOr404 } from "@features/home/server/home.server";
import { landingQueryDefaults } from "@features/properties/lib/landing-filters";
import { seedPropertyList } from "@features/properties/server/property.server";
import { cookies, headers } from "next/headers";
import { withMapArea } from "@features/properties/lib/discovery-filter-policy";
import { redirect } from "next/navigation";

import deviceTypeDetector from "@/helpers/device.detector";
import LandingTemplate from "@templates/Landing";
import IntlNamespaces from "@/i18n/IntlNamespaces";
import getQueryClient from "@/api_services/common/get-query-client";
import queryBuilder from "@/helpers/queryBuilder";

import type { Metadata } from "next";

type LandingPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: LandingPageProps): Promise<Metadata> => {
  const [paramData, query] = await Promise.all([params, searchParams]);
  const requestHeaders = await headers();
  const xCanonical = requestHeaders?.get("x-canonical");
  const { data: landing } = await getServerLandingOr404(paramData.slug);
  const isFiltered = Object.keys(query).some((key) => key !== "page");

  const metadata: Metadata = {
    title: landing?.content?.seo?.metaTitle || landing?.content?.title,
    description:
      landing?.content?.seo?.metaDescription || landing?.content?.slug,
    alternates: {
      canonical: landing?.content?.seo?.canonicalURL || xCanonical,
    },
  };

  return isFiltered
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata;
};

const LandingPage = async ({ params, searchParams }: LandingPageProps) => {
  const [paramData, searchParamsData, devices, cookieStore] = await Promise.all(
    [params, searchParams, deviceTypeDetector(), cookies()],
  );
  const { data: landing } = await getServerLandingOr404(paramData.slug);

  const baselineFilters = canonicalizeDiscoveryFilters(
    landingQueryDefaults(landing),
  );
  const requested = searchParamsToFilters(searchParamsData);
  const filters = canonicalizeDiscoveryFilters({
    ...baselineFilters,
    ...requested,
  });

  const plan = planDiscoveryNavigation({
    baseline: baselineFilters,
    intended: requested.bbox ? withMapArea(filters, requested.bbox) : filters,
    pathname: `/${paramData.slug}`,
  });
  if (plan.path !== `/${paramData.slug}`) {
    const query = queryBuilder(plan.query);
    redirect(query ? `${plan.path}?${query}` : plan.path);
  }

  const queryClient = getQueryClient();
  if (!cookieStore.get("isLogin")?.value) {
    const page = await getServerPropertyPage(filters);
    await seedPropertyList(queryClient, filters, page?.data);
  }

  return (
    <IntlNamespaces namespaces={["content"]}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LandingTemplate
          devices={devices}
          landing={landing}
          baselineFilters={baselineFilters}
        />
      </HydrationBoundary>
    </IntlNamespaces>
  );
};

export default LandingPage;
