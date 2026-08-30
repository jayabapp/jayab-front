"use client";

import type { ReserveRequestModalProps } from "@/types/components/modules/property-contact";
import type { PropertyContactAction } from "@/types/components/modules/property-contact";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useCreateReservation } from "@features/reservations/hooks/useCreateReservation";
import { jalaliDateToApiDate } from "@features/reservations/mappers/reservation-dates";
import type { ReserveListDto } from "@/types/components/modules/property-contact";
import { useStartOrFindChat } from "@features/chat/hooks/useStartOrFindChat";
import { ActiveReservationSheet } from "@modules/ReservationDetails";
import { ReserveUserAction } from "@/enum/reserve.enum";
import { ModalBottomSheet } from "@elements/Modal";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PropertyContactModal from "../PropertyContactModal.client";
import CmsInfoPopup from "@/components/shared/CmsInfoPopup";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";
import moment from "moment-jalaali";

const JALALI_DAY = "jYYYY/jMM/jD";
const REQUEST_SHEET_CLASS =
  "mx-auto rounded-t-20 absolute pb-[1.5rem] lg:pb-10 !max-h-[90dvh] bottom-0 lg:translate-x-1/2 lg:right-1/2 w-full lg:w-[calc(50svw)] bg-white overflow-y-scroll";
const ACTION_BUTTON_WIDTH =
  "w-full h-12 !py-2 !text-black !font-normal !border-none !bg-neutral-50 !text-sm";
const MAX_RESERVE_ERROR = "RESERVE6";

