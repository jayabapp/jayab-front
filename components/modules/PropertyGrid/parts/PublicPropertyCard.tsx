import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { ContentImage } from "@elements/Image";
import type { PublicPropertyCardProps } from "@/types/components/modules/property-grid";

import PropertyCardLikes from "./PropertyCardLikes.client";
import PropertyCardLink from "./PropertyCardLink.client";
import PropertyPrice from "../PropertyPrice";
import _STRINGS from "@/utils/LocalStrings";

const PublicPropertyCard = ({ data, goToLink }: PublicPropertyCardProps) => (
  <div className="surface-card property-card-shadow flex w-full flex-col gap-3 p-3 sm:p-4">
    <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(7.75rem,0.8fr)] items-stretch gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(10rem,0.8fr)]">
      <PropertyCardLink
        href={goToLink}
        title={data.title}
        className="order-1 flex min-w-0 flex-col gap-2.5 py-1 !outline-none"
      >
        <div className="flex items-start gap-2">
          {data.has_blue_tick ? (
            <ContentImage
              width={20}
              height={20}
              className="mt-0.5 h-5 w-5 shrink-0"
              alt="verified_badge"
              src="/assets/icons/adds/verified_hexy_badge.svg"
            />
          ) : null}
          <p className="min-h-12 line-clamp-2 text-right text-base font-bold leading-6 sm:text-lg sm:leading-7">
            {data.title}
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-1.5">
          {data.is_promoted ? (
            <p className="shrink-0 border-l border-neutral-200 pl-1.5 text-sm font-bold text-brand-600">
              {_STRINGS.LADDERED}
            </p>
          ) : null}
          <p className="line-clamp-1 text-sm text-neutral-600">
            {data.city}، {data.region || data.province || ""}
          </p>
        </div>

        <div className="flex w-full items-center gap-2">
          <p className="line-clamp-1 text-sm text-neutral-700">
            {data.total_bedrooms
              ? `${data.total_bedrooms} ${_STRINGS.ROOM}، `
              : ""}
            {_STRINGS.UP_TO} {data.max_capacity} {_STRINGS.PERSON}
          </p>
          <PropertyCardLikes
            forceFilled
            propertyId={data.id}
            favoriteCount={data.favorite_count}
          />
        </div>

        <div className="mt-auto flex w-full items-end justify-between gap-2 pt-2">
          <p className="shrink-0 text-sm text-neutral-700">
            {_STRINGS.TODAYS_PRICE}
          </p>
          <PropertyPrice
            emphasis
            containerClass="flex min-w-0 flex-col gap-0 text-left"
            data={{
              discounted_price: data.today_price?.discounted_price,
              price: data.today_price?.price,
              discount_percentage: data.today_price?.discount_percentage,
            }}
          />
        </div>
      </PropertyCardLink>

      <div className="order-2 flex w-full">
        <PropertyCardLink
          title={data.title}
          href={goToLink}
          className="flex h-full w-full !outline-none"
        >
          <div className="relative min-h-[7.75rem] w-full overflow-hidden rounded-[1.75rem]">
            <ContentImage
              fill
              loading="lazy"
              quality={PROPERTY_IMAGE_QUALITY}
              alt={data.feature_image?.alt || ""}
              src={getPropertyImageUrl(data.feature_image)}
              className="h-full w-full object-cover"
              sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 46vw"
            />

            {data.attachments_count ? (
              <div className="absolute left-2 top-2 z-1 flex h-7 min-w-14 items-center justify-center gap-1.5 rounded-full bg-neutral-900/45 px-2 py-1 text-white backdrop-blur-[6px]">
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

            {data.advisor_commission || data.advisor_commission === 0 ? (
              <div className="absolute left-2 top-11 z-1 flex h-5 items-center justify-center rounded-md bg-neutral-900/35 px-1.5 text-white backdrop-blur-[6px]">
                <p className="text-xxs">
                  {_STRINGS.ADVISOR_COMMISSION_SHORT}: {data.advisor_commission}
                  %
                </p>
              </div>
            ) : null}

            {data.is_today_reserved || data.is_authorized ? (
              <div className="absolute bottom-2 right-2 z-1 flex h-8 items-center gap-1.5 rounded-full bg-neutral-900/55 py-1 pl-2 pr-1.5 text-white backdrop-blur-[6px]">
                <ContentImage
                  width={16}
                  height={16}
                  alt={`tick${data.id}`}
                  src="/assets/icons/adds/green_circular_tick.svg"
                />
                <p className="text-xs font-medium">
                  {data.is_today_reserved
                    ? _STRINGS.IS_RESERVED
                    : _STRINGS.VERIFIED}
                </p>
              </div>
            ) : null}
          </div>
        </PropertyCardLink>
      </div>
    </div>
  </div>
);

export default PublicPropertyCard;
