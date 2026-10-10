import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { PropertyCardProps } from "@/types/components/modules/property-grid";

import PropertyCardOwnerActions from "./parts/PropertyCardOwnerActions";
import PropertyCardFeatures from "./parts/PropertyCardFeatures";
import PublicPropertyCard from "./parts/PublicPropertyCard";
import PropertyCardLikes from "./parts/PropertyCardLikes.client";
import PropertyCardLink from "./parts/PropertyCardLink.client";
import PropertyPrice from "./PropertyPrice";
import queryBuilder from "@/helpers/queryBuilder";
import StatusShower from "@elements/StatusShower";

const PropertyCard = ({
  data,
  isOwner,
  searchParams,
  onPhotoUpgradeClick,
}: PropertyCardProps) => {
  const t = useTranslations();
  const sep = useListSeparator();

  const staySearch = isOwner
    ? ""
    : queryBuilder({
        checkin: searchParams?.checkin || undefined,
        checkout: searchParams?.checkout || undefined,
        total_guests: searchParams?.total_guests || undefined,
      });

  const goToLink = isOwner
    ? `/profile/owner/properties/${data?.id}`
    : `/rooms/${data?.slug}${staySearch ? `?${staySearch}` : ""}`;

  if (!isOwner) return <PublicPropertyCard data={data} goToLink={goToLink} />;

  return (
    <div className="surface-card property-card-shadow flex w-full flex-col justify-between gap-2 p-3">
      <div className="grid w-full grid-cols-2 items-stretch gap-2">
        <PropertyCardLink
          href={goToLink}
          title={data.title}
          className="order-1 flex flex-col gap-1.5 !outline-none"
        >
          <div className="flex items-start gap-2">
            {data?.has_blue_tick ? (
              <ContentImage
                width={24}
                height={24}
                className="w-6 h-6"
                alt="verified_badge"
                src="/assets/icons/adds/verified_hexy_badge.svg"
              />
            ) : null}
            <p className="line-clamp-2 h-10 text-start text-sm font-bold">
              {data.title}
            </p>
          </div>

          {isOwner ? (
            <>
              <div className="w-full flex flex-row items-start gap-2 justify-start">
                <p className="text-sm shrink-0">{t("common.todayStatus")} :</p>
                <p
                  className={`text-sm font-bold ${data?.is_today_reserved ? "text-status-danger" : "text-link"}`}
                >
                  {data?.is_today_reserved
                    ? t("listing.isReserved")
                    : t("common.emptySlot")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-surface-hover font-normal rounded-full text-xs text-ink px-2 h-5 leading-4 flex items-center justify-center">
                  {t("common.code")} {data.code}
                </div>
                <PropertyCardLikes
                  propertyId={data?.id}
                  favoriteCount={data?.favorite_count}
                />
              </div>

              <div className="w-full min-h-10 flex flex-row items-end justify-between gap-2">
                <p className="text-xs 2xl:text-xs shrink-0">
                  {t("common.todaysPrice")}
                </p>
                <PropertyPrice
                  data={{
                    discounted_price: data?.today_price?.discounted_price,
                    price: data?.today_price?.price,
                    discount_percentage: data.today_price?.discount_percentage,
                  }}
                />
              </div>

              <div className="flex items-center w-full gap-2">
                <StatusShower data={data?.status} />
                {data?.is_promoted ? (
                  <p className="font-bold text-link shrink-0 text-xs ps-1 border-s">
                    {t("common.laddered")}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex w-full items-center gap-1">
                {data?.is_promoted ? (
                  <p className="font-bold text-link shrink-0 text-xs pe-1 border-e">
                    {t("common.laddered")}
                  </p>
                ) : null}
                <p className="text-xs line-clamp-1 text-ink-subtle">
                  {data?.city}
                  {sep}
                  <span className="text-xs">
                    {data?.province || data?.region
                      ? `${data?.region || data?.province}`
                      : ``}
                  </span>
                </p>
              </div>

              <div className="flex w-full items-center justify-between gap-2">
                <p className="line-clamp-1 text-xs text-ink-subtle">
                  {data?.total_bedrooms
                    ? `${t("listing.roomsCount", { count: Number(data.total_bedrooms) })}${sep}`
                    : ""}
                  {t("listing.upTo")}{" "}
                  {t("common.people", { count: Number(data?.max_capacity) })}
                </p>
                <PropertyCardLikes
                  propertyId={data?.id}
                  favoriteCount={data?.favorite_count}
                />
              </div>

              <p className="mt-auto text-xs text-ink-subtle">
                {t("common.todaysPrice")}
              </p>
            </div>
          )}
        </PropertyCardLink>

        <div className="order-2 flex w-full flex-col gap-1.5">
          <PropertyCardLink
            title={data.title}
            href={goToLink}
            className="flex w-full items-start justify-start !outline-none"
          >
            <div className="relative w-full aspect-square">
              <ContentImage
                fill
                loading="lazy"
                quality={PROPERTY_IMAGE_QUALITY}
                alt={data?.feature_image?.alt || ""}
                src={getPropertyImageUrl(data?.feature_image)}
                className="w-full rounded-2xl h-full object-cover"
                sizes="(min-width: 1280px) 16vw, (min-width: 768px) 24vw, 46vw"
              />
              {data?.advisor_commission || data?.advisor_commission === 0 ? (
                <div className="w-16 gap-0.5 h-5 rounded-md transition-all py-[0.2rem] backdrop-blur-[6px] bg-neutral-900/30 text-white absolute z-1 end-2 flex-row top-2 aspect-square flex items-center justify-center">
                  <p className="text-xxs">
                    {t("listing.advisorCommissionShort")}:{" "}
                    {data.advisor_commission}%
                  </p>
                </div>
              ) : data?.attachments_count ? (
                <div className="w-12 gap-1.5 h-6 rounded-full transition-all py-[0.2rem] backdrop-blur-[6px] bg-neutral-900/30 text-white absolute z-1 end-2 flex-row top-2 aspect-square flex items-center justify-center">
                  <p className="text-xs font-medium">
                    {data.attachments_count}
                  </p>
                  <ContentImage
                    width={16}
                    height={16}
                    className="w-4 h-4"
                    alt={`camera${data?.id}`}
                    src="/assets/icons/adds/simple_camera.svg"
                  />
                </div>
              ) : null}
              {data?.is_authorized ? (
                <div className="start-2 w-fit h-7 absolute ps-1 pe-2 backdrop-blur-[6px] bg-neutral-900/30 rounded-full flex items-center gap-2 mx-auto bottom-2">
                  <ContentImage
                    width={16}
                    height={16}
                    alt={`tick${data?.id}`}
                    src="/assets/icons/adds/green_circular_tick.svg"
                  />
                  <p className="text-[0.6875rem] font-medium text-white">
                    {t("listing.verified")}
                  </p>
                </div>
              ) : null}
            </div>
          </PropertyCardLink>

          {isOwner ? null : (
            <PropertyCardLink
              href={goToLink}
              title={data.title}
              className="mt-auto flex w-full !outline-none"
            >
              <PropertyPrice
                reserveDiscountSpace
                data={{
                  discounted_price: data?.today_price?.discounted_price,
                  price: data?.today_price?.price,
                  discount_percentage: data.today_price?.discount_percentage,
                }}
              />
            </PropertyCardLink>
          )}
        </div>
      </div>

      {isOwner ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onPhotoUpgradeClick?.(data)}
            className="flex w-full items-center justify-center gap-2 rounded-10 border border-action/30 bg-action/10 px-3 py-2 text-sm font-medium text-link transition-all hover:bg-action/15"
          >
            <ContentImage
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
              src="/assets/icons/header/upgrade_image.svg"
            />
            {t("listing.imageUpgrade")}
          </button>
          <PropertyCardOwnerActions goToLink={goToLink} data={data} />
        </div>
      ) : null}

      {isOwner ? (
        <div className="w-full pt-1.5">
          <PropertyCardFeatures data={data} />
        </div>
      ) : null}
    </div>
  );
};

export default PropertyCard;
