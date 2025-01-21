import { PropertyContactIInfDto } from "@/api_services/property/property.interface";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";

const PropertyContactInfoItem = ({ data }: { data: PropertyContactIInfDto }) => {
  const onActionButtinsClick = (type: "tel" | "sms") => {
    window.open(`${type}:${data?.assistant_mobile_number}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full flex flex-row items-center justify-between  ">
      <div className="flex flex-col gap-2 ">
        <p className=" text-sm ">
          {!!data?.is_owner ? _STRINGS.OWNER : _STRINGS.OWNER_ASSIST} : {data?.assistant_full_name}
        </p>
        <p className=" text-sm ">{data?.assistant_mobile_number}</p>
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
          width="w-full !px-2 md:!px-3 !py-0.5"
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
