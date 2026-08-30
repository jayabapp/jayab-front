"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SinglePropertyPricePart from "../../SinglePropertyPricePart";
import VerifyPropertyModal from "../../VerifyPropertyModal";
import { PropertyAuthorizationStatus } from "@modules/PropertyGrid";
import StatusShower from "@/components/shared/StatusShower";
import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const SingleOwnerPropertyIntroduction = ({
  data,
}: {
  data: SingleOwnerPropertyDto;
}) => {
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
    if (!data?.is_authorized && !alreadyShownModal.includes(data?.id))
      setShowVerify(true);
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
        <p className=" font-medium text-lg w-3/5 md:w-full md:text-2xl ">
          {data?.title}
        </p>
        <PropertyAuthorizationStatus isAuthorized={data?.is_authorized} data={data} />
      </div>
      <div className=" w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black/10 rounded-md text-base  px-2 py-1  flex items-center justify-center">
            کد {data.code}
          </div>
          <ShareLink
            passedHref={
              process.env.NEXT_PUBLIC_WEBSITE_URL + `/rooms/${data?.code}`
            }
          />
        </div>

        {!!data?.is_promoted ? (
          <p className="  font-bold  text-brand-600  shrink-0  text-xs ">
            {_STRINGS.LADDERED}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="flex items-start gap-4     w-full ">
        <div className="flex   text-sm items-center gap-1">
          <p>{_STRINGS.TODAYS_PRICE} </p>
        </div>
        <SinglePropertyPricePart data={data} />
      </div>
      <div className="w-full flex  flex-row  items-center gap-2 justify-start">
        {" "}
        <p className="text-sm  shrink-0 ">{_STRINGS.TODAY_STATUS} :</p>
        <p
          className={` text-sm font-bold ${!!data?.is_today_reserved ? " text-red-500 " : " text-brand-600 "} `}
        >
          {!!data?.is_today_reserved ? _STRINGS.OCCUPIED : _STRINGS.EMPTY}{" "}
        </p>
      </div>
      <div className="flex w-full gap-1">
        <img
          src="/assets/icons/adds/pin_point_location.svg"
          className="w-5 h-5 aspect-square"
        />
        <p className="text-xs mt-1">
          {data?.province} - {data?.city}{" "}
          {data?.region ? ` - ${data?.region}` : ""}
        </p>
      </div>
      <div className="w-full flex  py-2  border-neutral-200 items-center justify-between ">
        <p className="text-xs">{_STRINGS.SUB_STATUS} :</p>

        <div className=" flex items-center  gap-2">
          <div className=" rounded-full text-sm text-brand-600 bg-brand-200 flex  items-center justify-center h-7 w-24 ">
            {data?.remaining_days
              ? `${data?.remaining_days} روز اعتبار`
              : `اعتبار ندارد`}
          </div>
          <Link
            prefetch={false}
            href={`/profile/owner/properties/${data?.id}/subscription`}
            className=" rounded-full text-xs text-white bg-brand-600 flex  items-center justify-center h-7 w-24 "
            title={_STRINGS.EXTEND_SUBS}
          >
            {_STRINGS.EXTEND_SUBS}
          </Link>
        </div>
      </div>
      <StatusShower data={data?.status} />
      <VerifyPropertyModal
        show={showVerify}
        onHIde={onHideVVerify}
        callBack={verifyCallBack}
      />
    </div>
  );
};

export default SingleOwnerPropertyIntroduction;
