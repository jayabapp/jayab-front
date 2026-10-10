"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { formatJalaliWeekdayDay } from "@features/reservations/mappers/reservation-dates";
import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { useCreateReservation } from "@features/reservations/hooks/useCreateReservation";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { buildReservePayload } from "@features/reservations/lib/contact-prefill";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { useRef, useState } from "react";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import type { ReserveConfirmSheetProps } from "@/types/components/modules/property-contact";
import type { ReserveFailure } from "@/types/components/modules/property-contact";

import ReserveSuccess from "./ReserveSuccess.client";
import CmsInfoPopup from "@elements/CmsInfoPopup";
import BtnLoading from "@elements/Button/BtnLoading";
import Link from "next/link";

const MAX_RESERVE_ERROR = "RESERVE6";
const DATES_UNAVAILABLE_ERROR = "RESERVE_DATES_UNAVAILABLE";
const OWN_PROPERTY_ERROR = "RESERVE_OWN_PROPERTY";

const ReserveConfirmSheet = ({
  stay,
  onCall,
  onSms,
  onChat,
  onHide,
  property,
}: ReserveConfirmSheetProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();
  const sep = useListSeparator();

  const { isPending, mutate } = useCreateReservation();
  const [created, setCreated] = useState<boolean | null>(null);
  const [failure, setFailure] = useState<ReserveFailure | null>(null);
  const [showMax, setShowMax] = useState(false);
  const submitting = useRef(false);

  const isExpired = !property.remainingDays;
  const nights = stay.nights ?? nightsBetween(stay.startDate, stay.endDate);
  const place = [property.city, property.region || property.province]
    .filter(Boolean)
    .join(sep);

  const onSubmit = () => {
    if (submitting.current) return;
    submitting.current = true;
    setFailure(null);
    mutate(buildReservePayload(property.id, stay), {
      onError: (error: any) => {
        trackListingEvent("reserve_request_failed", {
          message_code: error?.message_code ?? null,
        });
        submitting.current = false;
        if (error?.message_code === MAX_RESERVE_ERROR) {
          setShowMax(true);
          return;
        }
        const message =
          error?.messages?.fa || error?.message || t("reserve.reserveFailed");
        setFailure({
          code: error?.message_code,
          message: Array.isArray(message) ? message.join(sep) : message,
        });
      },
      onSuccess: (result) => {
        if (result) {
          trackListingEvent("reserve_request_sent", {
            created: result.created,
            is_expired: isExpired,
          });
          setCreated(result.created);
          return;
        }
        submitting.current = false;
        setFailure({ message: t("reserve.reserveFailed") });
      },
    });
  };

  const onChangeDates = () => {
    onHide();
    stay.onEdit?.();
  };

  const isBlocked =
    failure?.code === DATES_UNAVAILABLE_ERROR ||
    failure?.code === OWN_PROPERTY_ERROR;

  const failureAction = () => {
    if (failure?.code === DATES_UNAVAILABLE_ERROR && stay.onEdit)
      return (
        <button
          type="button"
          onClick={onChangeDates}
          className="h-11 w-full cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700"
        >
          {t("reserve.changeDates")}
        </button>
      );
    if (failure?.code === OWN_PROPERTY_ERROR)
      return (
        <Link
          href={`/profile/owner/properties/${property.id}/edit`}
          className="flex h-11 w-full items-center justify-center rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700"
        >
          {t("reserve.manageListing")}
        </Link>
      );
    return null;
  };

  return (
    <>
      <ModalBottomSheet show onHide={onHide}>
        <ModalHeaderPart
          showX
          hideArrow
          onHide={onHide}
          title={t("reserve.reserveSheetTitle")}
        />

        {created !== null ? (
          <ReserveSuccess
            onCall={onCall}
            onSms={onSms}
            onChat={onChat}
            created={created}
            onClose={onHide}
            isExpired={isExpired}
          />
        ) : (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-10">
                <ContentImage
                  fill
                  sizes="64px"
                  loading="lazy"
                  className="object-cover"
                  quality={PROPERTY_IMAGE_QUALITY}
                  alt={property.featureImage?.alt || ""}
                  src={getPropertyImageUrl(property.featureImage)}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="line-clamp-1 text-sm font-semibold text-neutral-900">
                  {property.title}
                </p>
                {place ? (
                  <p className="line-clamp-1 text-xs text-neutral-500">
                    {place}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-10 bg-neutral-50 p-3 text-sm text-neutral-900">
              <div className="flex items-center gap-2">
                <Icon name="calendar" size={20} className="text-brand-600" />
                <span className="flex-1">
                  {formatJalaliWeekdayDay(stay.startDate)} {t("common.to")}{" "}
                  {formatJalaliWeekdayDay(stay.endDate)}
                  {sep}
                  {t("reserve.nights", { count: Number(nights) })}
                </span>
                {stay.onEdit ? (
                  <button
                    type="button"
                    onClick={onChangeDates}
                    className="cursor-pointer text-xs text-brand-700"
                  >
                    {t("common.edit")}
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Icon name="users" size={20} className="text-brand-600" />
                <span>
                  {t("common.people", { count: Number(stay.guests) })}
                </span>
              </div>
              {stay.total ? (
                <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                  <span className="text-neutral-600">
                    {t("reserve.approxStayCost")}
                  </span>
                  <span className="font-bold">{formatToman(stay.total)}</span>
                </div>
              ) : null}
            </div>

            <p className="text-sm text-neutral-600">
              {isExpired
                ? t("reserve.expiredRequestNote")
                : t("reserve.reserveSharesNumber")}
            </p>

            {failure ? (
              <div
                role="alert"
                className="flex flex-col gap-3 rounded-10 bg-danger-50 p-3"
              >
                <p className="text-sm text-danger-600">{failure.message}</p>
                {failureAction()}
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              {isBlocked ? null : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isPending}
                  aria-busy={isPending}
                  className="h-12 w-full cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? <BtnLoading /> : t("reserve.submitReserve")}
                </button>
              )}
              <button
                type="button"
                onClick={onHide}
                className="w-fit cursor-pointer self-center text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                {t("reserve.cancelAction")}
              </button>
            </div>

            <p className="text-center text-xs text-neutral-500">
              {t("reserve.reserveFinalizeHint")}
            </p>
          </div>
        )}
      </ModalBottomSheet>

      <CmsInfoPopup
        show={showMax}
        contentKey="max-reserve-content"
        onHide={() => setShowMax(false)}
        action={{
          title: t("reserve.myRequests"),
          href: "/profile/reserves",
        }}
      />
    </>
  );
};

export default ReserveConfirmSheet;
