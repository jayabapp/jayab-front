"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateProperyStepThree } from "@/components/properties/CreateEditPropertyEnvInfo";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { createPropertySteps } from "@/utils/constantss";
import { useEffect, useState } from "react";
import { PropertyService } from "@/api_services/property/property.service";
import { useParams } from "next/navigation";

import CreateEditPropertyEnvInfo from "@/components/properties/CreateEditPropertyEnvInfo";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import StepShower from "@/components/shared/StepShower";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";

const CreateProperty = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const params = useParams();
  const { property_id } = params;

  const { data: initPropData, isLoading } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id)
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      else return null;
    },
    staleTime: STALE_TIME.MEDIUM,
    gcTime: GC_TIME.LONG,
  });

  const [values, setValues] = useState<CreateProperyStepThree>({
    access: "",
    distance_dscr: "",
    neighborhood: "",
    pattern: "",
    pattern_dscr: "",
  });

  useEffect(() => {
    if (!!initPropData) {
      setValues({
        access:
          initPropData?.property_options?.find(
            (e) => e?.option?.group == "ACCESS",
          )?.option_id || null,
        neighborhood:
          initPropData?.property_options?.find(
            (e) => e?.option?.group == "NEIGHBORHOOD",
          )?.option_id || null,
        pattern:
          initPropData?.property_options?.find(
            (e) => e?.option?.group == "PATTERN",
          )?.option_id || null,
        distance_dscr: initPropData?.description?.distance_dscr,
        pattern_dscr: initPropData?.description?.pattern_dscr,
      });
    }
  }, [initPropData]);

  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetEnv,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
      });
      if (!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else router.push(`/profile/owner/properties/${property_id}/edit/bedroom`);
    },
  });
  const onSubmit = () => {
    if (!!initPropData?.id) mutate({ ...values, propertyId: initPropData?.id });
  };

  return (
    <div
      id="homeParent"
      className="profile-container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full pb-4 px-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps(initPropData?.id)} value={4} />
      </div>

      {isLoading ? (
        <LottieLoading />
      ) : (
        <CreateEditPropertyEnvInfo onChange={onChange} values={values} />
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
    </div>
  );
};

export default CreateProperty;
