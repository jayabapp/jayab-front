"use client";

import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { SearchPlaceModal } from "@modules/PropertyMap";
import { SearchInput } from "@modules/Search";
import { useState } from "react";

import PropertyStepFrame from "./parts/PropertyStepFrame.client";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(
  () =>
    import("@modules/PropertyMap").then((module) => module.PropertyLocationMap),
  { ssr: false },
);

const TEHRAN_CENTER = [51.37, 35.767];

const PropertyLocationStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const { data: draft, isLoading } = usePropertyDraft(propertyId);
  const { isPending, submit } = useOwnerPropertyStep("location", propertyId);

  const [showSearch, setShowSearch] = useState(false);
  const [center, setCenter] = useState(TEHRAN_CENTER);
  const [, setCenterAddressLoading] = useState(false);
  const [centerAddress, setCenterAddress] = useState("");
  const [jumpTo, setJumpTo] = useState<{
    lat: number | string;
    lng: number | string;
  } | null>(null);

  const savedPin = draft?.lat
    ? { lat: Number(draft?.lat), lng: Number(draft?.lng) }
    : null;
  const [pinKey, setPinKey] = useState("");
  const savedPinKey = `${draft?.id ?? ""}:${draft?.lat ?? ""}`;
  if (savedPin && pinKey !== savedPinKey) {
    setPinKey(savedPinKey);
    setJumpTo(savedPin);
  }

  const onSubmit = () => {
    if (!draft?.id) return;
    submit({ lat: center[1], lng: center[0], propertyId: draft?.id });
  };

  return (
    <PropertyStepFrame
      step="location"
      skeleton="map"
      isPending={isPending}
      isLoading={isLoading}
      onSubmit={onSubmit}
      propertyId={propertyId}
      submitTitle={_STRINGS.SUBMIT_MOVE_ON}
      headerClass="w-full px-4 md:px-0 pb-4 pt-8"
    >
      <div className="w-full h-[70dvh] relative">
        <div
          onClick={() => setShowSearch(true)}
          className="absolute top-2 z-1 left-0 right-0 w-[70%] md:w-1/2 mx-auto"
        >
          <SearchInput
            autofocus={false}
            onClear={() => {}}
            onSubmit={() => {}}
            containerClass="  "
            disableTypeing={true}
            passedText={centerAddress}
            boxId="SEARCH_BOX_Mobile"
            item={{ disable_cancel: true }}
            placeholder={_STRINGS?.SEARCH_PLACE_INPUT}
          />
        </div>
        <PropertyLocationMap
          center={center}
          jumpToState={jumpTo}
          setCenter={setCenter}
          containerClass="  w-full "
          setCenterAddress={setCenterAddress}
          setCenterAddressLoading={setCenterAddressLoading}
        />
      </div>

      <SearchPlaceModal
        center={center}
        show={showSearch}
        setJumpTo={setJumpTo}
        setShow={setShowSearch}
        title={_STRINGS?.SEARCH_PLACE_INPUT}
      />
    </PropertyStepFrame>
  );
};

export default PropertyLocationStep;
