import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerPropertyTypes } from "@features/home/server/home.server";
import { getServerPropertyList } from "@features/home/server/home.server";
import { LandingsPlacements } from "@/enum/landings.enum";
import { getServerLandings } from "@features/home/server/home.server";
import { getServerBanners } from "@features/home/server/home.server";
import { BannerPosition } from "@/enum/banners.enum";
import { getCmsContent } from "@/api_services/home/cms-content.server";
import { homeKeys } from "@features/home/api/home.keys";

import deviceTypeDetector from "@/helpers/device.detector";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import IntlNamespaces from "@/i18n/IntlNamespaces";
import getQueryClient from "@/api_services/common/get-query-client";
import HomeTemplate from "@templates/Home";

import type { Metadata } from "next";

const HOME_BANNER_POSITIONS = [
  BannerPosition.MAIN_1,
  BannerPosition.MAIN_2,
  BannerPosition.MAIN_3,
];

export const generateMetadata = async (): Promise<Metadata> =>
  MehaHeaderHelper(await getCmsContent("homeContent"));

const HomePage = async () => {
  const [
    { data: banners },
    { data: landings },
    { data: propertyData },
    { data: propertyTypes },
    homeContent,
    devices,
  ] = await Promise.all([
    getServerBanners(HOME_BANNER_POSITIONS),
    getServerLandings(LandingsPlacements.HOME),
    getServerPropertyList(1, 12),
    getServerPropertyTypes(),
    getCmsContent("homeContent"),
    deviceTypeDetector(),
  ]);

  const queryClient = getQueryClient();
  queryClient.setQueryData(
    homeKeys.landings(LandingsPlacements.HOME),
    landings,
  );

  return (
    <IntlNamespaces namespaces={["content", "reserve"]}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeTemplate
          banners={banners}
          devices={devices}
          landings={landings}
          homeContent={homeContent}
          properties={propertyData?.data ?? []}
          propertyTypes={propertyTypes?.PROPERTY_TYPE ?? []}
        />
      </HydrationBoundary>
    </IntlNamespaces>
  );
};

export default HomePage;
