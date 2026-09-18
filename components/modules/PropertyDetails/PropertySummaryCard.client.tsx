"use client";

import type { PropertySummaryCardProps } from "@/types/components/modules/property-details";
import { useTrackPropertyView } from "@features/properties/hooks/useTrackPropertyView";
import {
  PropertyReserveModal,
  PropertyShareModal,
} from "@modules/PropertyContact";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { useState } from "react";

import FixedBottomContainer from "@elements/FixedBottomContainer";
import PropertyOwnerBadge from "./parts/PropertyOwnerBadge";
import PropertyPriceTag from "./PropertyPriceTag";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const FACT_CLASS =
  "flex flex-1 flex-col items-center gap-0.5 rounded-10 bg-brand-50 px-1 py-2 text-center";

const PropertySummaryCard = ({ property }: PropertySummaryCardProps) => {
  const { isLogin } = useAuthStore((state) => state);
  const { userInfo } = useStoreInit((state) => state);
  const { isAdvisor } = useStoreParams((state) => state);
  const [showShare, setShowShare] = useState(false);
  const [showReserve, setShowReserve] = useState(false);

  useTrackPropertyView(property?.id);

  const onReserveClick = () => {
    if (isLogin) setShowReserve(true);
    else useStoreParams.setState({ loginModal: true });
  };

  return (
    <>
      <div className="surface-panel hidden w-full flex-col gap-3 p-4 md:sticky md:top-32 md:flex">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-neutral-600">{_STRINGS.TODAYS_PRICE}</p>
          <div className="flex flex-wrap items-end gap-1.5">
            <PropertyPriceTag price={property?.todayPrice} />
            <span className="pb-0.5 text-xs text-neutral-600">
              / {_STRINGS.NIGHT}
            </span>
          </div>
        </div>

        {/* The three numbers a guest checks first. */}
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

        <div className="hidden md:block">
          <Button
            onClick={onReserveClick}
            title={_STRINGS.RESERVE}
            roundedClass="rounded-full"
            width="w-full !py-2.5 !text-base"
            containerClass="w-full"
          />
        </div>

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
        ) : (
          <></>
        )}
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
