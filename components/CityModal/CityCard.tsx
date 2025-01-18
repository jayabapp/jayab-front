import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import React from "react";
import Checkbox from "../shared/Form/Checkbox";

const CityCard = ({
  item,
  callback,
  isChecked,
}: {
  item: ProvienceTypesDto;
  callback: () => void | null;
  isChecked: boolean;
}) => {
  return (
    <div onClick={callback} className="flex border-b cursor-pointer flex-row items-center justify-between gap-2 ">
      <div className="w-full flex flex-row justify-start gap-2 items-center">
        {/* <div className=" relative   w-10 h-10 aspect-square rounded-md ">
          {" "}
          <Image
            fill
            src={!!item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/logo/mobile_header_logo.svg"}
            alt={item?.title}
          />
        </div> */}
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="text-sm md:text-base  font-medium">{item?.title}</p>
        </div>
      </div>

      <Checkbox onSelect={callback} isChecked={isChecked} />
    </div>
  );
};

export default CityCard;
