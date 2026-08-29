"use client";

import { PropertyContactIInfDto } from "@/api_services/property/property.interface";
import { usePropertyContact } from "@features/properties/hooks/usePropertyContact";
import { isMacOs, isWindows } from "react-device-detect";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useState } from "react";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { ContentImage } from "@/components/elements/Image";

import maskPhoneNumber from "@/helpers/maskPhoneNumber";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

type TPropertyContact = {
  image?: ImageDto;
  propertySlug?: string;
  type: "call" | "sms" | "";
  onHide: () => void | null;
  isPropertyExpired?: boolean;
  data: PropertyContactIInfDto;
};

const PropertyContactInfoItem = ({
  data,
  type,
  image,
  onHide,
  propertySlug,
  isPropertyExpired,
}: TPropertyContact) => {
  const [showNumber, setShowNumber] = useState(false);

  const { mutate } = usePropertyContact();

  const action = () => {
    mutate({ propertySlug: propertySlug || "", action: type });
  };
  const onActionButtinsClick = (type: "call" | "sms") => {
    onHide();
    action();
    setTimeout(() => {
      window.open(
        `${type == "call" ? "tel" : "sms"}:${data?.assistant_mobile_number}`,
        "_blank",
        "noopener,noreferrer",
      );
    }, 500);
  };

  const copyLink = () => {
    if (!navigator) return;
    navigator.clipboard.writeText(data?.assistant_mobile_number);
    Notify({
      type: "success",
      body: "شماره مورد نظر کپی شد",
    });
  };
  return (
    <div className="w-full py-3 border-t first:border-t-0   flex flex-row items-center justify-between  ">
      <div className="flex flex-row items-center gap-3 ">
        <ContentImage
          src={
            !!image && !!data?.is_owner
              ? NEW_IMAGE_URL(image)
              : "/assets/images/add/wall_e_lover.png"
          }
          width={56}
          height={56}
          sizes="(min-width: 768px) 56px, 40px"
          alt={data?.assistant_full_name || ""}
          className={` w-10 h-10  md:w-14 md:h-14 aspect-square rounded-full ${
            !!image && !!data?.is_owner ? "border border-brand-600" : ""
          } `}
        />
        <div className="flex flex-col items-start gap-2">
          <p className=" text-xs md:text-sm ">
            {!!data?.is_owner ? _STRINGS.HOST : _STRINGS.OWNER_ASSIST} :{" "}
            {data?.assistant_full_name}
          </p>
          <p className=" text-xs   md:text-sm  ">
            {maskPhoneNumber(data?.assistant_mobile_number)}
          </p>
        </div>
      </div>
      {!!isWindows || !!isMacOs ? (
        <Button
          title={
            !!showNumber
              ? data?.assistant_mobile_number
              : _STRINGS.SHOW_FULL_NUMBER
          }
          width={`  ${
            showNumber
              ? " !bg-transparent  !px-0 !text-brand-600 font-semibold    !text-base  tracking-wider "
              : "  !text-sm"
          } `}
          endIcon={
            showNumber ? (
              <img
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyLink();
                }}
                src="/assets/icons/share/lighter_copy.svg"
                className="w-6 mb-1 h-6 "
              />
            ) : (
              <></>
            )
          }
          onClick={() => {
            if (!showNumber) {
              action();
            }
            setShowNumber(true);
          }}
        />
      ) : (
        <div className="flex flex-row items-center justify-center gap-4">
          {type == "call" ? (
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm font-medium text-brand-600">
                {_STRINGS.CALL}
              </p>
              <div
                onClick={() => {
                  onActionButtinsClick("call");
                }}
                className=" w-9 h-9  bg-brand-600 aspect-square rounded-full flex items-center justify-center "
              >
                <img
                  className="w-4 h-4  aspect-square"
                  src="/assets/icons/advisor/white_phone.svg"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm font-medium text-brand-600">
                {_STRINGS.SMS}
              </p>
              <div
                onClick={() => {
                  if (!!isPropertyExpired) return;
                  onActionButtinsClick("sms");
                }}
                className={`${
                  isPropertyExpired ? " grayscale opacity-60 " : ""
                }  w-9 h-9  bg-white border border-brand-600 aspect-square rounded-full flex items-center justify-center `}
              >
                <img
                  className="w-4 h-4  aspect-square"
                  src="/assets/icons/advisor/blue_sms.svg"
                />
              </div>{" "}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyContactInfoItem;
