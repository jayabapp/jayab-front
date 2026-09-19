"use client";

import type { PropertyContactModalProps } from "@/types/components/modules/property-contact";
import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { formatJalaliDay } from "@features/reservations/mappers/reservation-dates";
import { buildContactPrefill } from "@features/reservations/lib/contact-prefill";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { isMacOs, isWindows } from "react-device-detect";
import { Icon } from "@elements/Icon";
import { useEffect } from "react";

import PropertyContactRow from "./parts/PropertyContactRow.client";
import Skeleton from "@elements/Skeleton/Skeleton";
import formatToman from "@/helpers/formatToman";
import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";
import isEmpty from "lodash/isEmpty";

const PropertyContactModal = ({
  type,
  show,
  trip,
  onHide,
  propertySlug,
}: PropertyContactModalProps) => {
  const { data: contactInfo, isPending, mutate } = usePropertyContact();
  const smsBody = trip ? buildContactPrefill(trip) : undefined;
  const isSms = type === "sms";
  const isDesktop = isWindows || isMacOs;

  useEffect(() => {
    if (propertySlug && show) mutate({ propertySlug, action: "view" });
  }, [propertySlug, mutate, show]);

  const copyMessage = async () => {
    if (!smsBody || !navigator?.clipboard) return;
    await navigator.clipboard.writeText(smsBody);
    Notify({ type: "success", body: _STRINGS.MESSAGE_TEXT_COPIED });
  };

  return (
    <ModalBottomSheet show={show} onHide={onHide}>
      <ModalHeaderPart
        showX
        hideArrow
        onHide={onHide}
        title={isSms ? _STRINGS.SMS_HOST : _STRINGS.CALL_HOST}
      />

      {trip ? (
        <div className="flex flex-col gap-1 border-b border-neutral-200 px-4 py-3 text-sm">
          <p className="line-clamp-1 text-neutral-900">{trip.title}</p>
          <p className="text-neutral-500">
            {formatJalaliDay(trip.startDate)} {_STRINGS.TO}{" "}
            {formatJalaliDay(trip.endDate)} · {trip.guests} {_STRINGS.PERSON}
          </p>
          {trip.total ? (
            <p className="text-neutral-500">
              {_STRINGS.APPROX_STAY_COST} {formatToman(trip.total)}
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
          <p className="w-full text-center">{_STRINGS.EMPTY_CONTACT_LIST}</p>
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
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-10 border border-neutral-200 bg-white text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              <Icon name="copy" size={20} />
              {_STRINGS.COPY_MESSAGE_TEXT}
            </button>
          ) : null}
          <p className="text-xs text-neutral-500">
            {isSms ? _STRINGS.CONTACT_SMS_HINT : _STRINGS.CONTACT_CALL_HINT}
          </p>
        </div>
      ) : null}
    </ModalBottomSheet>
  );
};

export default PropertyContactModal;
