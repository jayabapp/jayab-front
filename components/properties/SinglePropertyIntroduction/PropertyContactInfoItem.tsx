"use client";
import { ImageDto } from "@/api_services/auth/auth.interface";
import { PropertyContactIInfDto } from "@/api_services/property/property.interface";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import maskPhoneNumber from "@/helpers/maskPhoneNumber";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useState } from "react";
import { isMacOs, isWindows } from "react-device-detect";

const PropertyContactInfoItem = ({
  data,
  onHide,
  image,
  isPropertyExpired,
}: {
  onHide: () => void | null;
  data: PropertyContactIInfDto;
  image?: ImageDto;
  isPropertyExpired?: boolean;
}) => {
  const [showNumber, setShowNumber] = useState(false);
  const onActionButtinsClick = (type: "tel" | "sms") => {
    onHide();
    setTimeout(() => {
      window.open(`${type}:${data?.assistant_mobile_number}`, "_blank", "noopener,noreferrer");
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
        <img
          src={!!image && !!data?.is_owner ? NEW_IMAGE_URL(image) : "/assets/images/add/wall_e_lover.png"}
          className={` w-10 h-10  md:w-14 md:h-14 aspect-square rounded-full ${
            !!image && !!data?.is_owner ? "border border-primary-700" : ""
          } `}
        />
        <div className="flex flex-col items-start gap-2">
          <p className=" text-xs md:text-sm ">
            {!!data?.is_owner ? _STRINGS.HOST : _STRINGS.OWNER_ASSIST} : {data?.assistant_full_name}
          </p>
          <p className=" text-xs   md:text-sm  ">{maskPhoneNumber(data?.assistant_mobile_number)}</p>
        </div>
      </div>
      {!!isWindows || !!isMacOs ? (
        <Button
          title={!!showNumber ? data?.assistant_mobile_number : _STRINGS.SHOW_FULL_NUMBER}
          width={`  ${
            showNumber
              ? " !bg-transparent  !px-0 !text-primary-700 font-semibold    !text-base  tracking-wider "
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
            setShowNumber(true);
          }}
        />
      ) : (
        <div className="flex flex-row items-center justify-center gap-4">
          <div
            onClick={() => {
              onActionButtinsClick("tel");
            }}
            className=" w-9 h-9  bg-primary-700 aspect-square rounded-full flex items-center justify-center "
          >
            <img className="w-4 h-4  aspect-square" src="/assets/icons/advisor/white_phone.svg" />
          </div>
          <div
            onClick={() => {
              if (!!isPropertyExpired) return;
              onActionButtinsClick("sms");
            }}
            className={`${
              isPropertyExpired ? " grayscale opacity-60 " : ""
            }  w-9 h-9  bg-white border border-primary-700 aspect-square rounded-full flex items-center justify-center `}
          >
            <img className="w-4 h-4  aspect-square" src="/assets/icons/advisor/blue_sms.svg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyContactInfoItem;
