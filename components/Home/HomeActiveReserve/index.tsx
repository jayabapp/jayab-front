"use client";

import { ReserveService } from "@/api_services/reserve/reserve.service";
import { useAuthStore, useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import Image from "next/image";
import Link from "next/link";

const HomeActiveReserve = () => {
  const { isLogin } = useAuthStore((state) => state);

  // const { data } = useQuery({
  //   queryKey: [ReserveService.RESERVE_ACTIVE_CACHEKEY, isLogin],
  //   enabled: isLogin,

  //   queryFn: ReserveService.activeReserve,
  // });

  const {
    data: reserves,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [ReserveService?.RESERVE_CACHEKEY, isLogin],
    queryFn: () => ReserveService?.userReserves({ type: "active" }),
    staleTime: 0,
    gcTime: 0,
    enabled: isLogin,
  });

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };
  return (
    <>
      {isEmpty(reserves) ? (
        <> </>
      ) : (
        <div className=" w-full grid   padding-x  bg-gradient-to-t  from-white  from-[10%] rounded-t-20 to-primary-350   p-4 -mt-4 pt-10 lg:mt-6  lg:grid-cols-3  gap-2 ">
          <div className="col-span-full w-full flex items-center justify-between">
            <div className="flex  items-center gap-1">
              <p className=" font-semibold text-sm  text-white "> {reserves?.length} درخواست رزرو فعال</p>
              <div className=" size-2 mb-3  rounded-full bg-red-700 animate-pulse  duration-700" />
            </div>
            <Link href="/profile/reserves" className="flex items-center gap-1.5">
              <p className="text-white text-sm ">{_STRINGS.WATCH} همه</p>
              <img className="w-4" src="/assets/icons/property/white_arrow_left.svg" />
            </Link>
          </div>

          {reserves?.map((data) => {
            const goToLink = "/profile/reserves";
            // const goToLink = `/rooms/${data?.property?.slug}`;

            return (
              <div
                key={`reserved${data?.id}`}
                className="w-full   bg-white  rounded-2xl    justify-between flex flex-col shadow-md  p-2   gap-2  "
              >
                <div className="w-full  grid grid-cols-8 gap-2   ">
                  {/* INFO */}
                  <Link
                    onClick={removeredirectRoomToHome}
                    href={`${goToLink}`}
                    prefetch={false}
                    className={`col-span-6  !outline-none  order-1 justify-between flex flex-col gap-1`}
                  >
                    {/* TITLE */}
                    <div className="flex items-start gap-2">
                      <p className="text-sm line-clamp-1  text-right font-medium ">{data?.property?.title} </p>
                    </div>

                    {/* CODE  - LIKES */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="bg-black/10 font-normal rounded-md text-xs   px-2 py-1  leading-4  flex items-center justify-center">
                        کد {data?.property?.code}
                      </div>{" "}
                    </div>

                    <div className="w-full flex  flex-col  gap-2">
                      <>
                        {" "}
                        {/* DESCRIPTION */}
                        {/* <div className="w-full">
                    <p className="text-xs">
                      {" "}
                      <span>تا {data?.property?.max_capacity} نفر</span>{" "}
                      {!!data?.property?.has_pool ? (
                        <span className="text-primary-700"> - {_STRINGS.HAS_POOL} </span>
                      ) : (
                        <></>
                      )}
                    </p>
                  </div> */}
                        {/* LOCATION */}
                        <div className="flex w-full  items-center gap-1">
                          {/* {!!data?.property?.is_promoted ? (
                      <p className="  font-bold  text-primary-700  shrink-0  text-xs  pl-1 border-l">
                        {_STRINGS.LADDERED}
                      </p>
                    ) : (
                      // <img
                      //   src="/assets/icons/adds/pin_point_location.svg"
                      //   alt={`location${data?.id}`}
                      //   className="w-5 h-5 aspect-square"
                      // />
                      <></>
                    )} */}

                          <p className="text-xs line-clamp-1 text-center ">
                            {data?.property?.city?.title}{" "}
                            <span className="text-xs ">
                              {data?.property?.province?.title || data?.property?.region?.title
                                ? `(${data?.property?.region?.title || data?.property?.province?.title})`
                                : ``}
                            </span>
                          </p>
                        </div>
                      </>
                    </div>
                  </Link>{" "}
                  {/* IMAGE PART */}
                  <Link
                    onClick={removeredirectRoomToHome}
                    href={`${goToLink}`}
                    prefetch={false}
                    className={` flex h-fit !outline-none items-start  justify-start w-full col-span-2 order-2   `}
                  >
                    <div className=" aspect-square w-full h-full relative">
                      <Image
                        fill
                        loading="lazy"
                        quality={100}
                        alt={data?.property?.feature_image?.alt || ""}
                        src={
                          !!data?.property?.feature_image
                            ? NEW_IMAGE_URL(data?.property?.feature_image, "medium")
                            : "/assets/icons/shared/image_placeholder.svg"
                        }
                        className=" w-full rounded-10  h-full  object-cover aspect-square"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default HomeActiveReserve;
