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
      {/* One stacked column instead of two absolutely-positioned blocks at
          different offsets. The old layout pinned the wordmark at bottom-35% and
          the search at bottom-12%, so the gap between them changed with every
          viewport height, and on short screens the two collided. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end gap-4 px-4 pb-4 md:gap-6 md:pb-12">
        <div className="flex max-w-2xl flex-col items-center gap-2 text-center md:gap-3">
          <ContentImage
            width={320}
            height={166}
            alt={_STRINGS.HOME_TITLE}
            sizes="(max-width: 1024px) 96px, 160px"
            className="h-auto !w-24 drop-shadow-md lg:!w-40"
            src="/assets/images/home/home_banner_logo.webp"
          />
          {/* Kept as the supporting line under the wordmark, but no longer 12px
              on a single clipped row: `text-balance` and a max width let it wrap
              to two lines on a phone instead of running off both edges. */}
          <h2 className="text-balance text-sm font-bold leading-snug text-white drop-shadow-md md:text-xl">
            {title || _STRINGS.HOME_TITLE}
          </h2>
        </div>

        <div className="w-full max-w-3xl">
          <HomeHeroSearch />
        </div>
      </div>

      {/* Text over a photograph the CMS can change at any time cannot rely on
          the photo being dark. A bottom-weighted scrim keeps the headline and the
          search legible whichever image is in rotation, and costs no request. */}
      <div className="pointer-events-none absolute inset-0 z-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div aria-label={item?.image?.alt || item?.title}>
        {" "}
        <Editable
          isBanner
          contentId={item?.id}
          editIconClass="!top-auto !bottom-0"
          className={` focus:outline-none w-full px-0  aspect-[1.5] max-h-[60dvh]  md:aspect-[3.029] 
           transition-all duration-300 ease-in-out   relative`}
        >
          {isPhone ? (
            <ContentImage
              fill
              preload
              sizes="100vw"
              alt={item?.image?.alt ?? ""}
              src={getHomeImageUrl(item?.image_sm ? item?.image_sm : item?.image)}
              className={`w-full object-cover  flex  aspect-[1.5] align-middle  ${
                item?.imageClasses ? item?.imageClasses : ""
              }   `}
            />
          ) : (
            <ContentImage
              fill
              preload
              sizes="100vw"
              alt={item?.image?.alt ?? ""}
              src={getHomeImageUrl(item?.image)}
              className={`w-full object-cover  flex aspect-[3.029]   align-middle  ${
                item?.imageClasses ? item?.imageClasses : ""
              }   `}
            />
          )}
        </Editable>
      </div>
    </div>
  );
};

export default HomeBannerPart;
