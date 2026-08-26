import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { useDeleteOwnerProperty } from "@features/owner-property/hooks/useDeleteOwnerProperty";
import { usePropertyBadge } from "@features/owner-property/hooks/usePropertyBadge";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ChangePropertyAllDaysCommissionModal from "./ChangePropertyAllDaysCommissionModal";
import BadgeRequestModal from "./BadgeRequestModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const SingleOwnerPropertyOptons = ({
  data,
  setRefresh,
}: {
  data: SingleOwnerPropertyDto;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const [showBadgeReq, setShowBadgeReq] = useState(false);
  const [showCommiss, setShowCommiss] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { data: badgeData } = usePropertyBadge(data?.id ?? "");

  const { mutate, isPending } = useDeleteOwnerProperty();

  const onDeleteConfirm = () => {
    mutate(
      { propertyId: data?.id },
      { onSuccess: () => router.replace("/profile/owner/properties") },
    );
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
    setShowDelete(false);
  };
  return (
    <div className=" w-full  flex order-5   flex-col gap-4 ">
      <Link
        title={_STRINGS.PROP_STATS}
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
        <p className=" text-sm font-bold ">
          {_STRINGS.CHANGE_ADVISOR_COMMISSION}
        </p>

        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </div>
      <Link
        title={_STRINGS.AUTHORiZIATION_REQUEST}
        href={`/profile/owner/properties/${data?.id}/license`}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          {" "}
          <p className=" text-sm font-bold ">
            {_STRINGS.AUTHORiZIATION_REQUEST}
          </p>
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
            <img
              className="w-4 h-4 aspect-square"
              src="/assets/icons/property/request_badge.svg"
            />
          ) : (
            <></>
          )}
        </div>
        <img className="rotate-90   " src="/assets/icons/shared/chevron.svg" />
      </div>
      <Link
        title={_STRINGS.EDIT_INFO}
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
        title={_STRINGS.WEEKLY_INQUERY}
        href={`/profile/owner/properties/${data?.id}/inquery`}
        className=" cursor-pointer  w-full border-primary-200  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          <img
            className=" w-6 h-6 aspect-square "
            src="/assets/icons/property/police_speaker.svg"
          />
          <p className=" text-primary-700 text-sm font-bold ">
            {_STRINGS.WEEKLY_INQUERY}
          </p>
        </div>
        <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
      </Link>
      <div
        onClick={showDeleteFunc}
        className=" cursor-pointer  w-full border-primary-150/50  flex items-center justify-between  px-4 py-3 rounded-10 border"
      >
        <div className="flex items-center gap-2">
          <p className=" text-primary-150  text-sm font-bold ">
            {_STRINGS.ARE_U_SURE_DELETE_PROPERTY_TITLE}
          </p>
        </div>
        <img
          className=" w-5 h-5 aspect-square "
          src="/assets/icons/uploader/red_trash_icon.svg"
        />
      </div>

      <ChangePropertyAllDaysCommissionModal
        data={data}
        onHide={hideCommiss}
        show={showCommiss}
      />
      <BadgeRequestModal
        data={data}
        show={showBadgeReq}
        badgeData={badgeData}
        onHide={hideBadgeReq}
        setRefresh={setRefresh}
      />

      <ConfirmModal
        onHide={hideDelete}
        isLoading={isPending}
        isVisible={!!showDelete}
        onConfirm={onDeleteConfirm}
        messageClass=" !text-black !text-base"
        text={_STRINGS.ARE_U_SURE_DELETE_PROPERTY}
        hideTextClassName=" border !bg-white !rounded-full "
        headerImage={"/assets/images/shared/red_crossed_sheet.png"}
        confirmTextClassName=" !bg-primary-900 text-white !rounded-full "
      />
    </div>
  );
};

export default SingleOwnerPropertyOptons;
