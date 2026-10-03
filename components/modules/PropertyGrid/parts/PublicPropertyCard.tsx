import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";

import type { PublicPropertyCardProps } from "@/types/components/modules/property-grid";

import PropertyCardLikes from "./PropertyCardLikes.client";
import PropertyCardLink from "./PropertyCardLink.client";
import PropertyPrice from "../PropertyPrice";

import _STRINGS from "@/utils/LocalStrings";

const PublicPropertyCard = ({ data, goToLink }: PublicPropertyCardProps) => (
  <div className="property-card-shadow w-full rounded-20 bg-white p-3">
    <div className="grid w-full grid-cols-5 gap-3">
      {/* Right Side - Information */}
      <PropertyCardLink
        href={goToLink}
        title={data.title}
        className="order-1 col-span-3 flex min-h-0 flex-col justify-between !outline-none"
      >
        {/* Title */}
        <div className="flex items-start gap-2">
          {data.has_blue_tick ? (
            <ContentImage
              width={24}
              height={24}
              className="h-6 w-6 shrink-0"
              alt="verified_badge"
              src="/assets/icons/adds/verified_hexy_badge.svg"
            />
          ) : null}

          <p className="line-clamp-2 min-h-[2.75rem] text-right text-sm font-bold leading-7 text-black">
            {data.title}
          </p>
        </div>

        {/* Location */}
        <div className="flex w-full items-center gap-2 text-xs">
          {data.is_promoted ? (
            <>
              <p className="shrink-0 font-bold text-brand-600">
                {_STRINGS.LADDERED}
              </p>
              <span className="text-neutral-300">|</span>
            </>
          ) : null}

          <p className="line-clamp-1 text-right text-neutral-700">
            {data.city}، {data.region || data.province || ""}
          </p>
        </div>

        {/* Meta Row - Rooms / Capacity / Likes */}
        <div className="flex w-full items-center gap-2 text-sm text-neutral-800">
          <p className="shrink-0">{data.total_bedrooms || 0} اتاق،</p>

          <p className="shrink-0">تا {data.max_capacity || 0} نفر</p>

          <PropertyCardLikes
            propertyId={data.id}
            favoriteCount={data.favorite_count}
          />
        </div>

        {/* Price */}
        <div className="flex min-h-[52px] w-full items-end justify-between gap-2">
          <p className="shrink-0 text-xs text-black">{_STRINGS.TODAYS_PRICE}</p>

          <PropertyPrice
            data={{
              discounted_price: data.today_price?.discounted_price,
              price: data.today_price?.price,
              discount_percentage: data.today_price?.discount_percentage,
            }}
          />
        </div>
      </PropertyCardLink>

      {/* Left Side - Image */}
      <PropertyCardLink
        title={data.title}
        href={goToLink}
        className="order-2 col-span-2 flex w-full !outline-none"
      >
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl">
          <ContentImage
            fill
            loading="lazy"
            quality={PROPERTY_IMAGE_QUALITY}
            alt={data.feature_image?.alt || ""}
            src={getPropertyImageUrl(data.feature_image)}
            className="object-cover"
            sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 46vw"
          />

          {/* Attachments Count */}
          {!data.advisor_commission &&
          data.advisor_commission !== 0 &&
          data.attachments_count ? (
            <div className="absolute left-2 top-2 z-1 flex h-6 min-w-[3rem] items-center justify-center gap-1.5 rounded-full bg-neutral-900/30 px-2 text-white backdrop-blur-[6px]">
              <p className="text-xs font-medium">{data.attachments_count}</p>

              <ContentImage
                width={16}
                height={16}
                className="h-4 w-4"
                alt={`camera${data.id}`}
                src="/assets/icons/adds/simple_camera.svg"
              />
            </div>
          ) : null}

          {/* Advisor Commission */}
          {data.advisor_commission || data.advisor_commission === 0 ? (
            <div className="absolute left-2 top-2 z-1 flex h-6 items-center justify-center gap-0.5 rounded-full bg-red-500 px-3 text-white shadow-sm">
              <p className="text-xs font-bold">%{data.advisor_commission}</p>
            </div>
          ) : null}

          {/* Authorized Badge */}
          {data.is_authorized ? (
            <div className="absolute bottom-2 right-2 z-1 mx-auto flex h-7 w-fit items-center gap-2 rounded-full bg-neutral-900/35 pl-2 pr-1 text-white backdrop-blur-[6px]">
              <ContentImage
                width={16}
                height={16}
                alt={`tick${data.id}`}
                src="/assets/icons/adds/green_circular_tick.svg"
              />

              <p className="text-[0.6875rem] font-medium text-white">
                {_STRINGS.VERIFIED}
              </p>
            </div>
          ) : null}
        </div>
      </PropertyCardLink>
    </div>
  </div>
);

export default PublicPropertyCard;
