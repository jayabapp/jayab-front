import { HomePropertyTypes, HomeQuickSearch } from "@modules/HomeSearch";
import { HomeHeroBanner, HomeBanners } from "@modules/HomeBanners";
import { HomeActiveReservations } from "@modules/HomeReservations";
import { resolveHomeTileCount } from "@modules/HomeSearch";
import { HomeInstallPrompt } from "@modules/HomeInstallPrompt";
import { HomeSheetSearch } from "@modules/HomeHeroSearch";
import { useTranslations } from "next-intl";
import { HomeProperties } from "@modules/HomeProperties";
import { BannerPosition } from "@/enum/banners.enum";
import { HomeContent } from "@modules/HomeContent";
import { HomeCities } from "@modules/HomeCities";
import { Suspense } from "react";
import { HomeSeo } from "@modules/HomeSeo";

import type { HomeTemplateProps } from "@/types/components/templates/home";
import type { CSSProperties } from "react";

import pickBanner from "@/helpers/pickBanner";
import isEmpty from "lodash/isEmpty";

const HomeTemplate = ({
  banners,
  devices,
  landings,
  properties,
  homeContent,
  propertyTypes,
}: HomeTemplateProps) => {
  const t = useTranslations();

  const heroBanners = banners?.[BannerPosition.MAIN_1] ?? [];
  const middleBanner = pickBanner(
    banners?.[BannerPosition.MAIN_2]?.filter((banner) =>
      Boolean(devices?.isMobile ? banner?.image_sm : banner?.image),
    ),
  );

  const homeTileCount = resolveHomeTileCount(
    propertyTypes?.length,
    landings?.quick_search?.length,
  );
  return (
    <div
      id="homeParent"
      className="home-container !bg-white !px-0 !pt-0 flex flex-col gap-0"
    >
      <HomeSeo />
      <div className="relative flex w-full flex-col">
        <div className="home-hero-pin">
          <HomeHeroBanner
            devices={devices}
            banners={heroBanners}
            title={homeContent?.full_text}
          />
        </div>
        <div className="home-sheet -mt-5 flex w-full flex-col gap-0 md:-mt-8">
          {devices?.isMobile ? <HomeSheetSearch /> : <></>}
          <section
            style={{ "--home-tile-count": homeTileCount } as CSSProperties}
            className={`flex flex-col gap-5 lg:gap-6 select-none px-0 md:py-0 w-full ${
              !isEmpty(landings?.popular_city) &&
              !isEmpty(landings?.quick_search)
                ? "min-h-[30dvh]"
                : ""
            }`}
          >
            <Suspense fallback={null}>
              <div className="w-full px-0">
                <HomeActiveReservations />
              </div>
            </Suspense>
            <HomePropertyTypes
              devices={devices}
              data={propertyTypes}
              title={t("common.propertyType")}
            />
            <HomeCities
              devices={devices}
              data={landings?.popular_city ?? []}
              title={t("content.mostVisitedCities")}
            />
            <HomeQuickSearch
              devices={devices}
              title={t("footer.quickSearch")}
              data={landings?.quick_search ?? []}
            />
            <HomeProperties
              data={properties}
              devices={devices}
              middleBanner={middleBanner}
            />
          </section>
          <HomeInstallPrompt />
          {!!banners && !isEmpty(banners) ? (
            <HomeBanners
              devices={devices}
              banners={banners?.[BannerPosition.MAIN_3] ?? []}
            />
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
