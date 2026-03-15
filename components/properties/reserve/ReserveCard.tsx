"use client";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import StatusShower from "@/components/shared/StatusShower";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";
import { useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LinearTextBlock from "../SinglePropertyAccards/LinearTextBlock";

import NumberFlow from "@number-flow/react";
moment.loadPersian({ dialect: "persian-modern" });

const ReserveCard = ({
  data,
  isOwner,
  setSelectedCancel,
}: {
  data: ReserveListDto;
  isOwner?: boolean;
  setSelectedCancel?: (e: ReserveListDto) => void | null;
}) => {
  const goToLink = `/rooms/${data?.property?.slug}`;
  const [countdown, setCountdown] = useState<{ minutes: string; seconds: string }>({ minutes: "00", seconds: "00" });
  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  const { mutate, isPending } = useMutation({ mutationFn: ReserveService.ownerMobileClick });

  const onCallClick = () => {
    if (data?.is_subscription_expired) {
      mutate({ id: data?.id });
    } else {
      window.open(`tel:${data?.guest_mobile}`, "_blank", "noopener,noreferrer");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   COUNTER                                  */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!data?.updated_at && !isOwner) return;
    const interval = setInterval(() => {
      const time = calculateTimeLeft(moment(data?.updated_at).add(30, "minute").toString());
      setCountdown(time);
      if (time?.minutes == "00" && time.seconds == "00") clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [data, isOwner]);

  return (
    <div className="w-full shadow-card  rounded-2xl    justify-between flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-8 gap-2   ">
        {/* INFO */}
        <Link
          onClick={removeredirectRoomToHome}
          href={`${goToLink}`}
          prefetch={false}
          className="col-span-6  !outline-none order-1  flex flex-col gap-1"
        >
          {/* TITLE */}
          <div className="flex items-start gap-2">
            <p className="text-sm line-clamp-1  text-right font-semibold">{data?.property?.title}</p>
          </div>

          {/* CODE  - LIKES */}
          <div className="flex items-center justify-between gap-4">
            <div className="bg-black/10 font-normal rounded-md text-xs   px-2 py-1  leading-4  flex items-center justify-center">
              کد {data?.property?.code}
            </div>{" "}
          </div>

          <div className="w-full flex mt-2 flex-col  gap-2">
            <>
              {" "}
              {/* DESCRIPTION */}
              <div className="w-full">
                <p className="text-xs">
                  {" "}
                  <span>{data?.property?.total_bedrooms} اتاق</span> -{" "}
                  <span>تا {data?.property?.max_capacity} نفر</span>{" "}
                  {!!data?.property?.has_pool ? (
                    <span className="text-primary-700"> - {_STRINGS.HAS_POOL} </span>
                  ) : (
                    <></>
                  )}
                </p>
              </div>
              {/* LOCATION */}
              <div className="flex w-full  items-center gap-1">
                {!!data?.property?.is_promoted ? (
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
                  {data?.property?.city}{" "}
                  <span className="text-xs ">
                    {data?.property?.province || data?.property?.region
                      ? `(${data?.property?.region || data?.property?.province})`
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
          className=" flex h-fit !outline-none items-start  justify-start w-full col-span-2  order-2 "
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
      <Divider moreClass=" border-dashed  " />

      <div className=" w-full flex items-center flex-col pb-1 gap-2 justify-center">
        <div className="flex items-center   gap-2 ">
          {" "}
          <div className="flex flex-col gap-1">
            <p className="w-full text-center text-sm">{_STRINGS.SECONDS}</p>
            <NumberFlow
              value={`${countdown?.seconds || "00"}` as any}
              format={{ useGrouping: false }}
              aria-hidden
              animated={true}
              className={`pointer-events-none pt-1  text-lg !font-medium !space-x-14   w-12  h-12  flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem] `}
              willChange
            />{" "}
          </div>
          <p className="text-black pt-6 font-bold text-lg">{`:`}</p>
          <div className="flex flex-col gap-1">
            <p className="w-full text-center text-sm">{_STRINGS.MINUTE}</p>
            <NumberFlow
              value={`${countdown?.minutes || "00"}` as any}
              format={{ useGrouping: false }}
              aria-hidden
              animated={true}
              className={`pointer-events-none pt-1 text-lg !font-medium !space-x-14   w-12  h-12  flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem] `}
              willChange
            />
          </div>
        </div>
        {!!isOwner ? (
          <p className="text-sm text-red-600 text-center w-full">
            پس از اتمام تایم و عدم پاسخ لینک ویلاهای مشابه برای میهمان ارسال می گردد.
          </p>
        ) : (
          <></>
        )}
      </div>
      <Divider moreClass="  border-dashed  " />

      <div className="w-full flex mt-2 flex-col  gap-2">
        <LinearTextBlock
          options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
          title={_STRINGS.START_DATE}
          value={` ${moment(data?.check_in).format("ddd - jYYYY/jMM/jD")}`}
        />
        <LinearTextBlock
          title={_STRINGS.EXIT_DATE}
          value={` ${moment(data?.check_out).format("ddd - jYYYY/jMM/jD")}`}
          options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
        />
        <LinearTextBlock
          title={_STRINGS.PPL_COUNT}
          value={`${data?.guests_count} نفر`}
          options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
        />
        {/* {isOwner ? (
              <LinearTextBlock
                title={_STRINGS.YOUR_CALL_CLICKS}
                value={data?.owner_clicked_guest_mobile}
                options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
              />
            ) : (
              <></>
            )} */}
      </div>
      <Divider moreClass=" " />
      <div className="flex items-center justify-between ">
        <StatusShower data={data?.status} />

        {!isOwner && !!setSelectedCancel ? (
          <div
            onClick={() => {
              setSelectedCancel?.(data);
            }}
            className=" cursor-pointer bg-neutral-200    w-fit flex items-center gap-2 px-3 py-2 rounded-xl text-xxs  md:text-sm font-medium"
          >
            لغو رزرو
            <img src="/assets/icons/adds/x_mark.svg" className=" w-2 h-2  md:w-2 cursor-pointer opacity-60 md:h-2" />
          </div>
        ) : (
          <Button
            onClick={onCallClick}
            loading={isPending}
            icon={<img className="w-4 h-4  aspect-square" src="/assets/icons/advisor/white_phone.svg" />}
            width=" !py-1 "
            title={`${data?.guest_mobile}`}
          />
        )}
      </div>
    </div>
  );
};

export default ReserveCard;
