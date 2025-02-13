"use client";
import _STRINGS from "@/utils/LocalStrings";
import React, { useEffect, useState } from "react";
import Button from "@/components/shared/Button/Button";
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import SinglePropertyPricePart from "../../SinglePropertyPricePart";
import AuthorizationStatus from "../../AuthorizationStatus";
import StatusShower from "@/components/shared/StatusShower";
import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import VerifyPropertyModal from "../../VerifyPropertyModal";
import { useRouter } from "next/navigation";

const SingleOwnerPropertyIntroduction = ({ data }: { data: SingleOwnerPropertyDto }) => {
  const router = useRouter();
  const [showVerify, setShowVerify] = useState(false);
  const [propShownList, setPropShownList] = useState([]);
  const pusher = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    const alreadyShownModal = localStorage?.getItem("VERIFY_MODAL_LIST")
      ? JSON.parse(localStorage?.getItem("VERIFY_MODAL_LIST") || "[]")
      : [];
    setPropShownList(alreadyShownModal);
    if (!data?.is_authorized && !alreadyShownModal.includes(data?.id)) {
      setShowVerify(true);
    }
  }, [data]);

  const onHideVVerify = () => {
    const newArray = [...propShownList, data?.id];

    localStorage.setItem("VERIFY_MODAL_LIST", JSON.stringify(newArray));
    setShowVerify(false);
  };

  const verifyCallBack = () => {
    const newArray = [...propShownList, data?.id];
    newArray?.shift();

    localStorage.setItem("VERIFY_MODAL_LIST", JSON.stringify(newArray));
    pusher(`/profile/owner/properties/${data?.id}/license`);
  };

  return (
    <div className=" flex w-full  flex-col relative  gap-2">
      <div className="w-full flex items-start md:items-center justify-between gap-2">
        {" "}
        <p className=" font-medium text-lg w-3/5 md:w-full md:text-2xl ">{data?.title}</p>
        <AuthorizationStatus isAuthorized={data?.is_authorized} />
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-black/10 rounded-md text-base  px-2 py-1  flex items-center justify-center">
          کد {data.code}
        </div>{" "}
        {/* <div className="flex items-center gap-1">
          <img className="w-5 h-5 aspect-square" src="/assets/icons/adds/filled_heart.svg" />
          <p className="text-base  opacity-60">{data?.favorites_count || 0}</p>
        </div> */}
        <ShareLink passedHref={window.origin + `/rooms/${data?.slug}`} />
      </div>

      <div className="flex items-start gap-4    py-2 w-full ">
        <div className="flex  items-center gap-1">
          <p>{_STRINGS.TODAYS_PRICE} </p>
        </div>
        <SinglePropertyPricePart data={data} />
      </div>
      <div className="w-full flex  flex-row  items-center gap-2 justify-start">
        {" "}
        <p className="text-sm  shrink-0 ">{_STRINGS.TODAY_STATUS} :</p>
        <p className={` text-sm font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-primary-700 "} `}>
          {!!data?.is_today_reserved ? _STRINGS.OCCUPIED : _STRINGS.EMPTY}{" "}
        </p>
      </div>
      <div className="flex w-full gap-1">
        <img src="/assets/icons/adds/pin_point_location.svg" className="w-5 h-5 aspect-square" />
        <p className="text-xs">
          {data?.city} <span className=" font-light  text-xs">({data?.province})</span>
        </p>
      </div>
      <div className="w-full flex  py-2  border-primary-200 items-center justify-between ">
        <p className="text-xs">{_STRINGS.SUB_STATUS} :</p>

        <div className=" flex items-center  gap-2">
          <div className=" rounded-full text-sm text-primary-700 bg-primary-400 flex  items-center justify-center h-7 w-24 ">
            {data?.remaining_days ? `${data?.remaining_days} روز اعتبار` : `اعتبار ندارد`}
          </div>
          <div className=" rounded-full text-xs text-white bg-primary-700 flex  items-center justify-center h-7 w-24 ">
            {_STRINGS.EXTEND_SUBS}
          </div>
        </div>
      </div>
      <StatusShower data={data?.status} />
      <VerifyPropertyModal callBack={verifyCallBack} show={showVerify} onHIde={onHideVVerify} />
    </div>
  );
};

export default SingleOwnerPropertyIntroduction;
