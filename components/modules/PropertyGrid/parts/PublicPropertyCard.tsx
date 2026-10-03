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

          <p className="h-10 line-clamp-2 text-right text-sm font-bold">
            {data.title}
          </p>
        </div>

        {/* Location */}
        <div className="flex w-full items-center gap-1">
          {data.is_promoted ? (
            <p className="shrink-0 border-l pl-1 text-xs font-bold text-brand-600">
              {_STRINGS.LADDERED}
            </p>
          ) : null}

          <p className="line-clamp-1 text-right text-xs">
            {data.city}، {data.region || data.province || ""}
          </p>
        </div>

        {/* Rooms / Capacity / Likes */}
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="flex h-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 px-2.5 text-xs font-normal leading-4 text-black">
              {data.total_bedrooms || 0} اتاق
            </div>

            <div className="flex h-6 shrink-0 items-center justify-center rounded-full bg-neutral-200 px-2.5 text-xs font-normal leading-4 text-black">
              تا {data.max_capacity || 0} نفر
            </div>
          </div>

          <PropertyCardLikes
            propertyId={data.id}
            favoriteCount={data.favorite_count}
          />
        </div>

        {/* Price */}
        <div className="flex min-h-[42px] w-full items-end justify-between gap-2">
          <p className="shrink-0 text-xs">{_STRINGS.TODAYS_PRICE}</p>

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
            <div className="absolute left-2 top-2 z-1 flex h-6 w-12 items-center justify-center gap-1.5 rounded-full bg-neutral-900/30 py-[0.2rem] text-white backdrop-blur-[6px]">
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
            <div className="absolute left-2 top-2 z-1 flex h-5 w-16 items-center justify-center gap-0.5 rounded-md bg-neutral-900/30 py-[0.2rem] text-white backdrop-blur-[6px]">
              <p className="text-xxs">
                {_STRINGS.ADVISOR_COMMISSION_SHORT}: {data.advisor_commission}%
              </p>
            </div>
          ) : null}

          {/* Authorized Badge */}
          {data.is_authorized ? (
            <div className="absolute bottom-2 right-2 z-1 mx-auto flex h-7 w-fit items-center gap-2 rounded-full bg-neutral-900/30 pl-2 pr-1 text-white backdrop-blur-[6px]">
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
