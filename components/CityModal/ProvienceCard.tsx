import { NewCitiesListDto } from "@/api_services/city/city.interface";
import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import React from "react";

const ProvienceCard = ({ item, callback }: { item: NewCitiesListDto; callback: () => void | null }) => {
  return (
    <div onClick={callback} className="flex cursor-pointer flex-row items-center justify-start gap-2 ">
      <div className=" relative   w-10 h-10 aspect-square rounded-md ">
        <Image
          fill
          src={!!item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/logo/mobile_header_logo.svg"}
          alt={item?.title}
        />
      </div>
      <div className="flex flex-col gap-2 items-start justify-start">
        <p className="text-sm md:text-base  font-medium">{item?.title}</p>

        <div className="flex  opacity-75 flex-wrap gap-1">
          {item?.child?.map((e, index) => (
            <p className="  text-xs">
              {index == 0 ? "" : "-"} {e?.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProvienceCard;
