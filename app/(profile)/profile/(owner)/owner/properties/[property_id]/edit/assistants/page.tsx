"use client";
import { AssistantSendDto, PricingPropertySendDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import TitleCounter from "@/components/properties/TitleCounter";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import Checkbox from "@/components/shared/Form/Checkbox";
import FormInput from "@/components/shared/Form/FormInput";
import FormInputWithExternalUnit from "@/components/shared/Form/FormInputWithExternalUnit";
import RangeWithTitle from "@/components/shared/Form/RangeWithTitle";
import StepShower from "@/components/shared/StepShower";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreatePropertyAssistance = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useParams();
  const { property_id } = params;

  /* -------------------------------------------------------------------------- */
  /*                             INIT PROP CREATION                             */
  /* -------------------------------------------------------------------------- */
  const { data: initPropData } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, property_id],
    queryFn: () => {
      if (!!property_id) {
        return PropertyService.InitProperty({ property_id: `${property_id}` });
      } else return null;
    },
    gcTime: 0,
    staleTime: 0,
  });

  const [values, setValues] = useState<AssistantSendDto>({
    assistant_full_name: "",
    assistant_mobile: "",
    show_mobile_type: 1,
  });
  useEffect(() => {
    if (!!initPropData?.contact_type) {
      setValues({
        show_mobile_type: initPropData?.contact_type,
        assistant_full_name: initPropData?.assistants?.[0]?.assistant_full_name || "",
        assistant_mobile: initPropData?.assistants?.[0]?.assistant_mobile_number || "",
      });
    }
  }, [initPropData]);

  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.CreatePropertySetAssistant,
    onSuccess: () => {
      router.push(`/profile/owner/properties/${property_id}/edit/terms`);
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
      className=" profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      {/* <PageHeaders title={_STRINGS.CAPS_N_PRICES} /> */}
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        {" "}
        <StepShower steps={createPropertySteps} value={8} />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Checkbox
          rounded="rounded-full"
          isChecked={values?.show_mobile_type == 1}
          onSelect={() => {
            onChange(1, "show_mobile_type");
          }}
          title={_STRINGS.SHOW_OWNERS_PHONE}
        />
        <Checkbox
          rounded="rounded-full"
          isChecked={values?.show_mobile_type == 2}
          onSelect={() => {
            onChange(2, "show_mobile_type");
          }}
          title={_STRINGS.SHOW_ASSISTANT_PHONE}
        />
        <Checkbox
          rounded="rounded-full"
          isChecked={values?.show_mobile_type == 3}
          onSelect={() => {
            onChange(3, "show_mobile_type");
          }}
          title={_STRINGS.SHOW_BOTH_PHONE}
        />
      </div>

      {/* {values?.show_mobile_type == 3 || values?.show_mobile_type == 2 ? (
        <> */}
      <FormInput
        item={{ title: _STRINGS.ASSISTANT_NAME, isMandatory: true, containerClass: "w-full" }}
        value={values?.assistant_full_name || ""}
        onChangeText={(e) => {
          onChange(e, "assistant_full_name");
        }}
      />
      <FormInput
        item={{
          title: _STRINGS.ASSISTANT_PHONE,
          isMandatory: true,
          containerClass: "w-full",
          keyboard: "number",
          maxLength: 11,
        }}
        value={values?.assistant_mobile || ""}
        onChangeText={(e) => {
          onChange(e, "assistant_mobile");
        }}
      />
      {/* </>
      ) : (
        <></>
      )} */}

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
    </div>
  );
};

export default CreatePropertyAssistance;
