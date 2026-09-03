import type { HomeTemplateProps } from "@/types/components/templates/home";
import { HomePropertyTypes, HomeQuickSearch } from "@modules/HomeSearch";
import { HomeHeroBanner, HomeBanners } from "@modules/HomeBanners";
import { HomeActiveReservations } from "@modules/HomeReservations";
import { HomeInstallPrompt } from "@modules/HomeInstallPrompt";
import { HomeProperties } from "@modules/HomeProperties";
import { BannerPosition } from "@/enum/banners.enum";
import { HomeContent } from "@modules/HomeContent";
import { HomeCities } from "@modules/HomeCities";
import { HomeSeo } from "@modules/HomeSeo";
import { Suspense } from "react";

import pickBanner from "@/helpers/pickBanner";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const HomeTemplate = ({ banners, devices, homeContent, landings, properties, propertyTypes }: HomeTemplateProps) => {
  const heroBanner = pickBanner(banners?.[BannerPosition.MAIN_1]);
  const middleBanner = pickBanner(
    banners?.[BannerPosition.MAIN_2]?.filter((banner) => Boolean(devices?.isMobile ? banner?.image_sm : banner?.image)),
  );
  return (
      <div id="homeParent" style={{ minHeight: "100dvh" }} className="home-container !px-0 !pt-0 flex flex-col gap-0">
        <HomeSeo />
        {!!heroBanner ? <HomeHeroBanner banner={heroBanner} devices={devices} title={homeContent?.full_text} /> : <></>}
        <section
          style={{ minHeight: !isEmpty(landings?.popular_city) && !isEmpty(landings?.quick_search) ? "30dvh" : "0" }}
          className="rounded-t-20 mb-8 -mt-[1.375rem] md:mt-0 flex flex-col relative gap-5 lg:gap-6 select-none px-0 md:py-0 w-full"
        >
          <Suspense fallback={null}>
            <div className="w-full mt-3 lg:mt-0 px-0">
              <HomeActiveReservations />
            </div>
          </Suspense>
          <HomePropertyTypes data={propertyTypes} devices={devices} title={_STRINGS.PROPERTY_TYPE} />
          <HomeCities data={landings?.popular_city ?? []} title={_STRINGS.MOST_VISITED_CITIES} />
          <HomeQuickSearch data={landings?.quick_search ?? []} devices={devices} title={_STRINGS.FAST_SEARCH} />
          <HomeProperties data={properties} devices={devices} middleBanner={middleBanner} />
        </section>
        <HomeInstallPrompt />
        {!!banners && !isEmpty(banners) ? (
          <HomeBanners banners={banners?.[BannerPosition.MAIN_3] ?? []} devices={devices} />
        ) : (
          <></>
        )}
        <HomeContent data={homeContent ?? null} />
      </div>
  );
};

export default HomeTemplate;
