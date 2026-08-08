import {
  OrganizationSchema,
  SearchboxSchema,
} from "@/components/SchemaGenerator/Schemas";
import { apiRoutes, baseUrl, baseUrlV } from "@/utils/urls";
import { LandingsPlacements } from "@/enum/landings.enum";
import { cache, Suspense } from "react";
import { BannerPosition } from "@/enum/banners.enum";
import { Metadata } from "next";

import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import HomeContentSection from "@/components/Home/HomeContentSection";
import deviceTypeDetector from "@/helpers/device.detector";
import HomePropertyTypes from "@/components/Home/HomePropertyTypes";
import HomeActiveReserve from "@/components/Home/HomeActiveReserve";
import BannersContainer from "@/components/Home/BannersContainer";
import TheInstallPrompt from "@/components/InstallPrompt/TheInstallPrompt";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
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
const HomePropertiesList = dynamic(
  () => import("@/components/Home/HomePropertiesList"),
);

const getHomeContent = cache(() =>
  serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("homeContent")),
);

const getBanners = () =>
  serverCall(
    baseUrlV("v2") +
      apiRoutes.BANNERS +
      `?positions[]=${BannerPosition.MAIN_1}&positions[]=${BannerPosition.MAIN_2}&positions[]=${BannerPosition.MAIN_3}`,
  );

const getLandings = () =>
  serverCall(
    baseUrl +
      apiRoutes.USER_LANDING_PAGES +
      `?placement=${LandingsPlacements.HOME}`,
  );

const getProperties = () =>
  serverCall(baseUrl + apiRoutes.GET_PROPERTIES, { page: 1, per_page: 12 });

const getPropertyTypes = () =>
  serverCall(baseUrl + apiRoutes.USER_PROP_OPTIONS + "?group[]=PROPERTY_TYPE");

export async function generateMetadata(): Promise<Metadata> {
  const { data: homeContent } = await getHomeContent();
  return MehaHeaderHelper(homeContent);
}

const Home = async () => {
  const [
    { data: banners },
    { data: landings },
    { data: propertyData },
    { data: propertyTypes },
    { data: homeContent },
    devices,
  ] = await Promise.all([
    getBanners(),
    getLandings(),
    getProperties(),
    getPropertyTypes(),
    getHomeContent(),
    deviceTypeDetector(),
  ]);
  return (
    <div
      style={{ minHeight: "100dvh" }}
      id="homeParent"
      className="home-container  !px-0 !pt-0   flex flex-col gap-0 "
    >
      <SearchboxSchema />
      <OrganizationSchema />
      {!!banners?.[BannerPosition.MAIN_1] &&
      !isEmpty(banners?.[BannerPosition.MAIN_1]) ? (
        <HomeBannerPart
          title={homeContent?.full_text}
          devices={devices}
          banners={banners?.[BannerPosition.MAIN_1] || []}
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
          data={propertyData?.data || []}
          middleBanners={banners?.[BannerPosition.MAIN_2] || []}
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
  );
};

export default Home;
