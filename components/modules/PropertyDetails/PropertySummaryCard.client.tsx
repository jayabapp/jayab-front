"use client";

import type { PropertySummaryCardProps } from "@/types/components/modules/property-details";
import type { BookingRenderActions } from "@/types/components/modules/property-booking";
import { useTrackPropertyView } from "@features/properties/hooks/useTrackPropertyView";
import { BookingContinue, BookingPanel } from "@modules/PropertyBooking";
import { PropertyShareModal } from "@modules/PropertyContact";
import { BookingBottomBar } from "@modules/PropertyBooking";
import { useStoreInit, useStoreParams } from "@/store";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const PropertySummaryCard = ({ property }: PropertySummaryCardProps) => {
  const { userInfo } = useStoreInit((state) => state);
  const { isAdvisor } = useStoreParams((state) => state);
  const [showShare, setShowShare] = useState(false);

  useTrackPropertyView(property?.id);

  const renderActions: BookingRenderActions = (context) => (
    <BookingContinue context={context} property={property} />
  );

  return (
    <>
      <div className="hidden w-full flex-col gap-3 md:sticky md:top-36 md:flex">
        <BookingPanel
          variant="card"
          property={property}
          renderActions={renderActions}
        />

        {isAdvisor && userInfo?.advisor_id ? (
          <Button
            variant="flat"
            color="themeLight"
            width="w-full !py-2"
            containerClass="w-full"
            title={_STRINGS.SEND_INFO}
            roundedClass="rounded-full"
            onClick={() => setShowShare(true)}
          />
        ) : (
          <></>
        )}
      </div>

      <BookingBottomBar property={property} renderActions={renderActions} />

      <PropertyShareModal
        show={showShare}
        property={property}
        onHide={() => setShowShare(false)}
      />
    </>
  );
};

export default PropertySummaryCard;
