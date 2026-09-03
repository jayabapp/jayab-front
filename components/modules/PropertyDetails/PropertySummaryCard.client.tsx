"use client";

import type { PropertySummaryCardProps } from "@/types/components/modules/property-details";
import { useTrackPropertyView } from "@features/properties/hooks/useTrackPropertyView";
import { PropertyReserveModal, PropertyShareModal } from "@modules/PropertyContact";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { PropertyAuthorizationStatus } from "@modules/PropertyGrid";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import PropertyBookmarkButton from "./parts/PropertyBookmarkButton.client";
import PropertyLikeButton from "./parts/PropertyLikeButton.client";
import FixedBottomContainer from "@elements/FixedBottomContainer";
import PropertyOwnerBadge from "./parts/PropertyOwnerBadge";
import ShareLink from "@elements/Share/BrowserShare.client";
import PropertyPriceTag from "./PropertyPriceTag";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const FACT_CLASS =
  "flex flex-1 flex-col items-center gap-0.5 rounded-10 bg-brand-50 px-1 py-2 text-center";

/**
 * Everything a guest needs to decide, in one card pinned level with the photos.
 *
 * This used to be two blocks stacked under the gallery — an "introduction" with
 * the title and facts, and a reserve bar below it — so by the time the reader
 * reached the calendar or the spec sheet, both the price and the only call to
 * action had scrolled away. Keeping them beside the photos is what every
 * listing site does, and it is the whole point of the sticky column.
 *
 * On a phone it is the same card rendered inline under the gallery, with the
 * reserve action repeated in the existing fixed bottom bar: a sticky panel
 * would eat a third of a small viewport.
 */
const PropertySummaryCard = ({ property }: PropertySummaryCardProps) => {
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

  return (
    <>
      <div className="surface-panel flex w-full flex-col gap-3 p-4 md:sticky md:top-24">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            {property?.hasBlueTick ? (
              <ContentImage
                width={18}
                height={18}
                alt="verified_badge"
                className="mt-1 h-[1.125rem] w-[1.125rem] shrink-0"
                src="/assets/icons/adds/verified_badge.svg"
              />
            ) : null}
            <h1 className="text-base font-bold leading-7 md:text-lg">
              {property?.title}
            </h1>
          </div>
          {property?.isPromoted ? (
            <p className="shrink-0 rounded-full bg-brand-50 px-2 py-1 text-xxs font-bold text-brand-600">
              {_STRINGS.LADDERED}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-neutral-600">
            {property?.city}
            {property?.region || property?.province
              ? ` (${property?.region || property?.province})`
              : ""}
          </p>
          {property?.isAuthorized ? (
            <PropertyAuthorizationStatus
              isAuthorized={property?.isAuthorized}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-4 border-y border-neutral-100 py-2.5">
          <div className="flex items-center justify-center rounded-md bg-black/10 px-2 py-1 text-xs">
            {_STRINGS.CODE} {property?.code}
          </div>
          <ShareLink passedHref={`${origin}/rooms/${property?.code}-s`} />
          <PropertyBookmarkButton propertyId={property?.id} />
          <div className="flex items-center gap-1">
            <PropertyLikeButton
              propertyId={property?.id}
              onCountChange={(delta) =>
                setFavCount((count) => Math.max(0, count + delta))
              }
            />
            <p className="text-xs font-light">{favCount}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-600">{_STRINGS.TODAYS_PRICE}</p>
          <div className="flex flex-wrap items-end gap-1.5">
            <PropertyPriceTag price={property?.todayPrice} />
            <span className="pb-0.5 text-xs text-neutral-600">
              / {_STRINGS.NIGHT}
            </span>
          </div>
        </div>

        {/* The three numbers a guest checks first. Chips rather than the
            label:value rows this page used, where the nightly price carried no
            more visual weight than the floor number. */}
        <div className="flex items-stretch gap-2">
          <div className={FACT_CLASS}>
            <span className="text-sm font-bold">{property?.maxCapacity}</span>
            <span className="text-xxs text-neutral-600">{_STRINGS.PERSON}</span>
          </div>
          <div className={FACT_CLASS}>
            <span className="text-sm font-bold">{property?.totalBedrooms}</span>
            <span className="text-xxs text-neutral-600">{_STRINGS.ROOM}</span>
          </div>
          <div className={FACT_CLASS}>
            <span className="text-sm font-bold">{property?.buildingArea}</span>
            <span className="text-xxs text-neutral-600">{_STRINGS.METER}</span>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-3">
          <PropertyOwnerBadge
            avatar={property?.ownerAvatar}
            name={property?.ownerName}
          />
        </div>

        <Button
          onClick={onReserveClick}
          title={_STRINGS.RESERVE}
          roundedClass="rounded-full"
          width="w-full !py-2.5 !text-base"
          containerClass="w-full"
        />

        {isAdvisor && userInfo?.advisor_id ? (
          <Button
            variant="flat"
            color="themeLight"
            width="w-full !py-2"
            roundedClass="rounded-full"
            title={_STRINGS.SEND_INFO}
            containerClass="w-full"
            onClick={() => setShowShare(true)}
          />
        ) : null}
      </div>

      <div className="z-20 flex md:hidden">
        <FixedBottomContainer>
          <div className="flex w-full px-4">
            <div className="flex w-full items-center justify-between gap-4 rounded-full bg-brand-600/20 p-2">
              <PropertyOwnerBadge
                avatar={property?.ownerAvatar}
                name={property?.ownerName}
              />
              <Button
                onClick={onReserveClick}
                title={_STRINGS.RESERVE}
                roundedClass="rounded-full"
                width="w-full !px-8"
                containerClass="w-1/3 flex items-center justify-end"
              />
            </div>
          </div>
        </FixedBottomContainer>
      </div>

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
    </>
  );
};

export default PropertySummaryCard;
