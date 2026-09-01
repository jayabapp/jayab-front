import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import type { PropertyCardProps } from "@/types/components/modules/property-grid";
import { ContentImage } from "@elements/Image";

import PropertyCardOwnerActions from "./parts/PropertyCardOwnerActions";
import PropertyCardLikes from "./parts/PropertyCardLikes.client";
import PropertyCardFeatures from "./parts/PropertyCardFeatures";
import PropertyCardLink from "./parts/PropertyCardLink.client";
import DaysOfTheWeekStatus from "./DaysOfTheWeekStatus";
import StatusShower from "@elements/StatusShower";
import PropertyPrice from "./PropertyPrice";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";

const PropertyCard = ({
  data,
  week,
  isOwner,
  onPhotoUpgradeClick,
}: PropertyCardProps) => {
  const goToLink = isOwner
    ? `/profile/owner/properties/${data?.id}`
    : `/rooms/${data?.slug}`;

  return (
    <div className="w-full property-card-shadow rounded-20 justify-between flex flex-col p-3 gap-2">
      <div className="w-full grid grid-cols-5 gap-2">
        <PropertyCardLink
          title={data.title}
          href={goToLink}
          className="col-span-3 !outline-none order-1 flex flex-col justify-between gap-1"
        >
          <div className="flex items-start gap-2">
            {data?.has_blue_tick ? (
              <ContentImage
                width={24}
                height={24}
                alt="verified_badge"
                className="w-6 h-6"
                src="/assets/icons/adds/verified_hexy_badge.svg"
              />
            ) : null}
            <p className="text-sm line-clamp-2 h-10 text-right font-bold">
              {data.title}
            </p>
          </div>

          {isOwner ? (
            <div className="w-full flex flex-row items-start gap-2 justify-start">
              <p className="text-sm shrink-0">{_STRINGS.TODAY_STATUS} :</p>
              <p
                className={`text-sm font-bold ${data?.is_today_reserved ? "text-danger-500" : "text-brand-600"}`}
              >
                {data?.is_today_reserved
                  ? _STRINGS.IS_RESERVED
                  : _STRINGS.EMPTY}
              </p>
            </div>
          ) : (
            <div className="flex w-full items-center gap-1">
              {data?.is_promoted ? (
                <p className="font-bold text-brand-600 shrink-0 text-xs pl-1 border-l">
                  {_STRINGS.LADDERED}
                </p>
              ) : null}
              <p className="text-xs line-clamp-1 text-center">
                {data?.city}،{" "}
                <span className="text-xs">
                  {data?.province || data?.region
                    ? `${data?.region || data?.province}`
                    : ``}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="bg-neutral-200 font-normal rounded-full text-xs text-black px-2 h-5 leading-4 flex items-center justify-center">
              {_STRINGS.CODE} {data.code}
            </div>
            <PropertyCardLikes
              propertyId={data?.id}
              favoriteCount={data?.favorite_count}
            />
          </div>

          <div className="w-full flex flex-row items-end justify-between gap-2">
            <p className="text-xs 2xl:text-xs shrink-0">
              {_STRINGS.TODAYS_PRICE}
            </p>
            <PropertyPrice
              data={{
                discounted_price: data?.today_price?.discounted_price,
                price: data?.today_price?.price,
                discount_percentage: data.today_price?.discount_percentage,
              }}
            />
          </div>

          {isOwner ? (
            <div className="flex items-center w-full gap-2">
              <StatusShower data={data?.status} />
              {data?.is_promoted ? (
                <p className="font-bold text-brand-600 shrink-0 text-xs pr-1 border-r">
                  {_STRINGS.LADDERED}
                </p>
              ) : null}
            </div>
          ) : null}
        </PropertyCardLink>

        <PropertyCardLink
          title={data.title}
          href={goToLink}
          className="flex h-fit !outline-none items-start justify-start w-full col-span-2 order-2"
        >
          <div className="aspect-square w-full h-full relative">
            <ContentImage
              fill
              quality={75}
              loading="lazy"
              sizes="(min-width: 1536px) 10vw, (min-width: 1280px) 12vw, (min-width: 768px) 18vw, 37vw"
              alt={data?.feature_image?.alt || ""}
              src={getPropertyImageUrl(data?.feature_image)}
              className="w-full rounded-2xl h-full object-cover aspect-square"
            />
            {data?.advisor_commission || data?.advisor_commission === 0 ? (
              <div className="w-16 gap-0.5 h-5 rounded-md transition-all py-[0.2rem] backdrop-blur-[6px] bg-neutral-900/30 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="text-xxs">
                  {_STRINGS.ADVISOR_COMMISSION_SHORT}: {data.advisor_commission}
                  %
                </p>
              </div>
            ) : data?.attachments_count ? (
              <div className="w-12 gap-1.5 h-6 rounded-full transition-all py-[0.2rem] backdrop-blur-[6px] bg-neutral-900/30 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="text-xs font-medium">{data.attachments_count}</p>
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
              <div className="right-2 w-fit h-7 absolute pr-1 pl-2 backdrop-blur-[6px] bg-neutral-900/30 rounded-full flex items-center gap-2 mx-auto bottom-2">
                <ContentImage
                  width={16}
                  height={16}
                  alt={`tick${data?.id}`}
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

      {isOwner ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onPhotoUpgradeClick?.(data)}
            className="flex w-full items-center justify-center gap-2 rounded-10 border border-brand-600/30 bg-brand-600/10 px-3 py-2 text-sm font-medium text-brand-600 transition-all hover:bg-brand-600/15"
          >
            <ContentImage
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
              src="/assets/icons/header/upgrade_image.svg"
            />
            {_STRINGS.IMAGE_UPGRADE}
          </button>
          <PropertyCardOwnerActions goToLink={goToLink} data={data} />
        </div>
      ) : null}

      <div className="w-full pt-1.5">
        <PropertyCardFeatures data={data} />
      </div>

      {data?.reserve_days && !isEmpty(data?.reserve_days) ? (
        <div className="w-full pt-1 border-t">
          <DaysOfTheWeekStatus
            isCard
            week={week || []}
            data={data?.reserve_days}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PropertyCard;
