import { PropertyListDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";

import PropertycardFeaturePart from "./PropertyCardFeaturesPart";
import PropertyCardOwnerPart from "./PropertyCardOwnerPart";
import DaysOfTheWeekStatus from "./DaysOfTheWeekStatus";
import AddCardPricePart from "./AddCardPricePart";
import PropertyCardLikes from "./PropertyCardLikes";
import PropertyCardLink from "./PropertyCardLink";
import StatusShower from "../shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Image from "next/image";

const PropertyCard = ({
  data,
  isOwner,
  week,
  onPhotoUpgradeClick,
}: {
  data: PropertyListDto;
  isOwner?: boolean;
  week?: string[];
  onPhotoUpgradeClick?: (property: PropertyListDto) => void;
}) => {
  const goToLink = !!isOwner
    ? `/profile/owner/properties/${data?.id}`
    : `/rooms/${data?.slug}`;

  return (
    <div className="w-full property-card-shadow   rounded-20    justify-between flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-5 gap-2   ">
        {/* INFO */}
        <PropertyCardLink
          title={data.title}
          href={`${goToLink}`}
          className="col-span-3  !outline-none order-1  flex flex-col justify-between gap-1"
        >
          {/* TITLE */}
          <div className="flex items-start gap-2">
            {!!data?.has_blue_tick ? (
              <img
                src="/assets/icons/adds/verified_hexy_badge.svg"
                alt="verified_badge"
                className="w-6 h-6"
              />
            ) : (
              <></>
            )}
            <p className="text-sm line-clamp-2  h-10  text-right    font-bold">
              {data.title}
            </p>
          </div>

          {/*  TODAY STATUS */}
          {!!isOwner ? (
            <div className="w-full flex  flex-row  items-start gap-2 justify-start">
              {" "}
              <p className="text-sm  shrink-0 ">{_STRINGS.TODAY_STATUS} :</p>
              <p
                className={` text-sm font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-brand-600 "} `}
              >
                {!!data?.is_today_reserved
                  ? _STRINGS.IS_RESERVED
                  : _STRINGS.EMPTY}{" "}
              </p>
            </div>
          ) : (
            <>
              {" "}
              {/* LOCATION */}
              <div className="flex w-full  items-center gap-1">
                {!!data?.is_promoted ? (
                  <p className="   font-bold    text-brand-600  shrink-0  text-xs  pl-1 border-l">
                    {_STRINGS.LADDERED}
                  </p>
                ) : (
                  <></>
                )}

                <p className="text-xs  line-clamp-1 text-center ">
                  {data?.city}،{" "}
                  <span className="text-xs ">
                    {data?.province || data?.region
                      ? `${data?.region || data?.province}`
                      : ``}
                  </span>
                </p>
              </div>
            </>
          )}

          {/* CODE  - LIKES */}
          <div className="flex items-center gap-2">
            <div className="bg-neutral-200 font-normal rounded-full text-xs  text-black  px-2 h-5  leading-4  flex items-center justify-center">
              کد {data.code}
            </div>{" "}
            <PropertyCardLikes
              propertyId={data?.id}
              favoriteCount={data?.favorite_count}
            />
          </div>
          {/* PRICING */}

          <div
            className={`w-full flex  flex-row ${"items-end"}  justify-between    gap-2 `}
          >
            {" "}
            <p className="  text-xs 2xl:text-xs   shrink-0 ">
              {_STRINGS.TODAYS_PRICE}
            </p>
            <AddCardPricePart
              data={{
                discounted_price: data?.today_price?.discounted_price,
                price: data?.today_price?.price,
                discount_percentage: data.today_price?.discount_percentage,
              }}
            />
          </div>

          {!!isOwner ? (
            <div className="flex items-center w-full gap-2">
              <StatusShower data={data?.status} />
              {!!data?.is_promoted ? (
                <p className="  font-bold  text-brand-600  shrink-0  text-xs  pr-1 border-r">
                  {_STRINGS.LADDERED}
                </p>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </PropertyCardLink>
        <PropertyCardLink
          title={data.title}
          href={`${goToLink}`}
          className=" flex h-fit !outline-none items-start  justify-start w-full col-span-2  order-2 "
        >
          <div className=" aspect-square w-full h-full relative">
            <Image
              fill
              quality={75}
              loading="lazy"
              sizes="(min-width: 1536px) 10vw, (min-width: 1280px) 12vw, (min-width: 768px) 18vw, 37vw"
              alt={data?.feature_image?.alt || ""}
              src={
                !!data?.feature_image
                  ? NEW_IMAGE_URL(data?.feature_image)
                  : "/assets/icons/shared/image_placeholder.svg"
              }
              className=" w-full rounded-2xl  h-full  object-cover aspect-square"
            />
            {data?.advisor_commission || data?.advisor_commission == 0 ? (
              <div className="w-16 gap-0.5  h-5 rounded-md transition-all  py-[0.2rem] backdrop-blur-[6px]   bg-neutral-900/30 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-xxs   ">
                  {" "}
                  کمیسیون: {data.advisor_commission}%
                </p>{" "}
              </div>
            ) : data?.attachments_count ? (
              <div className="w-12 gap-1.5  h-6 rounded-full transition-all  py-[0.2rem]  backdrop-blur-[6px]  bg-neutral-900/30 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-xs font-medium   ">
                  {data.attachments_count}
                </p>{" "}
                <img
                  className="w-4 h-4 "
                  alt={`camera${data?.id}`}
                  src="/assets/icons/adds/simple_camera.svg"
                />
              </div>
            ) : (
              <></>
            )}
            {data?.is_authorized ? (
              <div className="  right-2 w-fit  h-7   absolute   pr-1 pl-2   backdrop-blur-[6px]  bg-neutral-900/30 rounded-full flex items-center gap-2  mx-auto bottom-2">
                <img
                  alt={`tick${data?.id}`}
                  src="/assets/icons/adds/green_circular_tick.svg"
                />
                <p className="text-[0.6875rem]  font-medium text-white">
                  {_STRINGS.VERIFIED}
                </p>
              </div>
            ) : (
              <></>
            )}
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
            <img
              src="/assets/icons/header/upgrade_image.svg"
              alt=""
              className="h-5 w-5"
            />
            بهبودتصویر
          </button>
          <PropertyCardOwnerPart goToLink={goToLink} data={data} />
        </div>
      ) : (
        <></>
      )}
      {/* DESCRIPTION */}
      <div className="w-full pt-1.5 ">
        <PropertycardFeaturePart data={data} />
      </div>
      {!!data?.reserve_days && !isEmpty(data?.reserve_days) ? (
        <div className="w-full pt-1 border-t">
          {" "}
          <DaysOfTheWeekStatus
            isCard={true}
            week={week || []}
            data={data?.reserve_days}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PropertyCard;
