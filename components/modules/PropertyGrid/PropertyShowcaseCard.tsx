import type { PropertyShowcaseCardProps } from "@/types/components/modules/property-grid";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";
import type { CSSProperties } from "react";

import PropertyCardLikes from "./parts/PropertyCardLikes.client";
import PropertyCardLink from "./parts/PropertyCardLink.client";
import PropertyPrice from "./PropertyPrice";
import _STRINGS from "@/utils/LocalStrings";

// 2 cards on a phone, 3 from md, 4 from xl — mirrors HOME_GRID_CLASS in
// HomePropertiesGrid so the optimizer is never asked for a width the card
// does not actually render at.
const SHOWCASE_IMAGE_SIZES =
  "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw";

const PropertyShowcaseCard = ({ data, index }: PropertyShowcaseCardProps) => (
  <article
    style={{ "--card-index": index ?? 0 } as CSSProperties}
    className="lift-card stagger-rise h-full overflow-hidden rounded-20 border border-neutral-100 bg-white"
  >
    <PropertyCardLink
      title={data?.title}
      href={`/rooms/${data?.slug}`}
      className="flex h-full flex-col !outline-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ContentImage
          fill
          quality={75}
          loading="lazy"
          sizes={SHOWCASE_IMAGE_SIZES}
          alt={data?.feature_image?.alt || ""}
          src={getPropertyImageUrl(data?.feature_image)}
          className="lift-card-media h-full w-full object-cover"
        />
        <div className="lift-card-scrim pointer-events-none absolute inset-0" />

        {/* Promoted sits in the start corner and reads light-on-photo, while the
            verified badge below stays dark: two paid/trust signals that must not
            look interchangeable. The chevrons are inline rather than an asset so
            they inherit the pill's brand colour through `currentColor`. */}
        {!!data?.is_promoted ? (
          <div className="promoted-pill absolute right-1.5 top-1.5 flex h-5 items-center gap-0.5 rounded-full bg-white/85 pl-1.5 pr-1 text-brand-600 shadow-sm backdrop-blur-[6px] md:right-2 md:top-2 md:h-6 md:gap-1 md:pl-2 md:pr-1.5">
            <svg
              fill="none"
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="promoted-pill-glyph h-2.5 w-2.5 md:h-3 md:w-3"
            >
              <path d="M6 1.4 2.3 5.1h7.4L6 1.4Z" fill="currentColor" />
              <path
                opacity="0.5"
                fill="currentColor"
                d="M6 6.2 2.3 9.9h7.4L6 6.2Z"
              />
            </svg>
            <p className="text-[0.5625rem] font-bold md:text-xxs">
              {_STRINGS.LADDERED}
            </p>
          </div>
        ) : (
          <></>
        )}

        {!!data?.is_authorized ? (
          <div className="absolute bottom-1.5 right-1.5 flex h-5 items-center gap-0.5 rounded-full bg-neutral-900/35 pl-1.5 pr-0.5 backdrop-blur-[6px] md:bottom-2 md:right-2 md:h-6 md:gap-1 md:pl-2 md:pr-1">
            <ContentImage
              width={14}
              height={14}
              alt=""
              className="h-3 w-3 md:h-3.5 md:w-3.5"
              src="/assets/icons/adds/green_circular_tick.svg"
            />
            <p className="text-[0.5625rem] font-medium text-white md:text-xxs">
              {_STRINGS.VERIFIED}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5 md:p-3">
        <div className="flex items-start gap-1.5">
          {!!data?.has_blue_tick ? (
            <ContentImage
              width={18}
              height={18}
              alt="verified_badge"
              className="mt-px h-4 w-4 shrink-0"
              src="/assets/icons/adds/verified_hexy_badge.svg"
            />
          ) : (
            <></>
          )}
          <p className="line-clamp-1 text-xs font-bold md:text-sm">
            {data?.title}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-1 text-xxs text-neutral-600 md:text-xs">
            {data?.city}
            {data?.region || data?.province
              ? `، ${data?.region || data?.province}`
              : ``}
          </p>
          <PropertyCardLikes
            propertyId={data?.id}
            favoriteCount={data?.favorite_count}
          />
        </div>

        {/* A middle-dot separator between "نفر" and the next digit is a neutral
            character: bidi reorders it into the wrong slot, so the capacity and
            the room count are split with a border instead. */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-1 border-t border-neutral-100 pt-2">
          <div className="flex items-end gap-1">
            <PropertyPrice
              data={{
                price: data?.today_price?.price,
                discounted_price: data?.today_price?.discounted_price,
                discount_percentage: data?.today_price?.discount_percentage,
              }}
            />
            <span className="pb-px text-xxs text-neutral-600">
              / {_STRINGS.NIGHT}
            </span>
          </div>
          <p className="flex items-center gap-1 text-xxs text-neutral-600">
            <span className="shrink-0">
              {_STRINGS.UP_TO} {data?.max_capacity} {_STRINGS.PERSON}
            </span>
            <span className="shrink-0 border-r border-neutral-300 pr-1">
              {data?.total_bedrooms} {_STRINGS.ROOM}
            </span>
          </p>
        </div>
      </div>
    </PropertyCardLink>
  </article>
);

export default PropertyShowcaseCard;
