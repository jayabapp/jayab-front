"use client";

import type { PropertyContactRowProps } from "@/types/components/modules/property-contact";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { isMacOs, isWindows } from "react-device-detect";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import maskPhoneNumber from "@/helpers/maskPhoneNumber";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

const OWNER_AVATAR_FALLBACK = "/assets/images/add/wall_e_lover.png";
const DIAL_DELAY_MS = 500;

const PropertyContactRow = ({
  data,
  type,
  image,
  onHide,
  propertySlug,
  isPropertyExpired,
}: PropertyContactRowProps) => {
  const [showNumber, setShowNumber] = useState(false);
  const { mutate } = usePropertyContact();

  const trackAction = () =>
    mutate({ propertySlug: propertySlug || "", action: type });

  const onContactClick = (action: "call" | "sms") => {
    onHide();
    trackAction();
    const timeout = window.setTimeout(() => {
      window.open(
        `${action === "call" ? "tel" : "sms"}:${data?.assistant_mobile_number}`,
        "_blank",
        "noopener,noreferrer",
      );
      window.clearTimeout(timeout);
    }, DIAL_DELAY_MS);
  };

  const copyNumber = async () => {
    if (!navigator?.clipboard) return;
    await navigator.clipboard.writeText(data?.assistant_mobile_number);
    Notify({ type: "success", body: _STRINGS.NUMBER_COPIED });
  };

  const hasOwnerAvatar = !!image && !!data?.is_owner;

  return (
    <div className="w-full py-3 border-t first:border-t-0 flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-3">
        <ContentImage
          width={56}
          height={56}
          sizes="(min-width: 768px) 56px, 40px"
          alt={data?.assistant_full_name || ""}
          src={
            hasOwnerAvatar ? getPropertyImageUrl(image) : OWNER_AVATAR_FALLBACK
          }
          className={`w-10 h-10 md:w-14 md:h-14 aspect-square rounded-full ${
            hasOwnerAvatar ? "border border-brand-600" : ""
          }`}
        />
        <div className="flex flex-col items-start gap-2">
          <p className="text-xs md:text-sm">
            {data?.is_owner ? _STRINGS.HOST : _STRINGS.OWNER_ASSIST} :{" "}
            {data?.assistant_full_name}
          </p>
          <p className="text-xs md:text-sm">
            {maskPhoneNumber(data?.assistant_mobile_number)}
          </p>
        </div>
      </div>

      {isWindows || isMacOs ? (
        <Button
          title={
            showNumber
              ? data?.assistant_mobile_number
              : _STRINGS.SHOW_FULL_NUMBER
          }
          width={
            showNumber
              ? " !bg-transparent !px-0 !text-brand-600 font-semibold !text-base tracking-wider "
              : " !text-sm"
          }
          endIcon={
            showNumber ? (
              <span
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                aria-label={_STRINGS.NUMBER_COPIED}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  event.stopPropagation();
                  void copyNumber();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void copyNumber();
                }}
              >
                <ContentImage
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 mb-1 h-6"
                  src="/assets/icons/share/lighter_copy.svg"
                />
              </span>
            ) : null
          }
          onClick={() => {
            if (!showNumber) trackAction();
            setShowNumber(true);
          }}
        />
      ) : (
        <div className="flex flex-row items-center justify-center gap-4">
          {type === "call" ? (
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm font-medium text-brand-600">
                {_STRINGS.CALL}
              </p>
              <button
                type="button"
                aria-label={_STRINGS.CALL}
                onClick={() => onContactClick("call")}
                className="w-9 h-9 bg-brand-600 aspect-square rounded-full flex items-center justify-center"
              >
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 aspect-square"
                  src="/assets/icons/advisor/white_phone.svg"
                />
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm font-medium text-brand-600">
                {_STRINGS.SMS}
              </p>
              <button
                type="button"
                aria-label={_STRINGS.SMS}
                disabled={!!isPropertyExpired}
                onClick={() => onContactClick("sms")}
                className={`${
                  isPropertyExpired ? "grayscale opacity-60" : ""
                } w-9 h-9 bg-white border border-brand-600 aspect-square rounded-full flex items-center justify-center`}
              >
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  className="w-4 h-4 aspect-square"
                  src="/assets/icons/advisor/blue_sms.svg"
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyContactRow;
