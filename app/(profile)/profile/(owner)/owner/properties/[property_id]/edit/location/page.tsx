"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { useEffect, useState } from "react";
import { createPropertySteps } from "@/utils/constantss";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import SearchPlaceModal from "@/components/Map/SearchPlaceModal";
import StepShower from "@/components/shared/StepShower";
import SearchBox from "@/components/SearchBoxComp";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";
import Button from "@elements/Button";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CreateProperty = () => {
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const [showSearch, setShowSearch] = useState(false);
  const [center, setCenter] = useState([51.37, 35.767]);
  const [, setCenterAddressLoading] = useState(false);
  const [centerAddress, setCenterAddress] = useState("");

  const [jompTo, setJumpTo] = useState<{
    lat: string | number;
    lng: string | number;
  } | null>(null);

  const router = useRouter();
  const params = useParams();
  const { property_id } = params;
  const propertyId = `${property_id ?? ""}`;
  const { data: initPropData, isLoading } = usePropertyDraft(propertyId);

  useEffect(() => {
    if (!!initPropData?.lat) {
      setJumpTo({
        lat: Number(initPropData?.lat),
        lng: Number(initPropData?.lng),
      });
    }
  }, [initPropData]);

  const { mutate, isPending } = usePropertyDraftStep(
    "location",
    propertyId,
    () => {
      if (!!!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else router.push(`/profile/owner/properties/${property_id}/edit/media`);
    },
  );

  const onSubmit = () => {
    if (initPropData?.id)
      mutate({
        lat: center[1],
        lng: center[0],
        propertyId: initPropData?.id,
      });
  };
  return (
    <div
      id="homeParent"
      className="profile-container  md:!px-3 lg:!px-4 xl:!px-[15%] !px-0 items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower
          steps={createPropertySteps(initPropData?.id) || []}
          value={2}
        />
      </div>
      {isLoading ? (
        <PropertyEditStepSkeleton variant="map" />
      ) : (
        <div className="w-full  h-[70dvh] relative">
          <div
            onClick={() => {
              setShowSearch(true);
            }}
            className="absolute top-2 z-1 left-0 right-0  w-[70%] md:w-1/2 mx-auto "
          >
            <SearchBox
              autofocus={false}
              onClear={() => {}}
              onSubmit={() => {}}
              containerClass="  "
              disableTypeing={true}
              passedText={centerAddress}
              boxId={"SEARCH_BOX_Mobile"}
              item={{ disable_cancel: true }}
              placeholder={_STRINGS?.SEARCH_PLACE_INPUT}
            />
          </div>
          <Map
            center={center}
            jumpToState={jompTo}
            setCenter={setCenter}
            containerClass="  w-full "
            setCenterAddress={setCenterAddress}
            setCenterAddressLoading={setCenterAddressLoading}
          />
        </div>
      )}
      <FixedBottomContainer>
        <Button
          loading={isPending}
          width=" w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.SUBMIT_MOVE_ON}
          containerClass="w-full flex items-center justify-center"
          onClick={() => {
            onSubmit();
          }}
        />
      </FixedBottomContainer>

      <SearchPlaceModal
        center={center}
        show={showSearch}
        setJumpTo={setJumpTo}
        setShow={setShowSearch}
        title={_STRINGS?.SEARCH_PLACE_INPUT}
      />
    </div>
  );
};

export default CreateProperty;
