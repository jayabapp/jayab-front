import { PropertyListDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import AuthorizationStatus from "./AuthorizationStatus";
import { Divider } from "../shared/Divider";
import Button from "../shared/Button/Button";
import Link from "next/link";

const PropertyCardOwnerPart = ({ data, goToLink }: { goToLink: string; data: PropertyListDto }) => {
  return (
    <div className="w-full flex flex-col ">
      <Divider moreClass="my-1" />
      <div className="w-full flex  py-2  border-primary-200 items-center justify-between ">
        <p className="text-xs">{_STRINGS.ADD_DURATION} :</p>

        <div className=" flex items-center  gap-2">
          <div className=" rounded-full text-xxs text-primary-700 bg-primary-400 flex  items-center justify-center h-5 w-20 ">
            {data?.remaining_days || 0} روز اعتبار
          </div>
          <div className=" rounded-full text-xxs text-white bg-primary-700 flex  items-center justify-center h-5 w-20 ">
            {_STRINGS.EXTEND_SUBS}
          </div>
        </div>
      </div>
      <Divider moreClass="my-1" />
      <div className="w-full flex  py-2  border-primary-200 items-center justify-between ">
        <p className="text-xs">{_STRINGS.UPGRADE_ADD_DESC} </p>

        <div className=" flex items-center  gap-2">
          <img src="/assets/icons/shared/chevron-left.svg" />
        </div>
      </div>
      <Divider moreClass="my-1" />
      <div className="w-full flex  py-2  border-primary-200 items-center justify-between ">
        <div className="flex w-full gap-1">
          <img src="/assets/icons/adds/pin_point_location.svg" className="w-5 h-5 aspect-square" />
          <p className="text-xs">
            {data?.city} <span className=" font-light  text-xs">({data?.province})</span>
          </p>
        </div>
        <Divider moreClass="my-1" />
        <AuthorizationStatus isAuthorized={data?.is_authorized} />
      </div>

      <Link href={goToLink} className="w-full" prefetch={false}>
        {" "}
        <Button
          title={_STRINGS.PROP_CARD_C_DETAILS}
          roundedClass="rounded-full"
          containerClass="w-full relative mt-2"
          width="w-full"
          icon={
            <img
              className="w-5 h-5 absolute left-4  top-0 bottom-0 my-auto"
              src="/assets/icons/property/white_arrow_left.svg"
            />
          }
        />
      </Link>
    </div>
  );
};

export default PropertyCardOwnerPart;
