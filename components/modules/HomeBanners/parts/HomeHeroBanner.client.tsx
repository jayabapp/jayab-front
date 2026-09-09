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
      {/* `pb` has to clear the sheet's overlap (22px mobile, 32px from md) or the
          sheet's opaque lip cuts across the bottom of the search pill. It did not
          show before because the sheet had no background of its own. */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end gap-5 px-4 pb-12 md:gap-6 md:pb-14">
        {/* The recede animation goes on the wordmark only, never on a wrapper that
            contains the search. The destination panel is `position: fixed` and is
            rendered inline rather than through a portal, so an animated ancestor
            would become its containing block and pin the full-screen panel to the
            hero instead of the viewport — measured at `top: 84px` with the
            backdrop inheriting the fade at 0.68 opacity. */}
        <div className="home-hero-content flex max-w-2xl flex-col items-center gap-2 text-center md:gap-3">
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
          <HomeHeroSearch isPhone={isPhone} />
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
          /* On a phone the hero is a share of the screen, not a ratio of its
             width. `aspect-[1.5]` made the height a function of how wide the
             device happened to be — 260px on a 390px phone — which left the
             wordmark pressed against the header and the sheet sitting almost on
             top of the search. A dvh share keeps the same composition on every
             phone and gives the photograph room to actually be a photograph.
             Desktop still runs on the wide ratio the artwork is cut for. */
          className={` focus:outline-none w-full px-0  h-[62dvh] max-h-[34rem]  md:h-auto md:max-h-none md:aspect-[3.029]
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
