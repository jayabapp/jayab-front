import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { CallBadge } from "@elements/Badge";

import type { PublicPropertyCardProps } from "@/types/components/modules/property-grid";

import PropertyCardLikes from "./PropertyCardLikes.client";
import PropertyCardLink from "./PropertyCardLink.client";
import PropertyPrice from "../PropertyPrice";

const PublicPropertyCard = ({ data, goToLink }: PublicPropertyCardProps) => {
  const t = useTranslations();
  const sep = useListSeparator();

  const hasRegion = Boolean(data.region);
  const broadPlace = hasRegion ? data.city : data.province;
  const narrowPlace = hasRegion ? data.region : data.city;
  const broadLocale = hasRegion
    ? data.text_locales?.city
    : data.text_locales?.province;
  const narrowLocale = hasRegion
    ? data.text_locales?.region
    : data.text_locales?.city;

  const facts = [
    `${t("listing.upTo")} ${t("common.people", { count: Number(data.max_capacity || 0) })}`,
    t("listing.roomsCount", { count: Number(data.total_bedrooms || 0) }),
    ...(data.has_pool ? [t("listing.hasPool")] : []),
  ];

  return (
    <div className="property-card-shadow relative w-full overflow-hidden rounded-20 bg-surface p-3">
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
                alt="verified_badge"
                className="h-6 w-6 shrink-0"
                src="/assets/icons/adds/verified_hexy_badge.svg"
              />
            ) : null}

            <p
              lang={data.text_locales?.title ?? "fa"}
              dir="auto"
              className="line-clamp-2 min-h-[2.75rem] text-start text-sm font-bold leading-7 text-ink"
            >
              {data.title}
            </p>
          </div>

          {/* Location, then "promoted" after a dot */}
          <div className="flex w-full min-w-0 items-center gap-2 text-sm font-medium">
            <p className="line-clamp-1 min-w-0 text-start text-ink-muted">
              {/* Broad to specific: province then city, or city then region. */}
              <bdi lang={broadLocale ?? "fa"}>{broadPlace}</bdi>
              {broadPlace && narrowPlace ? sep : ""}
              <bdi lang={narrowLocale ?? "fa"}>{narrowPlace}</bdi>
            </p>

            {data.is_promoted ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-1 shrink-0 rounded-full bg-ink-subtle"
                />
                <p className="shrink-0 text-link">{t("common.laddered")}</p>
              </>
            ) : null}
          </div>

          {/* Capacity | rooms | pool, likes at the end */}
          <div className="flex w-full items-center justify-between gap-2">
            <ul className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
              {facts.map((fact, index) => (
                <li key={fact} className="flex shrink-0 items-center gap-2">
                  {index ? (
                    <span
                      aria-hidden="true"
                      className="h-3 w-px bg-line-strong"
                    />
                  ) : null}
                  {fact}
                </li>
              ))}
            </ul>

            <PropertyCardLikes
              forceFilled
              propertyId={data.id}
              favoriteCount={data.favorite_count}
            />
          </div>

          {/* Price */}
          <div className="flex min-h-[52px] w-full items-end justify-between gap-2">
            <p className="shrink-0 text-xs text-ink">
              {t("common.todaysPrice")}
            </p>

            <PropertyPrice
              data={{
                discounted_price: data.today_price?.discounted_price,
                price: data.today_price?.price,
                discount_percentage: data.today_price?.discount_percentage,
              }}
            />
          </div>
        </PropertyCardLink>

        {/* Image */}
        <PropertyCardLink
          title={data.title}
          href={goToLink}
          className="relative order-2 col-span-2 flex w-full !outline-none"
        >
          {data.has_active_subscription ? (
            <CallBadge
              label={t("listing.activeSubscription")}
              className="absolute -end-2.5 -top-2.5 z-2"
            />
          ) : null}

          <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl">
            <ContentImage
              fill
              loading="lazy"
              className="object-cover"
              quality={PROPERTY_IMAGE_QUALITY}
              alt={data.feature_image?.alt || ""}
              src={getPropertyImageUrl(data.feature_image)}
              sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 46vw"
            />

            {/* Attachments Count */}
            {!data.advisor_commission &&
            data.advisor_commission !== 0 &&
            data.attachments_count ? (
              <div className="absolute end-2 top-2 z-1 flex h-6 min-w-[3rem] items-center justify-center gap-1.5 rounded-full bg-neutral-900/30 px-2 text-white backdrop-blur-[6px]">
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
              <div className="absolute end-2 top-2 z-1 flex h-6 items-center justify-center rounded-full bg-red-500 px-3 text-white shadow-sm">
                <p className="text-xs font-bold">%{data.advisor_commission}</p>
              </div>
            ) : null}

            {/* Authorized Badge */}
            {data.is_authorized ? (
              <div className="absolute bottom-2 start-2 z-1 mx-auto flex h-7 w-fit items-center gap-2 rounded-full bg-neutral-900/35 pe-2 ps-1 text-white backdrop-blur-[6px]">
                <ContentImage
                  width={16}
                  height={16}
                  alt={`tick${data.id}`}
                  src="/assets/icons/adds/green_circular_tick.svg"
                />

                <p className="text-[0.6875rem] font-medium text-white">
                  {t("listing.verified")}
                </p>
              </div>
            ) : null}
          </div>
        </PropertyCardLink>
      </div>
    </div>
  );
};

export default PublicPropertyCard;
