import BannersContainer from "@/components/Home/BannersContainer";
import HomeActiveReserve from "@/components/Home/HomeActiveReserve";
import HomeContentSection from "@/components/Home/HomeContentSection";
import HomePropertyTypes from "@/components/Home/HomePropertyTypes";
import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import TheInstallPrompt from "@/components/InstallPrompt/TheInstallPrompt";
import { OrganizationSchema, SearchboxSchema } from "@/components/SchemaGenerator/Schemas";
import { BannerPosition } from "@/enum/banners.enum";
import { LandingsPlacements } from "@/enum/landings.enum";
import deviceTypeDetector from "@/helpers/device.detector";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { apiRoutes, baseUrl, baseUrlV } from "@/utils/urls";
import isEmpty from "lodash/isEmpty";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const HomeBannerPart = dynamic(() => import("@/components/Home/BannersContainer/HomeBannerPart"));
const HomeCityFilterContainer = dynamic(() => import("@/components/Home/HomeCityFilterContainer"));
const HomePropertiesList = dynamic(() => import("@/components/Home/HomePropertiesList"));

export async function generateMetadata(): Promise<Metadata> {
  const { data: homeContent } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("homeContent"));
  return MehaHeaderHelper(homeContent);
}

const Home = async () => {
  const { data: banners } = await serverCall(
    baseUrlV("v2") +
      apiRoutes.BANNERS +
      `?positions[]=${BannerPosition.MAIN_1}&positions[]=${BannerPosition.MAIN_2}&positions[]=${BannerPosition.MAIN_3}`,
  );

  const { data: landings } = await serverCall(
    baseUrl + apiRoutes.USER_LANDING_PAGES + `?placement=${LandingsPlacements.HOME}`,
  );
  const { data: propertyData } = await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
    page: 1,
    per_page: 12,
  });
  const { data: propertyTypes } = await serverCall(baseUrl + apiRoutes.USER_PROP_OPTIONS + "?group[]=PROPERTY_TYPE");
  const { data: homeContent } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("homeContent"));
  const devices = await deviceTypeDetector();
  return (
    <div style={{ minHeight: "100dvh" }} id="homeParent" className="home-container  !px-0 !pt-0   flex flex-col gap-0 ">
      <SearchboxSchema />
      <OrganizationSchema />
      {!!banners?.[BannerPosition.MAIN_1] && !isEmpty(banners?.[BannerPosition.MAIN_1]) ? (
        <HomeBannerPart devices={devices} banners={banners?.[BannerPosition.MAIN_1] || []} />
      ) : (
        <></>
      )}
      {/* {!!middleBanners ? (
        <MiddleBanners cols={2} containerClass="  pr-2 md:pr-0 py-4" list={middleBanners || []} />
      ) : (
        <></>
      )} */}{" "}
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
        <HomePropertyTypes title="نوع اقامتگاه" data={propertyTypes?.PROPERTY_TYPE} />{" "}
        {/* {!!landings?.popular_city && !isEmpty(landings?.popular_city) ? ( */}
        <HomeCityFilterContainer
          devices={devices}
          title={`${_STRINGS.MOST_VISITED_CITIES}`}
          data={landings?.popular_city || []}
        />
        {/* ) : (
          <></>
        )}{" "} */}
        {/* {!!landings?.quick_search && !isEmpty(landings?.quick_search) ? ( */}
        <MainFiltersContainer devices={devices} title={`${_STRINGS.FAST_SEARCH}`} data={landings?.quick_search || []} />
        {/* ) : (
          <></>
        )}{" "} */}
        <HomePropertiesList
          middleBanners={banners?.[BannerPosition.MAIN_2] || []}
          data={propertyData?.data || []}
          devices={devices}
        />{" "}
      </section>
      <TheInstallPrompt />
      {!!banners && !isEmpty(banners) ? (
        <BannersContainer devices={devices} banners={banners?.[BannerPosition.MAIN_3] || []} />
      ) : (
        <></>
      )}
      <HomeContentSection data={homeContent} />
    </div>
  );
};

export default Home;
