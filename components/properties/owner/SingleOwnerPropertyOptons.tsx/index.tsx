import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import BadgeRequestModal from "./BadgeRequestModal";

const SingleOwnerPropertyOptons = ({ data }: { data: SingleOwnerPropertyDto }) => {
  const [showBadgeReq, setShowBadgeReq] = useState(false);
  const { data: badgeData } = useQuery({
    queryKey: [PropertyService.OWNER_PROPERTIES_SINGLE_BADGE_CACHEKEY, data?.id],
    queryFn: () => {
      if (data?.id) {
        return PropertyService.GetSingleOwnerPropertyBadgeStatus({ property_id: data?.id });
      } else return null;
    },
  });

  const showBadgeReqFunc = () => {
    setShowBadgeReq(true);
  };
  const hideBadgeReq = () => {
    setShowBadgeReq(false);
  };
  return (
    <div className=" w-full md:mt-[3.75rem] flex order-5   flex-col gap-4 ">
      <Link
        href={`/profile/owner/properties/${data?.id}/subscription`}
        className="w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <p className=" text-sm font-bold ">{_STRINGS.PROP_STATS}</p>

        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </Link>
      <div className="w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border">
        <p className=" text-sm font-bold ">{_STRINGS.CHANGE_ADVISOR_COMMISSION}</p>

        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </div>
      <Link
        href={`/profile/owner/properties/${data?.id}/license`}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          {" "}
          <p className=" text-sm font-bold ">{_STRINGS.AUTHORiZIATION_REQUEST}</p>
        </div>
        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </Link>
      <div
        onClick={showBadgeReqFunc}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          {" "}
          <p className=" text-sm font-bold ">{_STRINGS.REQUEST_FOR_BADGE}</p>
          {badgeData?.status?.id == 100 ? (
            <img className="w-4 h-4 aspect-square" src="/assets/icons/property/request_badge.svg" />
          ) : (
            <></>
          )}
        </div>
        <img className="rotate-90   " src="/assets/icons/shared/chevron.svg" />
      </div>
      <Link
        href={`/profile/owner/properties/${data?.id}/edit/initials`}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          {" "}
          <p className=" text-sm font-bold ">{_STRINGS.EDIT_INFO}</p>
        </div>
        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </Link>
      <BadgeRequestModal badgeData={badgeData} data={data} onHide={hideBadgeReq} show={showBadgeReq} />
    </div>
  );
};

export default SingleOwnerPropertyOptons;
