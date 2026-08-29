import { getServerBanners, getServerLandings, getServerPropertyList, getServerPropertyTypes } from "@features/home/server/home.server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { LandingsPlacements } from "@/enum/landings.enum";
import { BannerPosition } from "@/enum/banners.enum";
import { getCmsContent } from "@/api_services/home/cms-content.server";
import { homeKeys } from "@features/home/api/home.keys";

import HomeTemplate from "@templates/Home";
import deviceTypeDetector from "@/helpers/device.detector";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import getQueryClient from "@/api_services/common/get-query-client";

import type { Metadata } from "next";

const HOME_BANNER_POSITIONS = [BannerPosition.MAIN_1, BannerPosition.MAIN_2, BannerPosition.MAIN_3];

export const generateMetadata = async (): Promise<Metadata> =>
  MehaHeaderHelper(await getCmsContent("homeContent"));

const HomePage = async () => {
  const [{ data: banners }, { data: landings }, { data: propertyData }, { data: propertyTypes }, homeContent, devices] =
    await Promise.all([
      getServerBanners(HOME_BANNER_POSITIONS),
      getServerLandings(LandingsPlacements.HOME),
      getServerPropertyList(1, 12),
      getServerPropertyTypes(),
      getCmsContent("homeContent"),
      deviceTypeDetector(),
    ]);

  const queryClient = getQueryClient();
  queryClient.setQueryData(homeKeys.landings(LandingsPlacements.HOME), landings);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeTemplate
        banners={banners}
        devices={devices}
        homeContent={homeContent}
        landings={landings}
        properties={propertyData?.data ?? []}
        propertyTypes={propertyTypes?.PROPERTY_TYPE ?? []}
      />
    </HydrationBoundary>
  );
};

export default HomePage;
