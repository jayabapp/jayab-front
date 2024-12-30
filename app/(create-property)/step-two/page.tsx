"use client";
import { PropertyService } from "@/api_services/property/property.service";
import PageHeaders from "@/components/headers/PageHeader";
import SearchPlaceModal from "@/components/Map/SearchPlaceModal";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import StepShower from "@/components/shared/StepShower";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);

  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP  DATA                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: PropertyService.InitProperty,
    enabled: false,
  });

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
        <Button
          color="primary"
          variant="solid"
          containerClass=" z-1 absolute left-4 top-4"
          onClick={() => {
            setShowSearch(true);
          }}
          title={_STRINGS.SEARCH_PLACE}
        />
        <Map
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
            // onSubmit();
          }}
          //   loading={isPending}
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
      />
    </div>
  );
};

export default CreateProperty;
