import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerPropertyPage } from "@features/properties/server/property.server";
import { searchParamsToFilters } from "@features/properties/lib/search-params";
import { PropertyGridSkeleton } from "@modules/PropertyGrid";
import { seedPropertyList } from "@features/properties/server/property.server";
import { Suspense } from "react";
import { cookies } from "next/headers";

import deviceTypeDetector from "@/helpers/device.detector";
import getQueryClient from "@/api_services/common/get-query-client";
import RoomsTemplate from "@templates/Rooms";

type RoomsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
