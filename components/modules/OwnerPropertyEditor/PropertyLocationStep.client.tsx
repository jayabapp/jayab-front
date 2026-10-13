"use client";

import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import { usePropertyLocation } from "@features/owner-property/hooks/usePropertyLocation";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { SearchPlaceModal } from "@modules/PropertyMap";
import { useTranslations } from "next-intl";
import { SearchInput } from "@modules/Search";
import { useState } from "react";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(
  () =>
    import("@modules/PropertyMap").then((module) => module.PropertyLocationMap),
  { ssr: false },
);

const PropertyLocationStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations("owner");

  const { data: draft, isLoading } = usePropertyDraft(propertyId);
  const { isPending, submit } = useOwnerPropertyStep("location", propertyId);

  const [showSearch, setShowSearch] = useState(false);
  const [centerAddress, setCenterAddress] = useState("");
  const { address, center, setCenter, jumpTo, selectPoint, hasMoved, isLocating } =
    usePropertyLocation(draft);
  const displayedAddress = hasMoved ? centerAddress || address : address;

  const onSubmit = () => {
    if (!draft?.id || isLocating) return;
    submit({ lat: center[1], lng: center[0], propertyId: draft?.id });
  };

  return (
    <PropertyStepFrame
      step="location"
      skeleton="map"
      onSubmit={onSubmit}
      isPending={isPending || isLocating}
      isLoading={isLoading}
      propertyId={propertyId}
      submitTitle={t("submitMoveOn")}
      headerClass="w-full px-4 md:px-0 pb-4 pt-8"
    >
      <div className="w-full h-[70dvh] relative">
        <div
          onClick={() => setShowSearch(true)}
          className="absolute top-2 z-1 end-0 start-0 w-[70%] md:w-1/2 mx-auto cursor-pointer"
        >
          <SearchInput
            autofocus={false}
            onClear={() => {}}
            onSubmit={() => {}}
            containerClass="  "
            disableTypeing={true}
            boxId="SEARCH_BOX_Mobile"
            passedText={displayedAddress}
            item={{ disable_cancel: true }}
            placeholder={t("searchPlaceInput")}
          />
        </div>
        <PropertyLocationMap
          center={center}
          jumpToState={jumpTo}
          setCenter={setCenter}
          containerClass="w-full"
          setCenterAddress={setCenterAddress}
        />
      </div>

      <SearchPlaceModal
        key={showSearch ? "open" : "closed"}
        center={center}
        initialSearch={displayedAddress}
        show={showSearch}
        setJumpTo={selectPoint}
        setShow={setShowSearch}
        title={t("searchPlaceInput")}
      />
    </PropertyStepFrame>
  );
};

export default PropertyLocationStep;
