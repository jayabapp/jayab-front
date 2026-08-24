"use client";

import { useAuthStore, useStoreParams } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";

import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Image from "next/image";
import Link from "next/link";

const HomeActiveReserve = () => {
  const { isLogin } = useAuthStore((state) => state);
  const { data: reserves, dataUpdatedAt } = useQuery({
    queryKey: [ReserveService?.RESERVE_CACHEKEY, isLogin],
    queryFn: !!isLogin
      ? () => ReserveService?.userReserves({ type: "active" })
      : () => null,
    staleTime: 0,
    gcTime: 0,
    enabled: isLogin,
  });

  const [now, setNow] = useState(() => Date.now());

  const activeReserves = useMemo(() => {
    return (reserves ?? []).filter((item) => {
      if (!!item?.is_answer_deadline_passed) return false;
      return dataUpdatedAt + (item?.ttl_seconds ?? 0) * 1000 > now;
    });
  }, [reserves, dataUpdatedAt, now]);

  useEffect(() => {
    if (isEmpty(activeReserves)) return;
    const nextDeadline = Math.min(
      ...activeReserves.map(
        (item) => dataUpdatedAt + (item?.ttl_seconds ?? 0) * 1000,
      ),
    );
    const timer = setTimeout(
      () => setNow(Date.now()),
      Math.max(nextDeadline - Date.now(), 0) + 100,
    );
    return () => clearTimeout(timer);
  }, [activeReserves, dataUpdatedAt]);

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };
  return (
    <>
      {isEmpty(activeReserves) ? (
        <> </>
      ) : (
        <div className=" w-full grid   padding-x  bg-gradient-to-t   lg:to-white from-white  from-[10%] rounded-t-20 lg:rounded-t-none to-primary-350   p-4 -mt-4 pt-10 lg:mt-0  lg:grid-cols-3  gap-2 lg:gap-3 ">
          <div className="col-span-full w-full flex items-center justify-between">
            <div className="flex  items-center gap-1">
              <p className=" font-semibold !text-sm  lg:text-black text-white lg:!text-base ">
                {" "}
                {activeReserves?.length} درخواست رزرو فعال
              </p>
              <div className=" size-2 mb-3  rounded-full bg-red-700 animate-pulse  duration-700" />
            </div>
            <Link
              href="/profile/reserves"
              title={_STRINGS.WATCH}
              className="flex items-center gap-1.5"
            >
              <p className="text-white lg:text-black !text-sm  lg:!text-base">
                {_STRINGS.WATCH} همه
              </p>
              <img
                className="w-4  lg:brightness-0 "
                src="/assets/icons/property/white_arrow_left.svg"
              />
            </Link>
          </div>

          {activeReserves?.map((data) => {
            const goToLink = "/profile/reserves";
            return (
              <div
                key={`reserved${data?.id}`}
                className="w-full   bg-white  rounded-2xl    justify-between flex flex-col shadow-md  lg:shadow-card p-2   gap-2  "
              >
                <div className="w-full  grid grid-cols-8 gap-2   ">
                  {/* INFO */}
                  <Link
                    prefetch={false}
                    href={`${goToLink}`}
                    title={data?.property?.title}
                    onClick={removeredirectRoomToHome}
                    className={`col-span-6 !outline-none order-1 justify-between flex flex-col gap-1`}
                  >
                    {/* TITLE */}
                    <div className="flex items-start gap-2">
                      <p className="text-sm line-clamp-1  text-right font-medium ">
                        {data?.property?.title}{" "}
                      </p>
                    </div>

                    {/* CODE  - LIKES */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="bg-black/10 font-normal rounded-md text-xs   px-2 py-1  leading-4  flex items-center justify-center">
                        کد {data?.property?.code}
                      </div>{" "}
                    </div>

                    <div className="w-full flex  flex-col  gap-2">
                      <div className="flex w-full  items-center gap-1">
                        <p className="text-xs line-clamp-1 text-center ">
                          {data?.property?.city?.title}{" "}
                          <span className="text-xs ">
                            {data?.property?.province?.title ||
                            data?.property?.region?.title
                              ? `(${data?.property?.region?.title || data?.property?.province?.title})`
                              : ``}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    prefetch={false}
                    href={`${goToLink}`}
                    title={data?.property?.title}
                    onClick={removeredirectRoomToHome}
                    className={`flex h-fit !outline-none items-start justify-start w-full col-span-2 order-2`}
                  >
                    <div className="aspect-square w-full h-full relative">
                      <Image
                        fill
                        loading="lazy"
                        sizes="(min-width: 1024px) 8vw, 23vw"
                        quality={75}
                        alt={data?.property?.feature_image?.alt || ""}
                        src={
                          !!data?.property?.feature_image
                            ? NEW_IMAGE_URL(
                                data?.property?.feature_image,
                                "medium",
                              )
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
