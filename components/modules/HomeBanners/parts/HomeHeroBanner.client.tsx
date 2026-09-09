"use client";

import type { HomeHeroBannerProps } from "@/types/components/modules/home";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { HomeHeroSearch } from "@modules/HomeHeroSearch";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Editable from "@elements/Editable";

const HomeBannerPart = ({
  title,
  devices,
  banner: item,
}: HomeHeroBannerProps) => {
  const isPhone = !!devices?.isMobile;
  return (
    <div className="relative w-full h-full px-0">
      <div aria-label={item?.image?.alt || item?.title}>
        <Editable
          isBanner
          contentId={item?.id}
          editIconClass="!top-auto !bottom-0"
          className="relative aspect-[3.029] w-full px-0 transition-all duration-300 ease-in-out focus:outline-none"
        >
          <ContentImage
            fill
            preload
            sizes="100vw"
            alt={item?.image?.alt ?? ""}
            src={getHomeImageUrl(item?.image)}
            className={`flex size-full object-cover align-middle ${
              item?.imageClasses ? item?.imageClasses : ""
            }`}
          />
        </Editable>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3 px-4 pb-9 pt-4 md:absolute md:inset-x-0 md:bottom-0 md:justify-end md:gap-6 md:pt-0 md:pb-14">
        <div className="home-hero-content flex max-w-2xl flex-col items-center gap-2 text-center md:gap-3">
          <ContentImage
            width={320}
            height={166}
            alt={_STRINGS.HOME_TITLE}
            sizes="(max-width: 1024px) 112px, 160px"
            src="/assets/images/home/home_banner_logo.webp"
            className="h-auto !w-28 brightness-0 md:!w-32 md:brightness-100 md:drop-shadow-md lg:!w-40"
          />
          <h2 className="text-balance text-sm font-bold leading-snug text-neutral-800 md:text-xl md:text-white md:drop-shadow-md">
            {title || _STRINGS.HOME_TITLE}
          </h2>
        </div>
        <div className="hidden w-full max-w-3xl md:block">
          <HomeHeroSearch isPhone={isPhone} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-5 hidden bg-gradient-to-t from-black/70 via-black/20 to-transparent md:block" />
    </div>
  );
};

export default HomeBannerPart;
