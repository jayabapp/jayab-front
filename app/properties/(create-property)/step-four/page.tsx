"use client";
import { PropertyService } from "@/api_services/property/property.service";
import CreateEditProperty, { CreateProperyStepOne } from "@/components/Adds/CreateEditProperty";
import CreateEditPropertyEnvInfo, { CreateProperyStepThree } from "@/components/Adds/CreateEditPropertyEnvInfo";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import StepShower from "@/components/shared/StepShower";
import { p2e } from "@/helpers/NumberConverter";
import { useStoreInit } from "@/store";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateProperty = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);

  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP CREATION                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: PropertyService.InitProperty,
    enabled: false,
  });

  const [values, setValues] = useState<CreateProperyStepThree>({
    access: "",
    distance_dscr: "",
    neighborhood: "",
    pattern: "",
    pattern_dscr: "",
  });

  useEffect(() => {
    if (!!userInfo) {
      if (!userInfo?.owner_id) {
        router.push(`/profile/edit?redirect_url=${pathname}`);
      } else {
        refetch();
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (!!initPropData) {
      //   setValues({
      //   });
    }
  }, [initPropData]);

  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetEnv,
    onSuccess: () => {
      router.push("/properties/step-five");
    },
  });
  const onSubmit = () => {
    if (!!initPropData?.id) {
      mutate({ ...values, propertyId: initPropData?.id });
    }
  };

  return (
    <div
      id="homeParent"
      className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      {/* <PageHeaders title={_STRINGS.REGISTER_PROPERTY} /> */}

      <div className="w-full pb-4 px-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps} value={4} />
      </div>

      <CreateEditPropertyEnvInfo onChange={onChange} values={values} />

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.CHECK_CREDENTIOALS}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreateProperty;
