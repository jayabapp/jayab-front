import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import BadgeRequestModal from "./BadgeRequestModal";
import ChangePropertyAllDaysCommissionModal from "./ChangePropertyAllDaysCommissionModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { useRouter } from "next/navigation";

const SingleOwnerPropertyOptons = ({ data }: { data: SingleOwnerPropertyDto }) => {
  const router = useRouter();

  const [showBadgeReq, setShowBadgeReq] = useState(false);
  const [showCommiss, setShowCommiss] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { data: badgeData } = useQuery({
    queryKey: [PropertyService.OWNER_PROPERTIES_SINGLE_BADGE_CACHEKEY, data?.id],
    queryFn: () => {
      if (data?.id) {
        return PropertyService.GetSingleOwnerPropertyBadgeStatus({ property_id: data?.id });
      } else return null;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.deleteProperty,
    onSuccess: () => {
      router.replace("/profile/owner/properties");
    },
  });

  const onDeleteConfirm = () => {
    mutate({
      propertyId: data?.id,
    });
  };

  const showBadgeReqFunc = () => {
    setShowBadgeReq(true);
  };
  const hideBadgeReq = () => {
    setShowBadgeReq(false);
  };
  const showCommissFunc = () => {
    setShowCommiss(true);
  };
  const hideCommiss = () => {
    setShowCommiss(false);
  };
  const showDeleteFunc = () => {
    setShowDelete(true);
  };
  const hideDelete = () => {
    setShowCommiss(false);
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
      <div
        onClick={showCommissFunc}
        className="w-full cursor-pointer border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
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
        href={`/profile/owner/properties/${data?.id}/edit`}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          {" "}
          <p className=" text-sm font-bold ">{_STRINGS.EDIT_INFO}</p>
        </div>
        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </Link>
      <Link
        href={`/profile/owner/properties/${data?.id}/inquery`}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          <img className=" w-6 h-6 aspect-square " src="/assets/icons/property/police_speaker.svg" />
          <p className=" text-primary-700 text-sm font-bold ">{_STRINGS.WEEKLY_INQUERY}</p>
        </div>
        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </Link>
      <div
        onClick={showDeleteFunc}
        className=" cursor-pointer  w-full border-primary-150/50  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          <p className=" text-primary-150  text-sm font-bold ">{_STRINGS.WEEKLY_INQUERY}</p>
        </div>
        <img className=" w-5 h-5 aspect-square " src="/assets/icons/uploader/red_trash_icon.svg" />
      </div>

      <ChangePropertyAllDaysCommissionModal data={data} onHide={hideCommiss} show={showCommiss} />
      <BadgeRequestModal badgeData={badgeData} data={data} onHide={hideBadgeReq} show={showBadgeReq} />

      <ConfirmModal
        isVisible={!!showDelete}
        isLoading={isPending}
        onConfirm={onDeleteConfirm}
        onHide={hideDelete}
        text={_STRINGS.ARE_U_SURE_DELETE_PROPERTY}
        title={_STRINGS.ARE_U_SURE_DELETE_PROPERTY_TITLE}
      />
    </div>
  );
};

export default SingleOwnerPropertyOptons;