const ReserveRequestModal = ({
  show,
  count,
  onHide,
  endDate,
  property,
  startDate,
  setShowEdit,
}: ReserveRequestModalProps) => {
  const router = useRouter();
  const [contactType, setContactType] = useState<PropertyContactAction>("");
  const [activeReserve, setActiveReserve] = useState<ReserveListDto | null>(
    null,
  );
  const [showMax, setShowMax] = useState(false);

  const { mutate: createFindChat, isPending: isCreatingChat } =
    useStartOrFindChat();
  const { mutate, isPending } = useCreateReservation();

  const isExpired = !property?.remainingDays;
  const nights = moment(endDate, JALALI_DAY).diff(
    moment(startDate, JALALI_DAY),
    "days",
  );
  const guestLabel = `${count}`.includes("+")
    ? `${_STRINGS.MORE_THAN} ${`${count}`.replace("+", "")}`
    : `${count}`;

  const onSubmitReserve = (userAction: number) => {
    mutate(
      {
        check_in: jalaliDateToApiDate(startDate),
        check_out: jalaliDateToApiDate(endDate),
        guests_count: `${count}`,
        property_id: property?.id,
        user_action: userAction,
      },
      {
        onSuccess: (existingReserve) => {
          if (existingReserve) {
            onHide();
            setActiveReserve(existingReserve);
            Notify({ body: _STRINGS.CANT_RESERVE_MESSAGE, type: "warn" });
            return;
          }
          if (userAction === ReserveUserAction.RESERVE)
            router.push("/profile/reserves");
        },
        onError: (error: any) => {
          if (error?.message_code === MAX_RESERVE_ERROR) setShowMax(true);
        },
      },
    );
  };

  return (
    <>
      <ModalBottomSheet
        show={show}
        onHide={onHide}
        options={{ containerClass: REQUEST_SHEET_CLASS }}
      >
        <div className="w-full flex flex-col p-4 rounded-2xl gap-4">
          <div className="w-full grid grid-cols-5 lg:grid-cols-9 gap-2">
            <div className="col-span-4 xl:col-span-8 !outline-none order-2 flex flex-col gap-1 justify-center">
              <div className="flex items-start gap-2">
                <p className="text-sm line-clamp-1 text-right font-semibold">
                  {_STRINGS.RESERVE_REQUEST_FOR} {property?.title}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <div className="flex w-full items-center gap-1">
                  <p className="text-xs flex items-center line-clamp-1 text-center gap-0.5">
                    {property?.city}{" "}
                    <span className="text-xs">
                      {property?.province || property?.region
                        ? `(${property?.region || property?.province})`
                        : ``}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-fit !outline-none items-start justify-start w-full order-1">
              <div className="aspect-square w-full h-full relative">
                <ContentImage
                  fill
                  quality={75}
                  loading="lazy"
                  sizes="(min-width: 1024px) 6vw, 20vw"
                  alt={property?.featureImage?.alt || ""}
                  src={getPropertyImageUrl(property?.featureImage, "medium")}
                  className="w-full rounded-20 h-full object-cover aspect-square"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex items-center gap-2">
            <ContentImage
              alt=""
              width={20}
              height={20}
              className="size-5"
              src="/assets/icons/reserve/blue_calendar_reserve.svg"
            />
            <p className="flex gap-1 items-center">
              <span className="text-xs text-neutral-400">
                {_STRINGS.CHECK_IN_SHORT}
              </span>{" "}
              <span className="text-sm">
                {moment(startDate, JALALI_DAY).format("jDD jMMMM")}
              </span>
            </p>
            <p className="flex gap-1 items-center">
              <span className="text-xs text-neutral-400">
                {_STRINGS.CHECK_OUT_SHORT}
              </span>{" "}
              <span className="text-sm">
                {moment(endDate, JALALI_DAY).format("jDD jMMMM")}
              </span>
            </p>
            <p className="text-sm">{` (${nights} ${_STRINGS.NIGHT})`}</p>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-1">
              <ContentImage
                alt=""
                width={20}
                height={20}
                className="size-5"
                src="/assets/icons/reserve/blue_persons.svg"
              />
              <p className="text-sm">{`${guestLabel} ${_STRINGS.PERSON}`}</p>
            </div>

            <Button
              variant="outline"
              roundedClass="rounded-xl"
              title={_STRINGS.EDIT}
              onClick={() => setShowEdit(true)}
              containerClass="flex items-start justify-start"
              width="!px-4 !text-xs !border-neutral-300 !py-0 !bg-neutral-100 !text-black/50 !font-normal/60 w-fit"
              icon={
                <ContentImage
                  alt=""
                  width={12}
                  height={12}
                  className="size-3 ml-1 grayscale brightness-50 opacity-60"
                  src="/assets/icons/shared/edit-pencel.svg"
                />
              }
            />
          </div>

          <p className="text-sm text-neutral-600">
            {_STRINGS.RESERVE_CONTACT_HINT}
          </p>

          <div className="w-full flex flex-col items-center justify-center gap-3">
            {isExpired ? null : (
              <>
                <Button
                  variant="outline"
                  loading={isPending}
                  disabled={isPending}
                  title={_STRINGS.CALL}
                  roundedClass="rounded-xl"
                  width={ACTION_BUTTON_WIDTH}
                  containerClass="w-full lg:w-1/2"
                  onClick={() => setContactType("call")}
                  icon={
                    <ContentImage
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 absolute right-3 top-0 bottom-0 my-auto aspect-square"
                      src="/assets/icons/advisor/blue_phone.svg"
                    />
                  }
                />
                <Button
                  variant="outline"
                  loading={isPending}
                  disabled={isPending}
                  title={_STRINGS.SMS}
                  roundedClass="rounded-xl"
                  width={ACTION_BUTTON_WIDTH}
                  containerClass="w-full lg:w-1/2"
                  onClick={() => setContactType("sms")}
                  icon={
                    <ContentImage
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 absolute right-3 top-0 bottom-0 my-auto ml-1 aspect-square"
                      src="/assets/icons/advisor/blue_sms.svg"
                    />
                  }
                />
              </>
            )}

            <Button
              variant="outline"
              loading={isPending}
              disabled={isPending}
              roundedClass="rounded-xl"
              width={ACTION_BUTTON_WIDTH}
              containerClass="w-full lg:w-1/2"
              title={_STRINGS.SUBMIT_RESERVE}
              onClick={() => onSubmitReserve(ReserveUserAction.RESERVE)}
              icon={
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 aspect-square absolute right-3 top-0 bottom-0 my-auto"
                  src="/assets/icons/reserve/blue_reserve_icon.svg"
                />
              }
            />

            {property?.isChatEnabled ? (
              <Button
                variant="outline"
                onClick={() => {
                  createFindChat(
                    { property_id: property?.id },
                    {
                      onSuccess: (response) =>
                        router.push(`/chat/${response?.chatroom_id}`),
                    },
                  );
                }}
                loading={isCreatingChat}
                disabled={isCreatingChat}
                roundedClass="rounded-xl"
                width={ACTION_BUTTON_WIDTH}
                containerClass="w-full lg:w-1/2"
                title={_STRINGS.CHAT_IN_JAYAB}
                icon={
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 absolute right-3 top-0 bottom-0 my-auto ml-1 aspect-square"
                    src="/assets/icons/reserve/blue_chat_reserve.svg"
                  />
                }
              />
            ) : null}
          </div>

          <p className="text-sm text-brand-600 text-center w-full">
            {_STRINGS.RESERVE_FINALIZE_HINT}
          </p>
        </div>
      </ModalBottomSheet>

      <PropertyContactModal
        type={contactType}
        show={!!contactType}
        propertySlug={property?.slug}
        onHide={() => setContactType("")}
      />

      <ActiveReservationSheet
        show={!!activeReserve}
        reservation={activeReserve}
        onContactRequest={setContactType}
        onHide={() => setActiveReserve(null)}
      />

      <CmsInfoPopup
        show={showMax}
        contentKey="max-reserve-content"
        onHide={() => setShowMax(false)}
        action={{
          title: _STRINGS.ACTIVE_RESERVES_LINK,
          href: "/profile/reserves",
        }}
      />
    </>
  );
};

export default ReserveRequestModal;
