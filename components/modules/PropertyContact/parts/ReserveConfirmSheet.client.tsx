"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useCreateReservation } from "@features/reservations/hooks/useCreateReservation";
import { buildReservePayload } from "@features/reservations/lib/contact-prefill";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { useRef, useState } from "react";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";

import type { ReserveConfirmSheetProps } from "@/types/components/modules/property-contact";
import type { ReserveFailure } from "@/types/components/modules/property-contact";

import PropertyRequestSummary from "./PropertyRequestSummary";
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
  const t = useTranslations();

  const sep = useListSeparator();

  const { isPending, mutate } = useCreateReservation();
  const [created, setCreated] = useState<boolean | null>(null);
  const [failure, setFailure] = useState<ReserveFailure | null>(null);
  const [showMax, setShowMax] = useState(false);
  const submitting = useRef(false);

  const isExpired = !property.remainingDays;

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
          className="h-11 w-full cursor-pointer rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover"
        >
          {t("reserve.changeDates")}
        </button>
      );
    if (failure?.code === OWN_PROPERTY_ERROR)
      return (
        <Link
          href={`/profile/owner/properties/${property.id}/edit`}
          className="flex h-11 w-full items-center justify-center rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover"
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
            <PropertyRequestSummary
              property={property}
              stay={stay}
              onEdit={stay.onEdit ? onChangeDates : undefined}
            />

            <p className="text-sm text-ink-muted">
              {isExpired
                ? t("reserve.expiredRequestNote")
                : t("reserve.reserveSharesNumber")}
            </p>

            {failure ? (
              <div
                role="alert"
                className="flex flex-col gap-3 rounded-10 bg-status-danger-bg p-3"
              >
                <p className="text-sm text-status-danger">{failure.message}</p>
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
                  className="h-12 w-full cursor-pointer rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? <BtnLoading /> : t("reserve.submitReserve")}
                </button>
              )}
              <button
                type="button"
                onClick={onHide}
                className="w-fit cursor-pointer self-center text-sm text-ink-subtle transition-colors hover:text-ink"
              >
                {t("reserve.cancelAction")}
              </button>
            </div>

            <p className="text-center text-xs text-ink-subtle">
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
