"use client";

import { ReserveUserAction } from "@/enum/reserve.enum";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ChatService } from "@/api_services/chat/chat.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import SinglePropContactInfoModal from "./SinglePropContactInfoModal";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ActiveReservePop from "../reserve/ActiveReservePop";
import CmsInfoPopup from "@/components/shared/CmsInfoPopup";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import moment from "moment-jalaali";
import Image from "next/image";

const SinglePropRequestedReserveModal = ({
  data,
  show,
  onHide,
  startDate,
  count,
  endDate,
  setShowEdit,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
  setShowEdit: (e: boolean) => void | null;
  endDate: string;
  startDate: string;
  count: string | number;
}) => {
  const router = useRouter();
  const [contactType, setContactType] = useState<"call" | "sms" | "">("");
  const [loading, setLoading] = useState(false);
  const [showMax, setShowMax] = useState(false);
  const [activeReserve, setActiveReserve] = useState<ReserveListDto | null>(
    null,
  );
  const { mutate: createFindChat } = useMutation({
    mutationFn: ChatService.StartOrFindChat,
    onSuccess: (e) => {
      router.push(`/chat/${e?.chatroom_id}`);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const onCreateChat = () => {
    createFindChat({ property_id: data?.id });
  };

  const onContactClick = (type: "sms" | "call") => {
    setContactType(type);
  };
  const onContactClose = () => {
    setContactType("");
  };

  const { mutate } = useMutation({ mutationFn: ReserveService.createReserve });

  const onActionsClick = (user_action: number) => {
    setLoading(true);
    mutate(
      {
        check_in: moment(startDate, "jYYYY/jMM/jD").format("YYYY-MM-DD"),
        check_out: moment(endDate, "jYYYY/jMM/jD").format("YYYY-MM-DD"),
        guests_count: `${count}`,
        property_id: data?.id,
        user_action: user_action,
      },
      {
        onSuccess: (e) => {
          if (!!e) {
            setLoading(false);
            onHide();
            setActiveReserve(e);
            Notify({ body: _STRINGS.CANT_RESERVE_MESSAGE, type: "warn" });
          } else if (user_action == 4) {
            router.push("/profile/reserves");
          }
        },
        onError: (e: any) => {
          if (e?.message_code == "RESERVE6") setShowMax(true);
          setLoading(false);
        },
      },
    );
  };
  const isExpired = !data?.remaining_days;
  return (
    <>
      <ModalBottomSheet
        onHide={onHide}
        show={show}
        options={{
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-10 !max-h-[90dvh] bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(50svw)]  bg-white dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`,
        }}
      >
        <div className="w-full flex flex-col   p-4 rounded-2xl     gap-4">
          <div className="w-full  grid grid-cols-5 lg:grid-cols-9 gap-2   ">
            {/* INFO */}
            <div
              className={`col-span-4  xl:col-span-8 !outline-none   order-2   flex flex-col gap-1  justify-center `}
            >
              {/* TITLE */}
              <div className="flex items-start gap-2">
                <p className="text-sm line-clamp-1  text-right font-semibold">
                  درخواست رزرو برای {data?.title}{" "}
                </p>
              </div>

              <div className="w-full flex flex-col  gap-2">
                <>
                  {/* LOCATION */}
                  <div className="flex w-full  items-center gap-1">
                    <p className="text-xs  flex items-center line-clamp-1 text-center gap-0.5 ">
                      {data?.city}{" "}
                      <span className="text-xs ">
                        {data?.province || data?.region
                          ? `(${data?.region || data?.province})`
                          : ``}
                      </span>
                    </p>
                  </div>
                </>
              </div>
            </div>{" "}
            {/* IMAGE PART */}
            <div
              className={` flex h-fit !outline-none items-start  justify-start w-full  order-1  `}
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
                  className=" w-full rounded-20  h-full  object-cover aspect-square"
                />
              </div>
            </div>
          </div>

          {/* DATE DETAILS */}
          <div className="w-full flex items-center  gap-2 ">
            <img
              className="size-5 "
              src="/assets/icons/reserve/blue_calendar_reserve.svg"
            />
            {/* ENTER */}
            <p className="flex   gap-1 items-center">
              <span className="text-xs text-primary-1000  ">ورود</span>{" "}
              <span className="text-sm ">
                {" "}
                {moment(startDate, "jYYYY/jMM/jD").format("jDD jMMMM")}{" "}
              </span>{" "}
            </p>
            {/* EXIT */}
            <p className="flex gap-1 items-center">
              <span className="text-xs text-primary-1000 ">خروج</span>{" "}
              <span className="text-sm ">
                {" "}
                {moment(endDate, "jYYYY/jMM/jD").format("jDD jMMMM")}{" "}
              </span>{" "}
            </p>
            {/* TOTAL */}
            <p className="text-sm ">
              {" "}
              {` (${moment(endDate, "jYYYY/jMM/jD").diff(moment(startDate, "jYYYY/jMM/jD"), "days")} شب)`}{" "}
            </p>{" "}
          </div>

          {/* PPL COUNT */}
          <div className=" w-full flex items-center justify-between">
            <div className="flex  items-center  gap-1  ">
              <img
                className="size-5 "
                src="/assets/icons/reserve/blue_persons.svg"
              />
              <p className="text-sm ">{`${!!`${count}`.includes("+") ? `بیشتر از  ${count}`.replace("+", "") : count} نفر`}</p>
            </div>

            <Button
              title={`${_STRINGS.EDIT}`}
              variant="outline"
              width=" !px-4  !text-xs !border-gray-300  !py-1 !bg-gray-100 !text-black/50 !font-normal/60 w-fit !py-0 "
              roundedClass=" rounded-xl"
              icon={
                <img
                  className=" size-3 ml-1 grayscale brightness-50  opacity-60 "
                  src="/assets/icons/shared/edit-pencel.svg"
                />
              }
              containerClass=" flex items-start  justify-start  "
              onClick={() => {
                setShowEdit(true);
              }}
            />
          </div>

          <p className="text-sm text-primary-1300 ">
            با انتخاب یکی از روش‌های زیر، درخواست شما برای میزبان ارسال می‌شود.
          </p>
          {/* <Divider /> */}
          <div className="w-full flex flex-col items-center justify-center gap-3">
            {!!isExpired ? (
              <></>
            ) : (
              <>
                <Button
                  disabled={!!isExpired}
                  onClick={() => {
                    // onActionsClick(ReserveUserAction.CALL);
                    onContactClick("call");
                  }}
                  width={`w-full h-12 !text-black !font-normal !border-none  !py-2   !bg-primary-1100  !text-sm ${isExpired ? "  !text-gray-400" : ""} `}
                  containerClass="w-full lg:w-1/2 "
                  roundedClass=" rounded-xl"
                  title={_STRINGS.CALL}
                  variant="outline"
                  loading={loading}
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
                  loading={loading}
                />
              </>
            )}
            <Button
              onClick={() => {
                onActionsClick(ReserveUserAction.RESERVE);
              }}
              width="w-full h-12  !py-2  !text-black !font-normal !bg-primary-1100  !border-none !text-sm "
              containerClass="w-full lg:w-1/2 "
              roundedClass=" rounded-xl"
              title={_STRINGS.SUBMIT_RESERVE}
              variant="outline"
              loading={loading}
              icon={
                <img
                  className={`w-4 h-4  aspect-square  absolute right-3 top-0 bottom-0 my-auto  `}
                  src="/assets/icons/reserve/blue_reserve_icon.svg"
                />
              }
            />

            {data?.is_chat_enabled ? (
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
                loading={loading}
              />
            ) : (
              <></>
            )}
          </div>
          <p className="text-sm text-primary-700 text-center w-full">
            «رزرو شما پس از هماهنگی با میزبان نهایی خواهد شد.»
          </p>
        </div>
      </ModalBottomSheet>

      <SinglePropContactInfoModal
        data={data}
        type={contactType}
        show={!!contactType}
        onHide={onContactClose}
      />

      <ActiveReservePop
        data={activeReserve}
        show={!!activeReserve}
        onHide={() => {
          setActiveReserve(null);
        }}
      />
      <CmsInfoPopup
        contentKey="max-reserve-content"
        action={{ title: "مشاهده رزرو های فعال", href: "/profile/reserves" }}
        show={showMax}
        onHide={() => {
          setShowMax(false);
        }}
      />
    </>
  );
};

export default SinglePropRequestedReserveModal;
