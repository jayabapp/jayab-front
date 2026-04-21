"use client";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import isEmpty from "lodash/isEmpty";
import Image from "next/image";
import Link from "next/link";
import StatusShower from "../shared/StatusShower";
import AddCardPricePart from "./AddCardPricePart";
import DaysOfTheWeekStatus from "./DaysOfTheWeekStatus";
import PropertycardFeaturePart from "./PropertyCardFeaturesPart";
import PropertyCardOwnerPart from "./PropertyCardOwnerPart";

const PropertyCard = ({ data, isOwner, week }: { data: PropertyListDto; isOwner?: boolean; week?: string[] }) => {
  const { likes, ssrLikedProducts } = useStoreParams((state) => state);
  const goToLink = !!isOwner ? `/profile/owner/properties/${data?.id}` : `/rooms/${data?.slug}`;

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  return (
    <div className="w-full property-card-shadow   rounded-20    justify-between flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-5 gap-2   ">
        {/* INFO */}
        <Link
          onClick={removeredirectRoomToHome}
          href={`${goToLink}`}
          prefetch={false}
          className="col-span-3  !outline-none order-1  flex flex-col justify-between gap-1"
        >
          {/* TITLE */}
          <div className="flex items-start gap-2">
            {!!data?.has_blue_tick ? (
              <img src="/assets/icons/adds/verified_hexy_badge.svg" alt="verified_badge" className="w-6 h-6" />
            ) : (
              <></>
            )}
            <p className="text-sm line-clamp-1  text-right font-bold">{data.title}</p>
          </div>

          {/*  TODAY STATUS */}
          {!!isOwner ? (
            <div className="w-full flex  flex-row  items-start gap-2 justify-start">
              {" "}
              <p className="text-sm  shrink-0 ">{_STRINGS.TODAY_STATUS} :</p>
              <p
                className={` text-sm font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-primary-700 "} `}
              >
                {!!data?.is_today_reserved ? _STRINGS.IS_RESERVED : _STRINGS.EMPTY}{" "}
              </p>
            </div>
          ) : (
            <>
              {" "}
              {/* LOCATION */}
              <div className="flex w-full  items-center gap-1">
                {!!data?.is_promoted ? (
                  <p className="  font-medium  text-primary-700  shrink-0  text-xs  pl-1 border-l">
                    {_STRINGS.LADDERED}
                  </p>
                ) : (
                  <></>
                )}

                <p className="text-xs text-gray-500 line-clamp-1 text-center ">
                  {data?.city}،{" "}
                  <span className="text-xs ">
                    {data?.province || data?.region ? `${data?.region || data?.province}` : ``}
                  </span>
                </p>
              </div>{" "}
              {/* <div className="w-full">
                <p className="text-xs">
                  {" "}
                  <span>{data?.total_bedrooms} اتاق</span> - <span>تا {data?.max_capacity} نفر</span>{" "}
                  {!!data?.has_pool ? <span className="text-primary-700"> - {_STRINGS.HAS_POOL} </span> : <></>}
                </p>
              </div> */}
            </>
          )}

          {/* CODE  - LIKES */}
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 font-normal rounded-full text-xs  text-black  px-2 h-5  leading-4  flex items-center justify-center">
              کد {data.code}
            </div>{" "}
            <div className="flex items-center gap-1">
              <img
                alt={`heart${data?.id}`}
                className="w-4 h-4 aspect-square"
                src={
                  likes?.includes(data?.id)
                    ? "/assets/icons/adds/filled_heart.svg"
                    : "/assets/icons/adds/empty_heart.svg"
                }
              />
              <p className="text-xxs  opacity-60">{ssrLikedProducts?.[data?.id] || data?.favorite_count}</p>
            </div>
          </div>
          {/* PRICING */}

          <div className={`w-full flex  flex-row ${"items-end"}  justify-between    gap-2 `}>
            {" "}
            <p className="  text-xxs 2xl:text-xs  text-gray-500 shrink-0 ">{_STRINGS.TODAYS_PRICE}</p>
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
                <p className="  font-bold  text-primary-700  shrink-0  text-xs  pr-1 border-r">{_STRINGS.LADDERED}</p>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </Link>{" "}
        {/* IMAGE PART */}
        <Link
          onClick={removeredirectRoomToHome}
          href={`${goToLink}`}
          prefetch={false}
          className=" flex h-fit !outline-none items-start  justify-start w-full col-span-2  order-2 "
        >
          <div className=" aspect-square w-full h-full relative">
            <Image
              fill
              loading="lazy"
              quality={100}
              alt={data?.feature_image?.alt || ""}
              src={
                !!data?.feature_image
                  ? NEW_IMAGE_URL(data?.feature_image, "medium")
                  : "/assets/icons/shared/image_placeholder.svg"
              }
              className=" w-full rounded-2xl  h-full  object-cover aspect-square"
            />
            <div className="absolute z-1 right-2 top-2 flex flex-col gap-1 w-7">
              {" "}
              {data?.today_price?.discount_percentage ? (
                // <div className="w-7 gap-0.5 flex-col h-5 rounded-md transition-all  px-1 py-[0.2rem]   bg-primary-150 text-white  aspect-square flex items-center justify-center">
                //   {/* <img className="w-4 h-4" src="/assets/icons/products/discount_tag.svg" /> */}
                //   <p className="  text-xxs   ">%{data.today_price?.discount_percentage}</p>{" "}
                // </div>
                <></>
              ) : (
                <></>
              )}
              {/* {bookmarks?.includes(data?.id) ? (
                <img src="/assets/icons/adds/List_bookmark_icon.svg" className="w-5 h-5 aspect-square" />
              ) : (
                <></>
              )} */}
            </div>
            {data?.advisor_commission || data?.advisor_commission == 0 ? (
              <div className="w-16 gap-0.5  h-5 rounded-md transition-all  py-[0.2rem] backdrop-blur-[6px]   bg-primary-black/30 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-xxs   "> کمیسیون: {data.advisor_commission}%</p>{" "}
              </div>
            ) : data?.attachments_count ? (
              <div className="w-12 gap-1.5  h-6 rounded-full transition-all  py-[0.2rem]  backdrop-blur-[6px]  bg-primary-black/30 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-xs font-medium   ">{data.attachments_count}</p>{" "}
                <img className="w-4 h-4 " alt={`camera${data?.id}`} src="/assets/icons/adds/simple_camera.svg" />
              </div>
            ) : (
              <></>
            )}
            {data?.is_authorized ? (
              <div className="  right-2 w-fit  h-7   absolute   pr-1 pl-2   backdrop-blur-[6px]  bg-primary-black/30 rounded-full flex items-center gap-2  mx-auto bottom-2">
                <img alt={`tick${data?.id}`} src="/assets/icons/adds/green_circular_tick.svg" />
                <p className="text-[0.6875rem]  font-medium text-white">{_STRINGS.VERIFIED}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Link>
      </div>
      {isOwner ? <PropertyCardOwnerPart goToLink={goToLink} data={data} /> : <></>}
      {!!data?.reserve_days && !isEmpty(data?.reserve_days) ? (
        <div className="w-full pt-1 border-t">
          {" "}
          <DaysOfTheWeekStatus week={week || []} isCard={true} data={data?.reserve_days} />
        </div>
      ) : (
        <></>
      )}
      {/* DESCRIPTION */}
      <div className="w-full pt-1.5 border-t">
        <PropertycardFeaturePart data={data} />
      </div>
    </div>
  );
};

export default PropertyCard;
