"use client";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { PropertyAuthorizationStatus } from "@modules/PropertyGrid";
import { useTrackPropertyView } from "@features/properties/hooks/useTrackPropertyView";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";
import { useState } from "react";
import { isMobile } from "react-device-detect";

import SinglePropertyPricePart from "../SinglePropertyPricePart";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import SinglePropReservePop from "./SinglePropReservePop";
import SinglePropSharePop from "./SinglePropSharePop";
import BookMarkButton from "../BookMarkButton";
import AutoFitText from "@/components/shared/AutoFitText";
import FavButton from "../FavButton";
import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const OwnerPart = ({ data }: { data: SinglePropDto }) => (
  <div className="flex flex-row items-center gap-2 ">
    <ContentImage
      src={
        data.owner_info
          ? NEW_IMAGE_URL(data.owner_info.avatar)
          : "/assets/images/add/wall_e_lover.png"
      }
      width={48}
      height={48}
      sizes="(min-width: 768px) 48px, 40px"
      alt={data.owner_info?.full_name || _STRINGS.HOST}
      className="size-10 aspect-square rounded-full md:size-12"
    />
    <div className="flex flex-col items-start gap-1">
      <p className="text-sm font-bold text-brand-600">{_STRINGS.HOST}</p>
      {data.owner_info?.full_name ? (
        <div className="relative w-36">
          <AutoFitText
            maxFontSize={14}
            minFontSize={10}
            className="w-36 text-sm font-medium text-brand-600"
            text={data.owner_info.full_name}
          />
        </div>
      ) : null}
    </div>
  </div>
);

const SinglePropertyIntroduction = ({ data }: { data: SinglePropDto }) => {
  const { isLogin } = useAuthStore((state) => state);
  const [favCount, setFavCount] = useState(data.favorite_count || 0);
  const { userInfo } = useStoreInit((data) => data);
  const { isAdvisor } = useStoreParams((data) => data);
  const [showShare, setShowShare] = useState(false);
  const [showReserve, setShowReserve] = useState(false);
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.origin,
  );

  const showLogin = () => {
    useStoreParams.setState({ loginModal: true });
  };

  useTrackPropertyView(data?.id);

  const onShareClick = () => {
    setShowShare(true);
  };
  const onShareClose = () => {
    setShowShare(false);
  };

  const onReserveClick = () => {
    if (!!isLogin) setShowReserve(true);
    else showLogin();
  };
  return (
    <div className=" flex w-full  flex-col relative  gap-2 md:gap-3">
      <div className="w-full flex items-start md:items-center justify-between gap-2">
        <div className="flex items-center w-3/5 md:w-full gap-2">
          {!!data?.has_blue_tick ? (
            <img
              src="/assets/icons/adds/verified_badge.svg"
              alt="verified_badge"
              className="w-[1.125rem] h-[1.125rem]"
            />
          ) : (
            <></>
          )}
          <h1 className=" font-medium text-base w-full md:text-2xl  ">
            {data?.title}
          </h1>
        </div>
        {!!data?.is_authorized ? (
          <PropertyAuthorizationStatus isAuthorized={data?.is_authorized} />
        ) : (
          <></>
        )}
      </div>
      <div className=" flex items-center w-full justify-between">
        <div className="flex items-center gap-4 md:gap-4">
          <div className="bg-black/10 rounded-md text-xs md:text-sm  px-2 py-1  flex items-center justify-center">
            کد {data.code}
          </div>{" "}
          <ShareLink passedHref={`${origin}/rooms/${data?.code}-s`} />
          <div className="flex items-center gap-1">
            <BookMarkButton data={data} />
          </div>
          <div className="flex items-center gap-1">
            <FavButton setFavCount={setFavCount} data={data} />
            <p className="text-xs  md:text-sm font-light   ">{favCount}</p>
          </div>
        </div>

        <div className="flex  items-center gap-2">
          {!!data?.is_promoted ? (
            <p className="font-bold text-brand-600 shrink-0 text-sm hidden lg:flex ">
              {_STRINGS.LADDERED}
            </p>
          ) : (
            <></>
          )}
          {!!isAdvisor && !!userInfo?.advisor_id ? (
            <Button
              onClick={onShareClick}
              title={_STRINGS.SEND_INFO}
              width=" text-xs !px-4 !py-1.5 "
              variant="flat"
              roundedClass="rounded-md"
              color="themeLight"
              icon={
                <img
                  className=" ml-1"
                  src="/assets/icons/property/share_icon.svg"
                />
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>{" "}
      {/*                          */}
      <div className="flex items-center gap-4  relative   py-0.5 w-full md:justify-between">
        <div className="flex items-center gap-1">
          <p className="w-20 md:text-sm text-xs ">{_STRINGS.TODAYS_PRICE} </p>
        </div>
        <SinglePropertyPricePart data={data} />
      </div>
      <div className="flex items-center gap-4   py-0.5 w-full md:justify-between">
        <p className="w-20 md:text-sm text-xs ">{_STRINGS.ROOM_COUNTS} :</p>
        <p className="font-bold text-sm md:text-base text-brand-600">
          {data?.total_bedrooms} {_STRINGS.ROOM}
        </p>
      </div>{" "}
      {/*                          */}
      <div className="flex items-center gap-4   py-0.5 w-full md:justify-between">
        <p className="w-20 md:text-sm text-xs ">{_STRINGS.ROOM_SIZE} :</p>
        <p className="font-bold text-sm md:text-base text-brand-600">
          {data?.building_area} {_STRINGS.METER}
        </p>
      </div>
      <div className="flex items-center gap-2   py-0.5 w-full lg:justify-between">
        {data?.is_promoted && !!isMobile ? (
          <p className="  font-bold  text-brand-600  shrink-0  text-xs lg:hidden  pl-1 border-l">
            {_STRINGS.LADDERED}
          </p>
        ) : (
          <></>
        )}
        <p className=" hidden lg:flex">{_STRINGS.PROPERTY_LOC} :</p>
        <p className=" text-xs lg:text-sm">
          {data?.city}{" "}
          <span className=" font-light">
            ({data?.region || data?.province})
          </span>
        </p>
      </div>
      <div className="w-full bg-brand-600/20  rounded-full p-2  hidden md:flex  items-center justify-between gap-4 ">
        <OwnerPart data={data} />
        <Button
          onClick={onReserveClick}
          title={_STRINGS.RESERVE}
          roundedClass="rounded-full"
          width="w-full  !px-8 md:!py-2.5  lg:!py-2 lg:!text-lg"
          containerClass="w-1/4 flex items-center  justify-end"
        />
      </div>
      <div className="z-20 flex md:hidden">
        <FixedBottomContainer>
          {" "}
          <div className="w-full flex  px-4">
            <div className="w-full  bg-brand-600/20  rounded-full p-2   flex items-center justify-between gap-4 ">
              <OwnerPart data={data} />
              <Button
                onClick={onReserveClick}
                title={_STRINGS.RESERVE}
                roundedClass="rounded-full"
                width="w-full !text-xl !py-1.5"
                containerClass="w-1/3   flex items-center  justify-end"
              />
            </div>
          </div>
        </FixedBottomContainer>
      </div>
      <div className="absolute">
        <SinglePropSharePop
          data={data}
          show={!!showShare}
          onHide={onShareClose}
        />
        <SinglePropReservePop
          data={data}
          show={!!showReserve}
          setShow={setShowReserve}
        />
      </div>
    </div>
  );
};

export default SinglePropertyIntroduction;
