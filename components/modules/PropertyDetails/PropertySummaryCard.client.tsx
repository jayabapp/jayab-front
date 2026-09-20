"use client";

import { BookingBottomBar, BookingPanel } from "@modules/PropertyBooking";
import { useStoreInit, useStoreParams } from "@/store";
import { useTrackPropertyView } from "@features/properties/hooks/useTrackPropertyView";
import { PropertyShareModal } from "@modules/PropertyContact";
import { trackListingEvent } from "@/helpers/listingAnalytics";
import { ContactActions } from "@modules/PropertyContact";
import { useEffect } from "react";
import { useState } from "react";

import type { PropertySummaryCardProps } from "@/types/components/modules/property-details";
import type { BookingRenderActions } from "@/types/components/modules/property-booking";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const PropertySummaryCard = ({ property }: PropertySummaryCardProps) => {
  const { userInfo } = useStoreInit((state) => state);
  const { isAdvisor } = useStoreParams((state) => state);
  const [showShare, setShowShare] = useState(false);

  useTrackPropertyView(property?.id);

  useEffect(() => {
    trackListingEvent("listing_view", {
      city: property.city,
      has_pool: property.hasPool,
      property_id: property.id,
    });
  }, [property.city, property.hasPool, property.id]);

  const renderActions: BookingRenderActions = (context) => (
    <ContactActions context={context} property={property} />
  );

  return (
    <>
      <div className="enter-from-left hidden w-full flex-col gap-3 md:sticky md:top-36 md:flex">
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
