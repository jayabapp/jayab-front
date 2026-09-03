import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerPropertyPage } from "@features/properties/server/property.server";
import { searchParamsToFilters } from "@features/properties/lib/search-params";
import { PropertyGridSkeleton } from "@modules/PropertyGrid";
import { seedPropertyList } from "@features/properties/server/property.server";
import { Suspense } from "react";
import { cookies } from "next/headers";

import type { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import deviceTypeDetector from "@/helpers/device.detector";
import _STRINGS from "@/utils/LocalStrings";
import getQueryClient from "@/api_services/common/get-query-client";
import RoomsTemplate from "@templates/Rooms";

type RoomsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The listing had no metadata of its own at all — no title, no description, no
 * canonical — while the property pages it links to each had theirs. Search
 * engines were left to name the site's main commercial page themselves.
 *
 * Filtered variants are marked `noindex, follow`: `?welfare=3,7&min_price=…`
 * produces effectively unbounded near-duplicate URLs of the same catalogue.
 * `follow` still lets the crawler walk through them to the property pages,
 * which are the pages worth indexing.
 */
export const generateMetadata = async ({
  searchParams,
}: RoomsPageProps): Promise<Metadata> => {
  const params = await searchParams;
  const isFiltered = Object.keys(params).some((key) => key !== "page");

  const metadata = await MehaHeaderHelper({
    title: _STRINGS.ROOMS_PAGE_TITLE,
    seo: {
      metaTitle: _STRINGS.ROOMS_PAGE_META_TITLE,
      metaDescription: _STRINGS.ROOMS_PAGE_META_DESCRIPTION,
    },
  });

  return isFiltered
    ? { ...metadata, robots: { index: false, follow: true } }
    : metadata;
};

const PropertiesPage = async ({ searchParams }: RoomsPageProps) => {
  const [searchParamsData, devices, cookieStore] = await Promise.all([
    searchParams,
    deviceTypeDetector(),
    cookies(),
  ]);

  const filters = searchParamsToFilters(searchParamsData);
  const queryClient = getQueryClient();

  if (!cookieStore.get("isLogin")?.value) {
    const page = await getServerPropertyPage(filters);
    seedPropertyList(queryClient, filters, page?.data);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PropertyGridSkeleton />}>
        <RoomsTemplate devices={devices} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default PropertiesPage;
