import HomePropertiesList from "@/components/Home/HomePropertiesList";
import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { apiRoutes, baseUrl } from "@/utils/urls";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const BannersContainer = dynamic(() => import("@/components/Home/BannersContainer"), {
  ssr: true,
  loading: () => {
    return (
      <div className=" min-h-[30dvh]  w-full   ">
        <LottieLoading margin="w-full" />
      </div>
    );
  },
});
const MiddleBanners = dynamic(() => import("@/components/shared/ImageCarousel/MiddleBanners"), {
  ssr: true,
  loading: () => {
    return (
      <div className=" min-h-[30dvh]  w-full   ">
        <LottieLoading margin="w-full" />
      </div>
    );
  },
});
const Home = async () => {
  const { data: banners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_1`);
  const { data: middleBanners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=main_2`);
  const { data: landings } = await serverCall(baseUrl + apiRoutes.USER_LANDING_PAGES);
  const { data: propertyData } = await serverCall(baseUrl + apiRoutes.GET_PROPERTIES, {
    cursor: 0,
    per_page: 27,
  });
  return (
    <div id="homeParent" className="home-container  !px-0   flex flex-col gap-10 ">
      {!banners ? (
        <LottieLoading />
      ) : (
        <div className=" !px-0  w-full flex flex-col">
          <BannersContainer banners={banners || []} />
        </div>
      )}
      {!!middleBanners ? (
        <MiddleBanners cols={2} containerClass="  pr-2 md:pr-0 py-4" list={middleBanners || []} />
      ) : (
        <></>
      )}
      {!landings ? (
        <LottieLoading />
      ) : (
        <Suspense fallback={<></>}>
          <MainFiltersContainer title={`${_STRINGS.FAST_SEARCH}`} data={landings || []} />{" "}
        </Suspense>
      )}
      {!propertyData?.data ? (
        <LottieLoading />
      ) : (
        <Suspense fallback={<></>}>
          <HomePropertiesList data={propertyData?.data || []} />{" "}
        </Suspense>
      )}
    </div>
  );
};

export default Home;
