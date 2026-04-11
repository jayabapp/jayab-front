"use client";
import { PropertyService } from "@/api_services/property/property.service";
import SearchPlaceModal from "@/components/Map/SearchPlaceModal";
import SearchBox from "@/components/SearchBoxComp";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import StepShower from "@/components/shared/StepShower";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CreateProperty = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        ssr: false,
      }),
    [],
  );
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const [showSearch, setShowSearch] = useState(false);
  const [center, setCenter] = useState([51.37, 35.767]);
  const [centerAddressLoading, setCenterAddressLoading] = useState(false);
  const [centerAddress, setCenterAddress] = useState("");

  const [jompTo, setJumpTo] = useState<{ lat: string | number; lng: string | number } | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);
  const params = useParams();
  const { property_id } = params;
  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP CREATION                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      } else return null;
    },
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (!!initPropData?.lat) {
      setJumpTo({ lat: Number(initPropData?.lat), lng: Number(initPropData?.lng) });
    }
  }, [initPropData]);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetLocation,
    onSuccess: () => {
      if (!!!!edit_mode) {
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      } else {
        router.push(`/profile/owner/properties/${property_id}/edit/media`);
      }
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
      className="profile-container  md:!px-3 lg:!px-4 xl:!px-[15%] !px-0 items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps(initPropData?.id) || []} value={2} />
      </div>
      {isLoading ? (
        <LottieLoading />
      ) : (
        <div className="w-full  h-[70dvh] relative">
          <div
            onClick={() => {
              setShowSearch(true);
            }}
            className="absolute top-2 z-1 left-0 right-0  w-[70%] md:w-1/2 mx-auto "
          >
            <SearchBox
              item={{ disable_cancel: true }}
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
      )}
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
