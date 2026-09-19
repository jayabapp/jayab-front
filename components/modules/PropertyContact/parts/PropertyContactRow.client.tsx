"use client";

import type { PropertyContactRowProps } from "@/types/components/modules/property-contact";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { buildSmsHref } from "@features/reservations/lib/contact-prefill";
import { isIOS, isMacOs, isWindows } from "react-device-detect";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";
import { useState } from "react";

import maskPhoneNumber from "@/helpers/maskPhoneNumber";
import _STRINGS from "@/utils/LocalStrings";
import Notify from "@elements/Toast";

const OWNER_AVATAR_FALLBACK = "/assets/images/add/wall_e_lover.png";
const DIAL_DELAY_MS = 500;
const ACTION_CLASS =
  "flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-10 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const PropertyContactRow = ({
  data,
  type,
  image,
  onHide,
  smsBody,
  propertySlug,
  isPropertyExpired,
}: PropertyContactRowProps) => {
  const [showNumber, setShowNumber] = useState(false);
  const { mutate } = usePropertyContact();
  const number = data?.assistant_mobile_number;

  const trackAction = () => mutate({ propertySlug: propertySlug || "", action: type });

  const onContactClick = (action: "call" | "sms") => {
    onHide();
    trackAction();
    const href =
      action === "call"
        ? `tel:${number}`
        : smsBody
          ? buildSmsHref(number, smsBody, isIOS)
          : `sms:${number}`;
    const timeout = window.setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
      window.clearTimeout(timeout);
    }, DIAL_DELAY_MS);
  };

  const copyNumber = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(number);
    Notify({ type: "success", body: _STRINGS.NUMBER_COPIED });
  };

  const hasOwnerAvatar = !!image && !!data?.is_owner;
  const isDesktop = isWindows || isMacOs;

  const action = () => {
    if (isDesktop)
      return showNumber ? (
        <button
          type="button"
          onClick={() => void copyNumber()}
          aria-label={`${_STRINGS.COPY_NUMBER} ${number}`}
          className="flex h-10 cursor-pointer items-center gap-2 px-2 text-base font-semibold tracking-wider text-brand-700"
        >
          {number}
          <Icon name="copy" size={20} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            trackAction();
            setShowNumber(true);
          }}
          className={`${ACTION_CLASS} border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50`}
        >
          {_STRINGS.SHOW_FULL_NUMBER}
        </button>
      );

    if (type === "sms")
      return (
        <button
          type="button"
          disabled={!!isPropertyExpired}
          onClick={() => onContactClick("sms")}
          className={`${ACTION_CLASS} border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50`}
        >
          <Icon name="sms" size={20} />
          {_STRINGS.SMS}
        </button>
      );

    return (
      <button
        type="button"
        onClick={() => onContactClick("call")}
        className={`${ACTION_CLASS} bg-brand-600 text-white hover:bg-brand-700`}
      >
        <Icon name="phone" size={20} />
        {_STRINGS.CALL}
      </button>
    );
  };

  return (
    <div className="flex w-full flex-row items-center justify-between gap-3 border-t border-neutral-200 py-3 first:border-t-0">
      <div className="flex min-w-0 flex-row items-center gap-3">
        <ContentImage
          width={56}
          height={56}
          sizes="(min-width: 768px) 56px, 40px"
          alt={data?.assistant_full_name || ""}
          src={
            hasOwnerAvatar ? getPropertyImageUrl(image) : OWNER_AVATAR_FALLBACK
          }
          className={`aspect-square size-10 shrink-0 rounded-full md:size-14 ${
            hasOwnerAvatar ? "border border-brand-600" : ""
          }`}
        />
        <div className="flex min-w-0 flex-col items-start gap-1">
          <p className="truncate text-sm text-neutral-900">
            {data?.assistant_full_name} · {data?.is_owner ? _STRINGS.HOST : _STRINGS.OWNER_ASSIST}
          </p>
          <p className="text-sm text-neutral-500">{maskPhoneNumber(number)}</p>
        </div>
      </div>

      {action()}
    </div>
  );
};

export default PropertyContactRow;
