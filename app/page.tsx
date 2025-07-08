import HomeSearchPart from "@/components/Home/HomeSearchPart";
import HomeSkeleton from "@/components/Home/HomeSkeleton/BannerSkeleton";
import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import TheInstallPrompt from "@/components/InstallPrompt/TheInstallPrompt";
import PopSearchbox from "@/components/SearchBoxComp/PopSearchbox";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { isEmpty } from "lodash";
import dynamic from "next/dynamic";
import { Suspense } from "react";
// const BannersContainer = dynamic(() => import("@/components/Home/BannersContainer"), {
//   ssr: true,
//   loading: () => {
//     return (
//       <div className=" min-h-[30dvh]  w-full   ">
//         <HomeSkeleton />
//       </div>
//     );
//   },
// });
//4const MiddleBanners = dynamic(() => import("@/components/shared/ImageCarousel/MiddleBanners"), {
//   ssr: true,
//   loading: () => {
//     return (
//       <div className=" min-h-[30dvh]  w-full   ">
//         <LottieLoading margin="w-full" />
//       </div>
//     );4//   },
// });

const BannersContainer = dynamic(() => import("@/components/Home/BannersContainer"));
const HomeAdvisorSub = dynamic(() => import("@/components/Home/HomeAdvisorSub"));
const HomeCityFilterContainer = dynamic(() => import("@/components/Home/HomeCityFilterContainer"));
const HomePropertiesList = dynamic(() => import("@/components/Home/HomePropertiesList"));
const Home = async () => {
  const { data: banners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_1`);
  const { data: middleBanners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_2`);
  const { data: landings } = await serverCall(baseUrl + apiRoutes.USER_LANDING_PAGES);
  const { data: propertyData } = await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
    cursor: 0,
    per_page: 24,
  });

  return (
    <div style={{ minHeight: "100dvh" }} id="homeParent" className="home-container  !px-0   flex flex-col gap-3 ">
      {!!banners && !isEmpty(banners) ? (
        <Suspense>
          <BannersContainer banners={banners || []} />
        </Suspense>
      ) : (
        <></>
      )}
      {/* {!!middleBanners ? (
        <MiddleBanners cols={2} containerClass="  pr-2 md:pr-0 py-4" list={middleBanners || []} />
      ) : (
        <></>
      )} */}
      <HomeSearchPart />
      <Suspense fallback={<LottieLoading />}>
        {" "}
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
          className="px-3   relative  select-none md:px-3 lg:px-4 2xl:px-[5%]  pt-0 md:py-0 w-full"
        >
          <HomeAdvisorSub />
          {!!landings?.popular_city && !isEmpty(landings?.popular_city) ? (
            <HomeCityFilterContainer title={`${_STRINGS.MOST_VISITED_CITIES}`} data={landings?.popular_city || []} />
          ) : (
            <></>
          )}{" "}
          {!!landings?.quick_search && !isEmpty(landings?.quick_search) ? (
            <MainFiltersContainer title={`${_STRINGS.FAST_SEARCH}`} data={landings?.quick_search || []} />
          ) : (
            <></>
          )}{" "}
        </section>
      </Suspense>
      <Suspense>
        <HomePropertiesList middleBanners={middleBanners || []} data={propertyData?.data || []} /> <TheInstallPrompt />
      </Suspense>
    </div>
  );
};

export default Home;
