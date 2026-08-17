"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { useStoreParams } from "@/store";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { Divider } from "@/components/shared/Divider";

import SinglePropContactInfoModal from "../SinglePropertyIntroduction/SinglePropContactInfoModal";
import LinearTextBlock from "../SinglePropertyAccards/LinearTextBlock";
import StatusShower from "@/components/shared/StatusShower";
import CmsInfoPopup from "@/components/shared/CmsInfoPopup";
import NumberFlow from "@number-flow/react";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";

moment.loadPersian({ dialect: "persian-modern" });

const ReserveCard = ({
  data,
  isOwner,
  setSelectedCancel,
  refetchCallBack,
}: {
  data: ReserveListDto;
  isOwner?: boolean;
  setSelectedCancel?: (e: ReserveListDto) => void | null;
  refetchCallBack?: () => void | null;
}) => {
  const startMoment = moment().add(data?.ttl_seconds, "seconds").toString();
  const router = useRouter();
  const pathname = usePathname();
  const [showCounter, setShowCounter] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const goToLink = `/rooms/${data?.property?.slug}`;
  const [countdown, setCountdown] = useState<{
    minutes: string;
    seconds: string;
  }>({ minutes: "00", seconds: "00" });
  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ReserveService.ownerMobileClick,
    onSuccess: () => {
      if (data?.is_subscription_expired) {
        setShowSub(true);
      } else {
        setShowCounter(false);
        window.open(
          `tel:${data?.guest_mobile}`,
          "_blank",
          "noopener,noreferrer",
        );
        refetchCallBack?.();
      }
    },
  });

  const onCallClick = () => {
    mutate({ id: data?.id });
  };

  useEffect(() => {
    if (!data?.ttl_seconds && !isOwner) return;
    const interval = setInterval(() => {
      const time = calculateTimeLeft(startMoment);
      setCountdown(time);
      if (time?.minutes == "00" && time.seconds == "00") {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data, isOwner, refetchCallBack]);

  useEffect(() => {
    if (countdown?.minutes == "00" && countdown?.seconds == "01") {
      setTimeout(() => {
        refetchCallBack?.();
      }, 4000);
    }
  }, [countdown, refetchCallBack]);

  useEffect(() => {
    if (data) setShowCounter(data?.show_counter);
  }, [data]);

  const [contactType, setContactType] = useState<"call" | "sms" | "">("");

  const { mutate: createFindChat, isPending: chatLoading } = useMutation({
    mutationFn: ChatService.StartOrFindChat,
    onSuccess: (e) => {
      router.push(`/chat/${e?.chatroom_id}`);
    },
    onError: () => {},
  });

  const onCreateChat = () => {
    createFindChat({ property_id: data?.property?.id || data?.property_id });
  };

  const onContactClick = (type: "sms" | "call") => {
    setContactType(type);
  };

  const onContactClose = () => {
    setContactType("");
  };
  const isExpired = data?.is_subscription_expired;
  return (
    <div className="w-full shadow-card  rounded-2xl    justify-between flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-8 gap-2   ">
        {/* INFO */}
        <Link
          prefetch={false}
          href={`${goToLink}`}
          title={data?.property?.title}
          onClick={removeredirectRoomToHome}
          className={`col-span-6  !outline-none   ${isOwner ? "order-2" : "order-1"}    flex flex-col gap-1`}
        >
          {/* TITLE */}
          <div className="flex items-start gap-2">
            <p className="text-sm   text-right font-semibold">
              درخواست رزرو برای {data?.property?.title}{" "}
            </p>
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
        </Link>{" "}
        {/* IMAGE PART */}
        <Link
          prefetch={false}
          href={`${goToLink}`}
          title={data?.property?.title}
          onClick={removeredirectRoomToHome}
          className={` flex h-fit !outline-none items-start  justify-start w-full col-span-2 ${isOwner ? "order-1" : "order-2"}   `}
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
      <Divider moreClass=" border-dashed  " />{" "}
      {isOwner && !showCounter ? (
        <p className=" text-center text-sm">
          {" "}
          زمان شما برای پاسخ به این درخواست به اتمام رسیده است.
        </p>
      ) : !isOwner && !!data?.is_answer_deadline_passed ? (
        <p className=" text-center text-sm">
          {_STRINGS.RESERVE_ANSWER_DEADLINE_PASSED}
        </p>
      ) : !!showCounter ? (
        <>
          <div className=" w-full flex items-center flex-col pb-1 gap-2 justify-center">
            {" "}
            {!!isOwner ? (
              <p className="text-xs text-red-600 text-center w-full">
                پس از اتمام تایم و عدم پاسخ لینک ویلاهای مشابه برای میهمان ارسال
                می گردد.
              </p>
            ) : (
              <></>
            )}
            <div className="flex items-center   gap-2 ">
              {" "}
              <div className="flex flex-col gap-1">
                <p className="w-full text-center text-sm">{_STRINGS.SECONDS}</p>
                <NumberFlow
                  value={`${countdown?.seconds || "00"}` as any}
                  format={{ useGrouping: false }}
                  aria-hidden
                  animated={true}
                  className={`pointer-events-none pt-1  text-lg !font-medium !space-x-14 w-12 h-12  flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem] `}
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
                  className={`pointer-events-none pt-1 text-lg !font-medium !space-x-14 w-12 h-12 flex items-center justify-center aspect-square rounded-lg bg-black text-white !tracking-[0.15rem] `}
                  willChange
                />
              </div>
            </div>
            {!!isOwner ? (
              <></>
            ) : (
              <p className="text-sm text-gray-400 text-center w-full">
                مدت زمان انتظار جهت بررسی میزبان
              </p>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      <Divider moreClass="  !border-transparent  " />
      <div className="w-full flex mt-2 flex-col  gap-2">
        <LinearTextBlock
          dots
          title={_STRINGS.PPL_COUNT}
          value={`${!!`${data?.guests_count}`.includes("+") ? `بیشتر از  ${data?.guests_count}`.replace("+", "") : data?.guests_count} نفر`}
          options={{
            title_class: " !font-normal !text-sm",
            value_class: "!text-sm",
          }}
        />
        <LinearTextBlock
          dots
          title={_STRINGS.START_DATE}
          value={` ${moment(data?.check_in).format("ddd - jYYYY/jMM/jD")}`}
          options={{
            title_class: " !font-normal !text-sm",
            value_class: "!text-sm",
          }}
        />
        <LinearTextBlock
          dots
          title={_STRINGS.EXIT_DATE}
          value={` ${moment(data?.check_out).format("ddd - jYYYY/jMM/jD")}`}
          options={{
            title_class: " !font-normal !text-sm",
            value_class: "!text-sm",
          }}
        />
        <LinearTextBlock
          dots
          title={_STRINGS.DURATION}
          value={` ${moment(data?.check_out).diff(data?.check_in, "days")} شب`}
          options={{
            title_class: " !font-normal !text-sm",
            value_class: "!text-sm",
          }}
        />
        {isOwner ? (
          <LinearTextBlock
            dots
            title={_STRINGS.REQUEST_DATE}
            value={`${moment(data?.created_at).format("HH:mm - jYYYY/jMM/jD")}`}
            options={{
              title_class: " !font-normal !text-sm",
              value_class: "!text-sm",
            }}
          />
        ) : (
          <></>
        )}
      </div>
      {/* <Divider moreClass=" " /> */}
      <div className="w-full flex flex-col gap-2">
        {!!isOwner && data?.status?.id == 10 ? (
          <p className="text-center text-sm">میهمان منتظر پاسخ شماست</p>
        ) : (
          <></>
        )}
        <div className={`flex items-center justify-between  `}>
          <StatusShower data={data?.status} />
          {!isOwner && !!setSelectedCancel ? (
            <div
              onClick={() => {
                setSelectedCancel?.(data);
              }}
              className=" cursor-pointer bg-neutral-100 border w-fit flex items-center gap-2 px-3 py-2 rounded-xl text-xxs md:text-sm font-medium"
            >
              لغو رزرو
              <img
                src="/assets/icons/adds/x_mark.svg"
                className=" w-2 h-2  md:w-2 cursor-pointer opacity-60 md:h-2"
              />
            </div>
          ) : data?.status?.id != 20 ? (
            <Button
              width="!py-1"
              onClick={onCallClick}
              loading={isPending}
              title={`${`${data?.guest_mobile}`?.includes("*") ? " تماس با میهمان" : data?.guest_mobile}`}
              icon={
                <img
                  className="w-4 h-4  aspect-square"
                  src="/assets/icons/advisor/white_phone.svg"
                />
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {isOwner ? (
        <></>
      ) : (
        <>
          <Divider moreClass=" " />

          <div className="w-full flex flex-col items-center justify-center gap-2">
            {!!isExpired ? (
              <></>
            ) : (
              <>
                <Button
                  disabled={!!isExpired}
                  onClick={() => {
                    onContactClick("call");
                  }}
                  width={`w-full h-12 !text-black !font-normal !border-none  !py-2   !bg-primary-1100  !text-sm ${isExpired ? "  !text-gray-400" : ""} `}
                  containerClass="w-full lg:w-1/2 "
                  roundedClass=" rounded-xl"
                  title={_STRINGS.CALL}
                  variant="outline"
                  icon={
                    <img
                      className={`w-4 h-4   absolute right-3 top-0 bottom-0 my-auto aspect-square ${isExpired ? "  opacity-50  grayscale" : ""} `}
                      src="/assets/icons/advisor/blue_phone.svg"
                    />
                  }
                />
                <Button
                  disabled={!!isExpired}
                  variant="outline"
                  onClick={() => {
                    onContactClick("sms");
                  }}
                  width={`w-full h-12 !border-none !text-black !font-normal !py-2 !bg-primary-1100   !text-sm ${isExpired ? "  !text-gray-400" : ""} `}
                  containerClass="w-full lg:w-1/2  "
                  roundedClass=" rounded-xl"
                  title={_STRINGS.SMS}
                  icon={
                    <img
                      className={`w-4 h-4  absolute right-3 top-0 bottom-0 my-auto ${isExpired ? "  opacity-50  grayscale" : ""}   ml-1 aspect-square`}
                      src="/assets/icons/advisor/blue_sms.svg"
                    />
                  }
                />
              </>
            )}
            {!isOwner ? (
              <Button
                variant="outline"
                width="w-full h-12 !border-none !text-black !font-normal  !py-2 !bg-primary-1100  !text-sm "
                containerClass="w-full  lg:w-1/2 "
                roundedClass=" rounded-xl"
                title={_STRINGS.CHAT_IN_JAYAB}
                icon={
                  <img
                    className="w-4 h-4  absolute right-3 top-0 bottom-0 my-auto  ml-1 aspect-square"
                    src="/assets/icons/reserve/blue_chat_reserve.svg"
                  />
                }
                onClick={() => {
                  onCreateChat();
                }}
                loading={chatLoading}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      )}
      {!isOwner && data?.status?.id == 10 ? (
        <>
          <Divider moreClass=" " />
          <div className="flex flex-col gap-1">
            <p className=" text-center whitespace-pre-wrap text-sm ">
              رزرو شما پس از هماهنگی با میزبان نهایی خواهد شد{" "}
            </p>
          </div>
        </>
      ) : (
        <></>
      )}
      <SinglePropContactInfoModal
        type={contactType}
        show={!!contactType}
        data={data?.property}
        onHide={onContactClose}
      />
      <CmsInfoPopup
        contentKey="ad-expired-content"
        action={{
          title: "تمدید اعتبار",
          href: `/profile/owner/properties/${data?.property?.id}/subscription?GATE_WAY_REDIRECT_URL=${pathname}`,
        }}
        show={showSub}
        onHide={() => {
          setShowSub(false);
        }}
      />
    </div>
  );
};

export default ReserveCard;
