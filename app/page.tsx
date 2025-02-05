import BannersContainer from "@/components/Home/BannersContainer";
import HomeAdvisorSub from "@/components/Home/HomeAdvisorSub";
import HomeCityFilterContainer from "@/components/Home/HomeCityFilterContainer";
import HomePropertiesList from "@/components/Home/HomePropertiesList";
import HomeSearchPart from "@/components/Home/HomeSearchPart";
import HomeSkeleton from "@/components/Home/HomeSkeleton/BannerSkeleton";
import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import PopSearchbox from "@/components/SearchBoxComp/PopSearchbox";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { apiRoutes, baseUrl } from "@/utils/urls";
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
// const MiddleBanners = dynamic(() => import("@/components/shared/ImageCarousel/MiddleBanners"), {
//   ssr: true,
//   loading: () => {
//     return (
//       <div className=" min-h-[30dvh]  w-full   ">
//         <LottieLoading margin="w-full" />
//       </div>
//     );
//   },
// });
const Home = async () => {
  const { data: banners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_1`);
  const { data: middleBanners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_2`);
  const { data: landings } = await serverCall(baseUrl + apiRoutes.USER_LANDING_PAGES);
  const { data: propertyData } = await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
    cursor: 0,
    per_page: 24,
  });

  return (
    <div style={{ minHeight: "100dvh" }} id="homeParent" className="home-container  !px-0   flex flex-col gap-5 ">
      <Suspense
        fallback={
          <div className=" min-h-[30dvh] flex items-center justify-center  w-full   ">
            <HomeSkeleton />
          </div>
        }
      >
        {" "}
        {!banners ? (
          <div className=" min-h-[30dvh]  w-full   ">
            <HomeSkeleton />
          </div>
        ) : (
          <div className=" !px-0  w-full flex flex-col">
            <BannersContainer banners={banners || []} />
          </div>
        )}
      </Suspense>
      {/* {!!middleBanners ? (
        <MiddleBanners cols={2} containerClass="  pr-2 md:pr-0 py-4" list={middleBanners || []} />
      ) : (
        <></>
      )} */}

      <Suspense>
        <HomeSearchPart />
      </Suspense>
      <div className="px-3 min-h-[50dvh] select-none md:px-3 lg:px-4 2xl:px-[10%]  pt-0 md:py-0 w-full">
        <Suspense>
          <HomeAdvisorSub />
        </Suspense>
        {!landings ? (
          <LottieLoading />
        ) : (
          <Suspense fallback={<></>}>
            <HomeCityFilterContainer title={`${_STRINGS.MOST_VISITED_CITIES}`} data={landings?.popular_city || []} />{" "}
          </Suspense>
        )}
        {!landings ? (
          <LottieLoading />
        ) : (
          <Suspense fallback={<></>}>
            <MainFiltersContainer title={`${_STRINGS.FAST_SEARCH}`} data={landings?.quick_search || []} />{" "}
          </Suspense>
        )}
      </div>
      {!propertyData?.data ? (
        <LottieLoading />
      ) : (
        <Suspense fallback={<></>}>
          <HomePropertiesList middleBanners={middleBanners || []} data={propertyData?.data || []} />{" "}
        </Suspense>
      )}
    </div>
  );
};

export default Home;
