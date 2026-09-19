"use client";

import type { ReserveConfirmSheetProps } from "@/types/components/modules/property-contact";
import { formatJalaliWeekdayDay } from "@features/reservations/mappers/reservation-dates";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { useCreateReservation } from "@features/reservations/hooks/useCreateReservation";
import type { ReserveFailure } from "@/types/components/modules/property-contact";
import { buildReservePayload } from "@features/reservations/lib/contact-prefill";
import { PROPERTY_IMAGE_QUALITY } from "@features/properties/constants/image";
import { nightsBetween } from "@features/reservations/lib/stay-range";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { ContentImage } from "@elements/Image";
import { useRef, useState } from "react";
import { Icon } from "@elements/Icon";

import ReserveSuccess from "./ReserveSuccess.client";
import CmsInfoPopup from "@elements/CmsInfoPopup";
import formatToman from "@/helpers/formatToman";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const MAX_RESERVE_ERROR = "RESERVE6";
const DATES_UNAVAILABLE_ERROR = "RESERVE_DATES_UNAVAILABLE";
const OWN_PROPERTY_ERROR = "RESERVE_OWN_PROPERTY";

const ReserveConfirmSheet = ({
  stay,
  onCall,
  onChat,
  onHide,
  property,
}: ReserveConfirmSheetProps) => {
  const { isPending, mutate } = useCreateReservation();
  const [created, setCreated] = useState<boolean | null>(null);
  const [failure, setFailure] = useState<ReserveFailure | null>(null);
  const [showMax, setShowMax] = useState(false);
  const submitting = useRef(false);

  const isExpired = !property.remainingDays;
  const nights = stay.nights ?? nightsBetween(stay.startDate, stay.endDate);
  const place = [property.city, property.region || property.province]
    .filter(Boolean)
    .join("، ");

  const onSubmit = () => {
    if (submitting.current) return;
    submitting.current = true;
    setFailure(null);
    mutate(buildReservePayload(property.id, stay), {
      onError: (error: any) => {
        submitting.current = false;
        if (error?.message_code === MAX_RESERVE_ERROR) {
          setShowMax(true);
          return;
        }
        const message =
          error?.messages?.fa || error?.message || _STRINGS.RESERVE_FAILED;
        setFailure({
          code: error?.message_code,
          message: Array.isArray(message) ? message.join("، ") : message,
        });
      },
      onSuccess: (result) => {
        if (result) {
          setCreated(result.created);
          return;
        }
        submitting.current = false;
        setFailure({ message: _STRINGS.RESERVE_FAILED });
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
          {_STRINGS.CHANGE_DATES}
        </button>
      );
    if (failure?.code === OWN_PROPERTY_ERROR)
      return (
        <Link
          href={`/profile/owner/properties/${property.id}/edit`}
          className="flex h-11 w-full items-center justify-center rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700"
        >
          {_STRINGS.MANAGE_LISTING}
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
          title={_STRINGS.RESERVE_SHEET_TITLE}
        />

        {created !== null ? (
          <ReserveSuccess
            onCall={onCall}
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
                  loading="lazy"
                  sizes="64px"
                  quality={PROPERTY_IMAGE_QUALITY}
                  alt={property.featureImage?.alt || ""}
                  src={getPropertyImageUrl(property.featureImage)}
                  className="object-cover"
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
                  {formatJalaliWeekdayDay(stay.startDate)} {_STRINGS.TO}{" "}
                  {formatJalaliWeekdayDay(stay.endDate)} · {nights}{" "}
                  {_STRINGS.NIGHT}
                </span>
                {stay.onEdit ? (
                  <button
                    type="button"
                    onClick={onChangeDates}
                    className="cursor-pointer text-xs text-brand-700"
                  >
                    {_STRINGS.EDIT}
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Icon name="users" size={20} className="text-brand-600" />
                <span>
                  {stay.guests} {_STRINGS.PERSON}
                </span>
              </div>
              {stay.total ? (
                <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                  <span className="text-neutral-600">
                    {_STRINGS.APPROX_STAY_COST}
                  </span>
                  <span className="font-bold">{formatToman(stay.total)}</span>
                </div>
              ) : null}
            </div>

            <p className="text-sm text-neutral-600">
              {isExpired
                ? _STRINGS.EXPIRED_REQUEST_NOTE
                : _STRINGS.RESERVE_SHARES_NUMBER}
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
                  {_STRINGS.SUBMIT_RESERVE}
                </button>
              )}
              <button
                type="button"
                onClick={onHide}
                className="w-fit cursor-pointer self-center text-sm text-neutral-500 transition-colors hover:text-neutral-900"
              >
                {_STRINGS.CANCEL_ACTION}
              </button>
            </div>

            <p className="text-center text-xs text-neutral-500">
              {_STRINGS.RESERVE_FINALIZE_HINT}
            </p>
          </div>
        )}
      </ModalBottomSheet>

      <CmsInfoPopup
        show={showMax}
        contentKey="max-reserve-content"
        onHide={() => setShowMax(false)}
        action={{
          title: _STRINGS.MY_REQUESTS,
          href: "/profile/reserves",
        }}
      />
    </>
  );
};

export default ReserveConfirmSheet;
