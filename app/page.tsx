import BannersContainer from "@/components/Home/BannersContainer";
import MainFiltersContainer from "@/components/Home/MainFiltersContainer";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { Suspense } from "react";

const Home = async () => {
  const { data: banners } = await serverCall(baseUrl + apiRoutes.BANNERS + `?position=MAIN_MIDDLE`);
  const { data: landings } = await serverCall(baseUrl + apiRoutes.USER_LANDING_PAGES);
  return (
    <div id="homeParent" className="home-container  !px-0   flex flex-col gap-10 ">
      {!banners ? (
        <LottieLoading />
      ) : (
        <div className=" !px-0  w-full flex flex-col">
          <BannersContainer banners={banners || []} />
        </div>
      )}
      {!landings ? (
        <LottieLoading />
      ) : (
        <Suspense fallback={<></>}>
          <MainFiltersContainer title={`${_STRINGS.FAST_SEARCH}`} data={landings || []} />{" "}
        </Suspense>
      )}
    </div>
  );
};

export default Home;
