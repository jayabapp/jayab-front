import { apiRoutes, baseUrl, baseUrlV } from "@/utils/urls";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { OrganizationSchema } from "@/components/SchemaGenerator/Schemas";
import { LandingsPlacements } from "@/enum/landings.enum";
import { SearchboxSchema } from "@/components/SchemaGenerator/Schemas";
import { BannerPosition } from "@/enum/banners.enum";
import { getCmsContent } from "@/api_services/home/cms-content.server";
import { HomeService } from "@/api_services/home/home.service";
import { REVALIDATE } from "@/helpers/revalidate";
import { Suspense } from "react";
import { Metadata } from "next";

import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import HomePropertiesList from "@/components/Home/HomePropertiesList";
import HomeContentSection from "@/components/Home/HomeContentSection";
import deviceTypeDetector from "@/helpers/device.detector";
import HomePropertyTypes from "@/components/Home/HomePropertyTypes";
import HomeActiveReserve from "@/components/Home/HomeActiveReserve";
import BannersContainer from "@/components/Home/BannersContainer";
import TheInstallPrompt from "@/components/InstallPrompt/TheInstallPrompt";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import getQueryClient from "@/api_services/common/get-query-client";
import pickBanner from "@/helpers/pickBanner";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";

const HomeBannerPart = dynamic(
  () => import("@/components/Home/BannersContainer/HomeBannerPart"),
  { ssr: true },
);
const HomeCityFilterContainer = dynamic(
  () => import("@/components/Home/HomeCityFilterContainer"),
);

const getBanners = () =>
  serverCall(
    baseUrlV("v2") +
      apiRoutes.BANNERS +
      `?positions[]=${BannerPosition.MAIN_1}&positions[]=${BannerPosition.MAIN_2}&positions[]=${BannerPosition.MAIN_3}`,
    undefined,
    { revalidate: REVALIDATE.BANNERS },
  );

const getLandings = () =>
  serverCall(
    baseUrl +
      apiRoutes.USER_LANDING_PAGES +
      `?placement=${LandingsPlacements.HOME}`,
    undefined,
    { revalidate: REVALIDATE.LANDINGS },
  );

const getProperties = () =>
  serverCall(
    baseUrl + apiRoutes.GET_PROPERTIES,
    { page: 1, per_page: 12 },
    { revalidate: REVALIDATE.PROPERTY_LIST },
  );

const getPropertyTypes = () =>
  serverCall(
    baseUrl + apiRoutes.USER_PROP_OPTIONS + "?group[]=PROPERTY_TYPE",
    undefined,
    { revalidate: REVALIDATE.PROPERTY_OPTIONS },
  );

export async function generateMetadata(): Promise<Metadata> {
  return MehaHeaderHelper(await getCmsContent("homeContent"));
}

const Home = async () => {
  const [
    { data: banners },
    { data: landings },
    { data: propertyData },
    { data: propertyTypes },
    homeContent,
    devices,
  ] = await Promise.all([
    getBanners(),
    getLandings(),
    getProperties(),
    getPropertyTypes(),
    getCmsContent("homeContent"),
    deviceTypeDetector(),
  ]);

  const heroBanner = pickBanner(banners?.[BannerPosition.MAIN_1]);
  const middleBanner = pickBanner(
    banners?.[BannerPosition.MAIN_2]?.filter(
      (banner: any) => !!(devices?.isMobile ? banner?.image_sm : banner?.image),
    ),
  );

  const queryClient = getQueryClient();
  queryClient.setQueryData(
    [HomeService.USER_LANDING_PAGES_KEY, LandingsPlacements.HOME],
    landings,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        id="homeParent"
        style={{ minHeight: "100dvh" }}
        className="home-container !px-0 !pt-0 flex flex-col gap-0 "
      >
        <SearchboxSchema />
        <OrganizationSchema />
        {!!heroBanner ? (
          <HomeBannerPart
            devices={devices}
            banner={heroBanner}
            title={homeContent?.full_text}
          />
        ) : (
          <></>
        )}
        <section
          style={{
            minHeight:
              !!landings?.popular_city &&
              !isEmpty(landings?.popular_city) &&
              !!landings?.quick_search &&
              !isEmpty(landings?.quick_search)
                ? "30dvh"
                : "0",
          }}
          className=" bg-white  rounded-t-20 mb-8  -mt-[1.375rem] md:mt-0  flex flex-col  relative gap-5 lg:gap-6  select-none  px-0  md:py-0 w-full"
        >
          <Suspense fallback={null}>
            <div className="w-full   mt-3 lg:mt-0  px-0 ">
              <HomeActiveReserve />
            </div>
          </Suspense>
          <HomePropertyTypes
            title="نوع اقامتگاه"
            data={propertyTypes?.PROPERTY_TYPE}
          />{" "}
          <HomeCityFilterContainer
            devices={devices}
            data={landings?.popular_city || []}
            title={`${_STRINGS.MOST_VISITED_CITIES}`}
          />
          <MainFiltersContainer
            devices={devices}
            title={`${_STRINGS.FAST_SEARCH}`}
            data={landings?.quick_search || []}
          />
          <HomePropertiesList
            devices={devices}
            middleBanner={middleBanner}
            data={propertyData?.data || []}
          />{" "}
        </section>
        <TheInstallPrompt />
        {!!banners && !isEmpty(banners) ? (
          <BannersContainer
            devices={devices}
            banners={banners?.[BannerPosition.MAIN_3] || []}
          />
        ) : (
          <></>
        )}
        <HomeContentSection data={homeContent} />
      </div>
    </HydrationBoundary>
  );
};

export default Home;
