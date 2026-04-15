import HomeActiveReserve from "@/components/Home/HomeActiveReserve";
import HomePropertyTypes from "@/components/Home/HomePropertyTypes";
import HomeSearchPart from "@/components/Home/HomeSearchPart";
import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import TheInstallPrompt from "@/components/InstallPrompt/TheInstallPrompt";
import { OrganizationSchema, SearchboxSchema } from "@/components/SchemaGenerator/Schemas";
import deviceTypeDetector from "@/helpers/device.detector";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { apiRoutes, baseUrl } from "@/utils/urls";
import isEmpty from "lodash/isEmpty";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const HomeBannerPart = dynamic(() => import("@/components/Home/BannersContainer/HomeBannerPart"));
const HomeCityFilterContainer = dynamic(() => import("@/components/Home/HomeCityFilterContainer"));
const HomePropertiesList = dynamic(() => import("@/components/Home/HomePropertiesList"));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: " اجاره ویلا و سوییت تمیز و امن در شمال و سراسر ایران ",
    description:
      "رزرو آنی ویلا و سوییت در شمال و سراسر ایران؛ اجاره ویلا بدون کمیسیون و بی‌ واسطه با آدرس و شماره مستقیم میزبان. بیش از هزار اقامتگاه تمیز و امن | جایاب",
  };
}

const Home = async () => {
  const { data: banners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_1`);
  const { data: middleBanners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_2`);
  const { data: landings } = await serverCall(baseUrl + apiRoutes.USER_LANDING_PAGES);
  const { data: propertyData } = await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
    page: 1,
    per_page: 24,
  });
  const { data: propertyTypes } = await serverCall(baseUrl + apiRoutes.USER_PROP_OPTIONS + "?group[]=PROPERTY_TYPE");

  const devices = await deviceTypeDetector();

  return (
    <div style={{ minHeight: "100dvh" }} id="homeParent" className="home-container  !px-0 !pt-0   flex flex-col gap-5 ">
      <SearchboxSchema />
      <OrganizationSchema />
      {!!banners && !isEmpty(banners) ? <HomeBannerPart devices={devices} banners={banners || []} /> : <></>}
      {/* {!!middleBanners ? (
        <MiddleBanners cols={2} containerClass="  pr-2 md:pr-0 py-4" list={middleBanners || []} />
      ) : (
        <></>
      )} */}{" "}
      <Suspense fallback={null}>
        <HomeSearchPart />
      </Suspense>
      <Suspense fallback={null}>
        <div className="w-full px-4 md:px-[20%] lg:px-[35%]">
          <HomeActiveReserve />
        </div>
      </Suspense>
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
        className="px-3  flex flex-col  relative gap-6  select-none md:px-3 lg:px-4 2xl:px-[5%]  pt-0 md:py-0 w-full"
      >
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
      </section>
      <HomePropertiesList middleBanners={middleBanners || []} data={propertyData?.data || []} /> <TheInstallPrompt />
    </div>
  );
};

export default Home;
