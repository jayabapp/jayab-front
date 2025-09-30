import { ImageDto } from "@/api_services/auth/auth.interface";
import { PropertyContactIInfDto } from "@/api_services/property/property.interface";
import Button from "@/components/shared/Button/Button";
import maskPhoneNumber from "@/helpers/maskPhoneNumber";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import React from "react";

const PropertyContactInfoItem = ({
  data,
  onHide,
  ownerImage,
}: {
  onHide: () => void | null;
  data: PropertyContactIInfDto;
  ownerImage?: ImageDto;
}) => {
  const onActionButtinsClick = (type: "tel" | "sms") => {
    onHide();
    setTimeout(() => {
      window.open(`${type}:${data?.assistant_mobile_number}`, "_blank", "noopener,noreferrer");
    }, 500);
  };

  return (
    <div className="w-full py-3 border-t first:border-t-0   flex flex-row items-center justify-between  ">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-2">
          {!!ownerImage && !!data?.is_owner ? (
            <img src={NEW_IMAGE_URL(ownerImage)} className=" w-9 h-9 aspect-square rounded-full " />
          ) : (
            <></>
          )}
          <p className=" text-sm ">
            {!!data?.is_owner ? _STRINGS.OWNER : _STRINGS.OWNER_ASSIST} : {data?.assistant_full_name}
          </p>
        </div>
        <p className=" text-sm ">{maskPhoneNumber(data?.assistant_mobile_number)}</p>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <Button
          onClick={() => {
            onActionButtinsClick("tel");
          }}
          containerClass="w-full"
          width="w-full  !px-2 md:!px-3 !py-0.5 "
          title={_STRINGS.CALL}
          roundedClass="rounded-full"
          icon={<img className="w-4 h-4 ml-2 aspect-square" src="/assets/icons/advisor/white_phone.svg" />}
        />
        <Button
          onClick={() => {
            onActionButtinsClick("sms");
          }}
          containerClass="w-full"
          width="w-full  !border !px-2 md:!px-3 !py-0.5"
          variant="outline"
          title={_STRINGS.MESSAGE}
          roundedClass="rounded-full"
          icon={<img className="w-4 h-4 ml-2 aspect-square" src="/assets/icons/advisor/blue_sms.svg" />}
        />
      </div>
    </div>
  );
};

export default PropertyContactInfoItem;
