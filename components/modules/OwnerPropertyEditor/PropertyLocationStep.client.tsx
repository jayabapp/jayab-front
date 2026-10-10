"use client";

import { useOwnerPropertyStep } from "@features/owner-property/hooks/useOwnerPropertyStep";
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

const TEHRAN_CENTER = [51.37, 35.767];

const PropertyLocationStep = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations("owner");

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
      onSubmit={onSubmit}
      isPending={isPending}
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
            passedText={centerAddress}
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
          setCenterAddressLoading={setCenterAddressLoading}
        />
      </div>

      <SearchPlaceModal
        center={center}
        show={showSearch}
        setJumpTo={setJumpTo}
        setShow={setShowSearch}
        title={t("searchPlaceInput")}
      />
    </PropertyStepFrame>
  );
};

export default PropertyLocationStep;
