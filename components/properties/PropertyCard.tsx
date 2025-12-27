"use client";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";
import StatusShower from "../shared/StatusShower";
import AddCardPricePart from "./AddCardPricePart";
import DaysOfTheWeekStatus from "./DaysOfTheWeekStatus";
import PropertyCardOwnerPart from "./PropertyCardOwnerPart";

const PropertyCard = ({ data, isOwner, week }: { data: PropertyListDto; isOwner?: boolean; week?: string[] }) => {
  const { likes, ssrLikedProducts } = useStoreParams((state) => state);
  const goToLink = !!isOwner ? `/profile/owner/properties/${data?.id}` : `/rooms/${data?.slug}`;

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  return (
    <div className="w-full shadow-card  rounded-2xl    justify-between flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-5 gap-2   ">
        {/* INFO */}
        <Link
          onClick={removeredirectRoomToHome}
          href={`${goToLink}`}
          prefetch={false}
          className="col-span-3  !outline-none order-1  flex flex-col gap-1"
        >
          {/* TITLE */}
          <div className="flex items-start gap-2">
            {!!data?.has_blue_tick ? (
              <img
                src="/assets/icons/adds/verified_badge.svg"
                alt="verified_badge"
                className="w-[1.125rem] h-[1.125rem]"
              />
            ) : (
              <></>
            )}
            <p className="text-sm line-clamp-1  text-right font-semibold">{data.title}</p>
          </div>

          {/* CODE  - LIKES */}
          <div className="flex items-center gap-4">
            <div className="bg-black/10 font-normal rounded-md text-xs   px-2 py-1  leading-4  flex items-center justify-center">
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

          <div className={`w-full flex  flex-row ${"items-start"}  h-8  gap-2 justify-start`}>
            {" "}
            <p className=" leading-5 text-xs 2xl:text-xs  shrink-0 ">{_STRINGS.TODAYS_PRICE}</p>
            <AddCardPricePart
              data={{
                discounted_price: data?.today_price?.discounted_price,
                price: data?.today_price?.price,
                discount_percentage: data.today_price?.discount_percentage,
              }}
            />
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
              {/* DESCRIPTION */}
              <div className="w-full">
                <p className="text-xs">
                  {" "}
                  <span>{data?.total_bedrooms} اتاق</span> - <span>تا {data?.max_capacity} نفر</span>{" "}
                  {!!data?.has_pool ? <span className="text-primary-700"> - {_STRINGS.HAS_POOL} </span> : <></>}
                </p>
              </div>
              {/* LOCATION */}
              <div className="flex w-full  items-center gap-1">
                {!!data?.is_promoted ? (
                  <p className="  font-bold  text-primary-700  shrink-0  text-xs  pl-1 border-l">{_STRINGS.LADDERED}</p>
                ) : (
                  // <img
                  //   src="/assets/icons/adds/pin_point_location.svg"
                  //   alt={`location${data?.id}`}
                  //   className="w-5 h-5 aspect-square"
                  // />
                  <></>
                )}

                <p className="text-xs line-clamp-1 text-center ">
                  {data?.city} <span className="text-xs ">{data?.province ? `(${data?.province})` : ``}</span>
                </p>
              </div>
            </>
          )}

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
              quality={100}
              alt={data?.feature_image?.alt || ""}
              src={
                !!data?.feature_image
                  ? NEW_IMAGE_URL(data?.feature_image, "medium")
                  : "/assets/icons/shared/image_placeholder.svg"
              }
              className=" w-full rounded-10  h-full  object-cover aspect-square"
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
              <div className="w-16 gap-0.5  h-5 rounded-md transition-all  py-[0.2rem]   bg-black/50 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-xxs   "> کمیسیون: {data.advisor_commission}%</p>{" "}
              </div>
            ) : data?.attachments_count ? (
              <div className="w-[2.125rem] gap-1  h-5 rounded-md transition-all  py-[0.2rem]   bg-black/50 text-white absolute z-1 left-2 flex-row top-2 aspect-square flex items-center justify-center">
                <p className="  text-xxs   ">{data.attachments_count}</p>{" "}
                <img className="w-2 h-2 " alt={`camera${data?.id}`} src="/assets/icons/adds/simple_camera.svg" />
              </div>
            ) : (
              <></>
            )}
            {data?.is_authorized ? (
              <div className=" left-0 right-0 w-fit   absolute   p-1  rounded-full flex items-center gap-2 bg-black/60  mx-auto bottom-1">
                <img alt={`tick${data?.id}`} src="/assets/icons/adds/green_circular_tick.svg" />
                <p className="text-xs text-white">{_STRINGS.VERIFIED}</p>
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
    </div>
  );
};

export default PropertyCard;
