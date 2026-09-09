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
      <div id="homeParent" className="home-container !px-0 !pt-0 flex flex-col gap-0">
        <HomeSeo />
        {/* The two layers share this wrapper, and that is the whole point of it:
            a sticky element is bounded by its containing block, so tying the hero
            to a box that ends exactly where the sheet ends means the pin cannot
            outlive the surface that covers it.

            Without it the hero stayed pinned for the full height of
            `#homeParent`, including the page's bottom padding, and painted a band
            of the banner photo between the closing copy and the footer. Padding
            the sheet instead only moved the problem: the sheet is opaque and sits
            above the footer's z-index, so its padding covered the promo card. */}
        <div className="relative flex w-full flex-col">
          {/* Layer one: pinned. Stays at the top of the viewport while layer two
              travels up over it. */}
          {!!heroBanner ? (
            <div className="home-hero-pin">
              <HomeHeroBanner banner={heroBanner} devices={devices} title={homeContent?.full_text} />
            </div>
          ) : (
            <></>
          )}
          {/* Layer two: the sheet — everything from the popular cities to the foot
              of the page, as one surface that travels up over the hero.

              It has to be *everything*, not just the first section. The pinned
              hero is a positioned element, so it paints above any static block
              that follows it; leaving the closing banners and SEO copy outside
              the sheet left them showing through underneath it.

              `-mt` on every breakpoint, not only mobile — the overlap is what
              makes the rounded lip read as a surface resting on the photo rather
              than as the next block down the page. */}
          <div className="home-sheet -mt-[1.375rem] flex w-full flex-col gap-0 md:-mt-8">
            <section
              className={`flex flex-col gap-5 lg:gap-6 select-none px-0 md:py-0 w-full ${
                !isEmpty(landings?.popular_city) && !isEmpty(landings?.quick_search) ? "min-h-[30dvh]" : ""
              }`}
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
        </div>
      </div>
  );
};

export default HomeTemplate;
