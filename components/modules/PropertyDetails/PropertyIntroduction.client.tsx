"use client";

import type { PropertyIntroductionProps } from "@/types/components/modules/property-details";
import { useTrackPropertyView } from "@features/properties/hooks/useTrackPropertyView";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { PropertyAuthorizationStatus } from "@modules/PropertyGrid";
import { PropertyReserveModal } from "@modules/PropertyContact";
import { PropertyShareModal } from "@modules/PropertyContact";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import PropertyBookmarkButton from "./parts/PropertyBookmarkButton.client";
import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import PropertyLikeButton from "./parts/PropertyLikeButton.client";
import PropertyOwnerBadge from "./parts/PropertyOwnerBadge";
import PropertyPriceTag from "./PropertyPriceTag";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const PropertyIntroduction = ({ property }: PropertyIntroductionProps) => {
  const { isLogin } = useAuthStore((state) => state);
  const { userInfo } = useStoreInit((state) => state);
  const { isAdvisor } = useStoreParams((state) => state);
  const [favCount, setFavCount] = useState(property?.favoriteCount || 0);
  const [showShare, setShowShare] = useState(false);
  const [showReserve, setShowReserve] = useState(false);
  const [origin] = useState(() =>
    typeof window === "undefined" ? "" : window.location.origin,
  );

  useTrackPropertyView(property?.id);

  const onReserveClick = () => {
    if (isLogin) setShowReserve(true);
    else useStoreParams.setState({ loginModal: true });
  };

  const reserveBar = (
    <>
      <PropertyOwnerBadge
        avatar={property?.ownerAvatar}
        name={property?.ownerName}
      />
      <Button
        onClick={onReserveClick}
        title={_STRINGS.RESERVE}
        roundedClass="rounded-full"
        width="w-full !px-8 md:!py-2.5 lg:!py-2 lg:!text-lg"
        containerClass="w-1/4 flex items-center justify-end"
      />
    </>
  );

  return (
    <div className="flex w-full flex-col relative gap-2 md:gap-3">
      <div className="w-full flex items-start md:items-center justify-between gap-2">
        <div className="flex items-center w-3/5 md:w-full gap-2">
          {property?.hasBlueTick ? (
            <ContentImage
              width={18}
              height={18}
              alt="verified_badge"
              className="w-[1.125rem] h-[1.125rem]"
              src="/assets/icons/adds/verified_badge.svg"
            />
          ) : null}
          <h1 className="font-medium text-base w-full md:text-2xl">
            {property?.title}
          </h1>
        </div>
        {property?.isAuthorized ? (
          <PropertyAuthorizationStatus isAuthorized={property?.isAuthorized} />
        ) : null}
      </div>

      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-4 md:gap-4">
          <div className="bg-black/10 rounded-md text-xs md:text-sm px-2 py-1 flex items-center justify-center">
            {_STRINGS.CODE} {property?.code}
          </div>
          <ShareLink passedHref={`${origin}/rooms/${property?.code}-s`} />
          <div className="flex items-center gap-1">
            <PropertyBookmarkButton propertyId={property?.id} />
          </div>
          <div className="flex items-center gap-1">
            <PropertyLikeButton
              propertyId={property?.id}
              onCountChange={(delta) =>
                setFavCount((count) => Math.max(0, count + delta))
              }
            />
            <p className="text-xs md:text-sm font-light">{favCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {property?.isPromoted ? (
            <p className="font-bold text-brand-600 shrink-0 text-sm hidden lg:flex">
              {_STRINGS.LADDERED}
            </p>
          ) : null}
          {isAdvisor && userInfo?.advisor_id ? (
            <Button
              variant="flat"
              color="themeLight"
              roundedClass="rounded-md"
              title={_STRINGS.SEND_INFO}
              width=" text-xs !px-4 !py-1.5 "
              onClick={() => setShowShare(true)}
              icon={
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  className="ml-1"
                  src="/assets/icons/property/share_icon.svg"
                />
              }
            />
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-4 relative py-0.5 w-full md:justify-between">
        <div className="flex items-center gap-1">
          <p className="w-20 md:text-sm text-xs">{_STRINGS.TODAYS_PRICE}</p>
        </div>
        <PropertyPriceTag price={property?.todayPrice} />
      </div>

      <div className="flex items-center gap-4 py-0.5 w-full md:justify-between">
        <p className="w-20 md:text-sm text-xs">{_STRINGS.ROOM_COUNTS} :</p>
        <p className="font-bold text-sm md:text-base text-brand-600">
          {property?.totalBedrooms} {_STRINGS.ROOM}
        </p>
      </div>

      <div className="flex items-center gap-4 py-0.5 w-full md:justify-between">
        <p className="w-20 md:text-sm text-xs">{_STRINGS.ROOM_SIZE} :</p>
        <p className="font-bold text-sm md:text-base text-brand-600">
          {property?.buildingArea} {_STRINGS.METER}
        </p>
      </div>

      <div className="flex items-center gap-2 py-0.5 w-full lg:justify-between">
        {property?.isPromoted ? (
          <p className="font-bold text-brand-600 shrink-0 text-xs lg:hidden pl-1 border-l">
            {_STRINGS.LADDERED}
          </p>
        ) : null}
        <p className="hidden lg:flex">{_STRINGS.PROPERTY_LOC} :</p>
        <p className="text-xs lg:text-sm">
          {property?.city}{" "}
          <span className="font-light">
            ({property?.region || property?.province})
          </span>
        </p>
      </div>

      <div className="w-full bg-brand-600/20 rounded-full p-2 hidden md:flex items-center justify-between gap-4">
        {reserveBar}
      </div>

      <div className="z-20 flex md:hidden">
        <FixedBottomContainer>
          <div className="w-full flex px-4">
            <div className="w-full bg-brand-600/20 rounded-full p-2 flex items-center justify-between gap-4">
              {reserveBar}
            </div>
          </div>
        </FixedBottomContainer>
      </div>

      <div className="absolute">
        <PropertyShareModal
          show={showShare}
          property={property}
          onHide={() => setShowShare(false)}
        />
        <PropertyReserveModal
          show={showReserve}
          property={property}
          setShow={setShowReserve}
        />
      </div>
    </div>
  );
};

export default PropertyIntroduction;
