"use client";
import { ChatService } from "@/api_services/chat/chat.service";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import Notify from "@/components/shared/Toast";
import { ReserveUserAction } from "@/enum/reserve.enum";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import moment from "moment-jalaali";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ActiveReservePop from "../reserve/ActiveReservePop";
import LinearTextBlock from "../SinglePropertyAccards/LinearTextBlock";
import SinglePropContactInfoModal from "./SinglePropContactInfoModal";

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
  const [contactType, setContactType] = useState<"tel" | "sms" | "">("");
  const [loading, setLoading] = useState(false);
  const [activeReserve, setActiveReserve] = useState<ReserveListDto | null>(null);
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

  const onContactClick = (type: "sms" | "tel") => {
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
          // if (user_action == 1) {
          //   setLoading(false);
          //   onContactClick("tel");
          // } else if (user_action == 2) {
          //   setLoading(false);
          //   onContactClick("sms");
          // } else if (user_action == 3) {
          //   onCreateChat();
          // } else

          if (!!e) {
            setLoading(false);
            onHide();
            setActiveReserve(e);
            Notify({ body: _STRINGS.CANT_RESERVE_MESSAGE, type: "warn" });
          } else if (user_action == 4) {
            router.push("/profile/reserves");
          }
          // onHide();
        },
        onError: () => {
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
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-10 bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(50svw)]  bg-primary-50 dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`,
        }}
      >
        <div className="w-full flex flex-col   p-4 rounded-2xl     gap-4">
          <div className="w-full  grid grid-cols-8 gap-2   ">
            {/* INFO */}
            <div className={`col-span-6  !outline-none   order-1   flex flex-col gap-1`}>
              {/* TITLE */}
              <div className="flex items-start gap-2">
                <p className="text-sm line-clamp-1  text-right font-semibold">درخواست رزرو برای {data?.title} </p>
              </div>

              {/* CODE  - LIKES */}
              {/* <div className="flex items-center justify-between gap-4">
                <div className="bg-black/10 font-normal rounded-md text-xs   px-2 py-1  leading-4  flex items-center justify-center">
                  کد {data?.code}
                </div>{" "}
              </div> */}

              <div className="w-full flex mt-2 flex-col  gap-2">
                <>
                  {" "}
                  {/* DESCRIPTION */}
                  {/* <div className="w-full">
                    <p className="text-xs">
                      {" "}
                      <span>{data?.total_bedrooms} اتاق</span> - <span>تا {data?.max_capacity} نفر</span>{" "}
                      {!!data?.has_pool ? <span className="text-primary-700"> - {_STRINGS.HAS_POOL} </span> : <></>}
                    </p>
                  </div> */}
                  {/* LOCATION */}
                  <div className="flex w-full  items-center gap-1">
                    {!!data?.is_promoted ? (
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
                    )}

                    <p className="text-xs line-clamp-1 text-center ">
                      {data?.city}{" "}
                      <span className="text-xs ">
                        {data?.province || data?.region ? `(${data?.region || data?.province})` : ``}
                      </span>
                    </p>
                  </div>
                </>
              </div>
            </div>{" "}
            {/* IMAGE PART */}
            <div className={` flex h-fit !outline-none items-start  justify-start w-full col-span-2 order-2  `}>
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
                  className=" w-full rounded-10  h-full  object-cover aspect-square"
                />
              </div>
            </div>
          </div>
          <div className=" relative w-full py-4 ">
            <Divider />
            <Button
              title={`${_STRINGS.EDIT}`}
              variant="solid"
              width="  bg-gray-300 !text-black/60 w-fit !py-0 "
              roundedClass="rounded-full"
              icon={
                <img
                  className=" size-4 ml-1 grayscale brightness-50  opacity-60 "
                  src="/assets/icons/shared/edit-pencel.svg"
                />
              }
              containerClass=" w-full absolute right-0  flex items-start -top-0 justify-start "
              onClick={() => {
                setShowEdit(true);
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <LinearTextBlock
              dots
              title={_STRINGS.PPL_COUNT}
              value={`${!!`${count}`.includes("+") ? `بیشتر از  ${count}`.replace("+", "") : count} نفر`}
              options={{ title_class: " !font-normal" }}
            />
            <LinearTextBlock
              dots
              options={{ title_class: " !font-normal" }}
              title={_STRINGS.START_DATE}
              value={` ${moment(startDate, "jYYYY/jMM/jD").format("ddd")} - ${startDate}`}
            />
            <LinearTextBlock
              dots
              title={_STRINGS.EXIT_DATE}
              value={`${moment(endDate, "jYYYY/jMM/jD").format("ddd")} - ${endDate} `}
              options={{ title_class: " !font-normal" }}
            />
            <LinearTextBlock
              dots
              title={_STRINGS.DURATION}
              value={` ${moment(endDate, "jYYYY/jMM/jD").diff(moment(startDate, "jYYYY/jMM/jD"), "days")} شب`}
              options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
            />
            {/* <Button
              title={`${_STRINGS.EDIT} تاریخ و نفرات`}
              variant="Faded"
              width="  !bg-orange-500  !text-white w-full lg:w-1/2  !py-1.5"
              roundedClass="rounded-full"
              icon={
                <img className=" size-4 ml-1  brightness-200 grayscale " src="/assets/icons/shared/edit-pencel.svg" />
              }
              containerClass=" w-full   flex items-center justify-center "
              onClick={() => {
                setShowEdit(true);
              }}
            /> */}
          </div>
          <Divider />
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <p className="text-center  font-medium">میتوانید از روش های زیر برای رزرو اقدام کنید.</p>

            <Button
              onClick={() => {
                onActionsClick(ReserveUserAction.RESERVE);
              }}
              width="w-full  !py-2  !font-bold  !text-sm "
              containerClass="w-1/2"
              roundedClass="rounded-full"
              title={_STRINGS.SUBMIT_RESERVE}
              variant="outline"
              loading={loading}
              // icon={<img className="w-4 h-4  aspect-square" src="/assets/icons/advisor/blue_phone.svg" />}
            />
            {/* {!!data?.remaining_days ? (
              <> */}
            <Button
              disabled={!!isExpired}
              onClick={() => {
                // onActionsClick(ReserveUserAction.CALL);
                onContactClick("tel");
              }}
              width={`w-full  !py-2  !font-bold  !text-sm ${isExpired ? "  !text-gray-400" : ""} `}
              containerClass="w-1/2"
              roundedClass="rounded-full"
              title={_STRINGS.CALL}
              variant="outline"
              loading={loading}
              icon={
                <img
                  className={`w-4 h-4  aspect-square ${isExpired ? "  opacity-50  grayscale" : ""} `}
                  src="/assets/icons/advisor/blue_phone.svg"
                />
              }
            />
            <Button
              disabled={!!isExpired}
              variant="outline"
              onClick={() => {
                onContactClick("sms");
                // onActionsClick(ReserveUserAction.SMS);
              }}
              width={`w-full  !py-2  !font-bold  !text-sm ${isExpired ? "  !text-gray-400" : ""} `}
              containerClass="w-1/2"
              roundedClass="rounded-full"
              title={_STRINGS.SMS}
              icon={
                <img
                  className={`w-4 h-4 ${isExpired ? "  opacity-50  grayscale" : ""}   ml-1 aspect-square`}
                  src="/assets/icons/advisor/blue_sms.svg"
                />
              }
              loading={loading}
            />
            {/* </>
            ) : (
              <></>
            )} */}
            {data?.is_chat_enabled ? (
              <Button
                width="w-full !py-2  !font-bold !text-sm "
                containerClass="w-1/2  "
                roundedClass="rounded-full"
                title={_STRINGS.CHAT_IN_JAYAB}
                icon={<img className="w-4 h-4  ml-1 aspect-square" src="/assets/icons/advisor/white_message.svg" />}
                onClick={() => {
                  // onActionsClick(ReserveUserAction.CHAT);
                  onCreateChat();
                }}
                loading={loading}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </ModalBottomSheet>
      <SinglePropContactInfoModal type={contactType} show={!!contactType} data={data} onHide={onContactClose} />

      <ActiveReservePop
        data={activeReserve}
        show={!!activeReserve}
        onHide={() => {
          setActiveReserve(null);
        }}
      />
    </>
  );
};

export default SinglePropRequestedReserveModal;
