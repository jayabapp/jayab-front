import { fakeVilla } from "@/utils/faker";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AddCardPricePart from "./AddCardPricePart";
import Link from "next/link";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import StatusShower from "../shared/StatusShower";
import PropertyCardOwnerPart from "./PropertyCardOwnerPart";
import { useStoreParams } from "@/store";
import DaysOfTheWeekStatus from "./DaysOfTheWeekStatus";
import Image from "next/image";

const PropertyCard = ({ data, isOwner }: { data: PropertyListDto; isOwner?: boolean }) => {
  const { bookmarks, likes } = useStoreParams((state) => state);

  const goToLink = !!isOwner ? `/profile/owner/properties/${data?.id}` : `/property/${data?.slug}`;

  return (
    <div className="w-full shadow-card  rounded-2xl   flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-5 gap-2   ">
        {/* INFO */}
        <Link href={`${goToLink}`} prefetch={false} className="col-span-3  order-1  flex flex-col gap-1">
          {/* TITLE */}
          <div className="flex items-start gap-2">
            {!!data?.has_blue_tick ? (
              <img src="/assets/icons/adds/verified_badge.svg" className="w-[1.125rem] h-[1.125rem]" />
            ) : (
              <></>
            )}
            <p className="text-sm font-medium">{data.title}</p>
          </div>

          {/* CODE  - LIKES */}
          <div className="flex items-center gap-4">
            <div className="bg-primary-700 rounded-md text-xs  px-2 py-1 text-white flex items-center justify-center">
              کد {data.code}
            </div>{" "}
            <div className="flex items-center gap-1">
              <img
                className="w-4 h-4 aspect-square"
                src={
                  likes?.includes(data?.id)
                    ? "/assets/icons/adds/filled_heart.svg"
                    : "/assets/icons/adds/empty_heart.svg"
                }
              />
              <p className="text-xxs  opacity-60">{data?.favorite_count}</p>
            </div>
          </div>
          {/* PRICING */}

          <div className="w-full flex  flex-row  items-start gap-2 justify-start">
            {" "}
            <p className="text-xs  shrink-0 ">{_STRINGS.TODAYS_PRICE}</p>
            <AddCardPricePart
              data={{ discounted_price: data?.today_price?.discount_percentage, price: data?.today_price?.price }}
            />
          </div>

          {/*  TODAY STATUS */}
          {!!isOwner ? (
            <div className="w-full flex  flex-row  items-start gap-2 justify-start">
              {" "}
              <p className="text-xs  shrink-0 ">{_STRINGS.TODAY_STATUS}</p>
              <p className={` font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-primary-700 "} `}>
                {!!data?.is_today_reserved ? _STRINGS.OCCUPIED : _STRINGS.EMPTY}{" "}
              </p>
            </div>
          ) : (
            <>
              {" "}
              {/* DESCRIPTION */}
              <div className="w-full">
                <p className="text-xs">
                  {" "}
                  <span>{data?.total_bedrooms} اتاق</span>-<span>تا {data?.max_capacity} نفر</span>{" "}
                  {!!data?.has_pool ? <span className="text-primary-700"> - {_STRINGS.HAS_POOL} </span> : <></>}
                </p>
              </div>
              {/* LOCATION */}
              <div className="flex w-full gap-1">
                <img src="/assets/icons/adds/pin_point_location.svg" className="w-5 h-5 aspect-square" />
                <p className="text-xs">{data?.province}</p>
              </div>
            </>
          )}

          {!!isOwner ? <StatusShower data={data?.status} /> : <></>}
        </Link>{" "}
        {/* IMAGE PART */}
        <Link href={`${goToLink}`} prefetch={false} className="col-span-2  order-2 ">
          <div className=" aspect-square relative">
            <Image
              fill
              alt={data?.feature_image?.alt || ""}
              src={NEW_IMAGE_URL(data?.feature_image, "medium")}
              className=" w-full rounded-10  object-cover aspect-square"
            />
            <div className="absolute z-2 right-2 top-2 flex flex-col gap-1 w-7">
              {" "}
              {data?.today_price?.discount_percentage ? (
                <div className="w-7 gap-0.5 flex-col h-5 rounded-md transition-all  px-1 py-[0.2rem]   bg-primary-150 text-white  aspect-square flex items-center justify-center">
                  {/* <img className="w-4 h-4" src="/assets/icons/products/discount_tag.svg" /> */}
                  <p className="  text-sm   ">%{data.today_price?.discount_percentage}</p>{" "}
                </div>
              ) : (
                <></>
              )}
              {bookmarks?.includes(data?.id) ? (
                <img src="/assets/icons/adds/List_bookmark_icon.svg" className="w-5 h-5 aspect-square" />
              ) : (
                <></>
              )}
            </div>
            {data?.attachments_count ? (
              <div className="w-9 gap-0.5  h-5 rounded-md transition-all  py-[0.2rem]   bg-black/50 text-white absolute z-2 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-sm   ">{data.attachments_count}</p>{" "}
                <img className="w-3 h-3" src="/assets/icons/adds/simple_camera.svg" />
              </div>
            ) : (
              <></>
            )}
            {data?.is_authorized ? (
              <div className=" left-0 right-0 w-fit   absolute   p-1  rounded-full flex items-center gap-2 bg-black/60  mx-auto bottom-1">
                <img src="/assets/icons/adds/green_circular_tick.svg" />
                <p className="text-sm text-white">{_STRINGS.VERIFIED}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Link>
      </div>
      {isOwner ? <PropertyCardOwnerPart goToLink={goToLink} data={data} /> : <></>}
      {!!data?.reserve_days ? <DaysOfTheWeekStatus isCard={true} data={data?.reserve_days} /> : <></>}
    </div>
  );
};

export default PropertyCard;
