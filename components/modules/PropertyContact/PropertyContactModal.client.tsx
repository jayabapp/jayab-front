"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { contactPrefillValues } from "@features/reservations/lib/contact-prefill";
import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { isMacOs, isWindows } from "react-device-detect";
import { useListSeparator } from "@hooks/useListSeparator";
import { useJalaliFormat } from "@hooks/useJalaliFormat";
import { formatJalaliDay } from "@features/reservations/mappers/reservation-dates";
import { useTranslations } from "next-intl";
import { useFormatToman } from "@hooks/useFormatToman";
import { useEffect } from "react";
import { Icon } from "@elements/Icon";

import type { PropertyContactModalProps } from "@/types/components/modules/property-contact";

import PropertyContactRow from "./parts/PropertyContactRow.client";
import Skeleton from "@elements/Skeleton/Skeleton";
import isEmpty from "lodash/isEmpty";
import Notify from "@elements/Toast";

const PropertyContactModal = ({
  type,
  show,
  trip,
  onHide,
  propertySlug,
}: PropertyContactModalProps) => {
  const formatToman = useFormatToman();

  const t = useTranslations();

  const jalali = useJalaliFormat();
  const sep = useListSeparator();

  const { data: contactInfo, isPending, mutate } = usePropertyContact();
  const smsBody = trip
    ? t("reserve.contactPrefill", contactPrefillValues(trip, jalali))
    : undefined;
  const isSms = type === "sms";
  const isDesktop = isWindows || isMacOs;

  useEffect(() => {
    if (propertySlug && show) mutate({ propertySlug, action: "view" });
  }, [propertySlug, mutate, show]);

  const copyMessage = async () => {
    if (!smsBody || !navigator?.clipboard) return;
    await navigator.clipboard.writeText(smsBody);
    Notify({ type: "success", body: t("reserve.messageTextCopied") });
  };

  return (
    <ModalBottomSheet show={show} onHide={onHide}>
      <ModalHeaderPart
        showX
        hideArrow
        onHide={onHide}
        title={isSms ? t("reserve.smsHost") : t("reserve.callHost")}
      />

      {trip ? (
        <div className="flex flex-col gap-1 border-b border-line px-4 py-3 text-sm">
          <p className="line-clamp-1 text-ink">{trip.title}</p>
          <p className="text-ink-subtle">
            {formatJalaliDay(trip.startDate, jalali)} {t("common.to")}{" "}
            {formatJalaliDay(trip.endDate, jalali)}
            {sep}
            {t("common.people", { count: Number(trip.guests) })}
          </p>
          {trip.total ? (
            <p className="text-ink-subtle">
              {t("reserve.approxStayCost")} {formatToman(trip.total)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex w-full flex-col p-4">
        {isPending ? (
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-10 w-full rounded-10" />
            <Skeleton className="h-10 w-full rounded-10" />
          </div>
        ) : isEmpty(contactInfo) ? (
          <p className="w-full text-center">{t("reserve.emptyContactList")}</p>
        ) : (
          contactInfo?.list?.map((contact) => (
            <PropertyContactRow
              type={type}
              data={contact}
              onHide={onHide}
              smsBody={smsBody}
              propertySlug={propertySlug}
              image={contactInfo?.owner?.selfie_image}
              isPropertyExpired={contactInfo?.isPropertyExpired}
              key={`contact-${contact?.assistant_mobile_number}`}
            />
          ))
        )}
      </div>

      {trip ? (
        <div className="flex flex-col gap-3 px-4 pb-2">
          {isSms && isDesktop && smsBody ? (
            <button
              type="button"
              onClick={() => void copyMessage()}
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-10 border border-line bg-surface text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
            >
              <Icon name="copy" size={20} />
              {t("reserve.copyMessageText")}
            </button>
          ) : null}
          <p className="text-xs text-ink-subtle">
            {isSms ? t("reserve.contactSmsHint") : t("reserve.contactCallHint")}
          </p>
        </div>
      ) : null}
    </ModalBottomSheet>
  );
};

export default PropertyContactModal;
