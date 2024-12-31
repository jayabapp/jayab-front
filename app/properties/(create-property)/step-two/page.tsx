"use client";
import { PropertyService } from "@/api_services/property/property.service";
import PageHeaders from "@/components/headers/PageHeader";
import SearchPlaceModal from "@/components/Map/SearchPlaceModal";
import SearchBox from "@/components/SearchBoxComp";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import StepShower from "@/components/shared/StepShower";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const CreateProperty = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        ssr: false,
      }),
    []
  );
  const [showSearch, setShowSearch] = useState(false);
  const [center, setCenter] = useState([51.37, 35.767]);
  const [centerAddressLoading, setCenterAddressLoading] = useState(false);
  const [centerAddress, setCenterAddress] = useState("");

  const [jompTo, setJumpTo] = useState<{ lat: string | number; lng: string | number } | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);

  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP  DATA                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: PropertyService.InitProperty,
  });

  useEffect(() => {
    if (!!initPropData?.lat) {
      console.log(initPropData?.lat);
      setCenter([Number(initPropData?.lng), Number(initPropData?.lat)]);
    }
  }, [initPropData]);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetLocation,
    onSuccess: () => {
      router.push("/properties/step-three");
    },
  });

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
      className="container  md:!px-3 lg:!px-4 xl:!px-[15%] !px-0 items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.REGISTER_PROPERTY} />

      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps} value={2} />
      </div>
      <div className="w-full  h-[70dvh] relative">
        <div
          onClick={() => {
            setShowSearch(true);
          }}
          className="absolute top-2 z-1 left-0 right-0  w-4/5 md:w-1/2 mx-auto "
        >
          <SearchBox
            containerClass="  "
            boxId={"SEARCH_BOX_Mobile"}
            placeholder={_STRINGS?.SEARCH_PLACE_INPUT}
            onSubmit={() => {}}
            onClear={() => {}}
            autofocus={false}
            disableTypeing={true}
            passedText={centerAddress}
          />
        </div>
        <Map
          jumpToState={jompTo}
          containerClass="  w-full "
          center={center}
          setCenter={setCenter}
          setCenterAddress={setCenterAddress}
          setCenterAddressLoading={setCenterAddressLoading}
        />
      </div>

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.SUBMIT_MOVE_ON}
        />
      </FixedBottomContainer>

      <SearchPlaceModal
        title={_STRINGS?.SEARCH_PLACE_INPUT}
        show={showSearch}
        center={center}
        setShow={setShowSearch}
        setJumpTo={setJumpTo}
      />
    </div>
  );
};

export default CreateProperty;
