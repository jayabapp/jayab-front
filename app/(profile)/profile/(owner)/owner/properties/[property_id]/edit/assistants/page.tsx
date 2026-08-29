"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useRouter, useSearchParams } from "next/navigation";
import { usePropertyDraftStep } from "@features/owner-property/hooks/usePropertyDraftStep";
import { createPropertySteps } from "@/utils/constantss";
import { useEffect, useState } from "react";
import { AssistantSendDto } from "@/api_services/property/property.interface";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { useParams } from "next/navigation";

import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";
import StepShower from "@/components/shared/StepShower";
import { FormInput } from "@elements/Form";
import { Checkbox } from "@elements/Form";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Notify from "@elements/Toast";

const CreatePropertyAssistance = () => {
  const searchParams = useSearchParams();
  const edit_mode = searchParams.get("edit_mode");
  const router = useRouter();
  const params = useParams();
  const { property_id } = params;

  const propertyId = `${property_id ?? ""}`;
  const { data: initPropData, isLoading } = usePropertyDraft(propertyId);

  const [values, setValues] = useState<AssistantSendDto>({
    assistant_full_name: "",
    assistant_mobile: "",
    show_mobile_type: 1,
  });
  useEffect(() => {
    if (!!initPropData?.contact_type) {
      const assistant = initPropData.assistants?.find(
        (contact) => contact.is_owner === false,
      );
      setValues({
        show_mobile_type: Number(initPropData.contact_type),
        assistant_full_name: assistant?.assistant_full_name ?? "",
        assistant_mobile: assistant?.assistant_mobile_number ?? "",
      });
    }
  }, [initPropData]);
  const onChange = (value: string | number | null | number[], key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = usePropertyDraftStep(
    "assistants",
    propertyId,
    () => {
      if (!!edit_mode)
        router.replace(`/profile/owner/properties/${property_id}/edit`);
      else router.push(`/profile/owner/properties/${property_id}/edit/terms`);
    },
  );
  const onSubmit = () => {
    const needsAssistantContact = [2, 3].includes(
      Number(values?.show_mobile_type),
    );
    if (
      needsAssistantContact &&
      !`${values?.assistant_full_name || ""}`.trim()
    ) {
      return Notify({ type: "warn", body: "نام دستیار را وارد کنید" });
    }
    if (needsAssistantContact && !`${values?.assistant_mobile || ""}`.trim())
      return Notify({ type: "warn", body: "شماره تماس دستیار را وارد کنید" });
    if (!!initPropData?.id) {
      mutate({
        assistant_full_name: values?.assistant_full_name || undefined,
        assistant_mobile: values?.assistant_mobile || undefined,
        propertyId: initPropData?.id,
        show_mobile_type: values?.show_mobile_type || undefined,
      });
    }
  };

  return (
    <div
      id="homeParent"
      className=" profile-container   items-center   transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className="w-full px-4 md:px-0 pb-4 pt-8">
        <StepShower steps={createPropertySteps(initPropData?.id)} value={8} />
      </div>
      {isLoading ? (
        <PropertyEditStepSkeleton variant="form" />
      ) : (
        <>
          <div className="flex flex-col gap-2 w-full">
            <Checkbox
              rounded="rounded-full"
              title={_STRINGS.SHOW_OWNERS_PHONE}
              isChecked={values?.show_mobile_type == 1}
              onSelect={() => {
                onChange(1, "show_mobile_type");
              }}
            />
            <Checkbox
              rounded="rounded-full"
              title={_STRINGS.SHOW_ASSISTANT_PHONE}
              isChecked={values?.show_mobile_type == 2}
              onSelect={() => {
                onChange(2, "show_mobile_type");
              }}
            />
            <Checkbox
              rounded="rounded-full"
              title={_STRINGS.SHOW_BOTH_PHONE}
              isChecked={values?.show_mobile_type == 3}
              onSelect={() => {
                onChange(3, "show_mobile_type");
              }}
            />
          </div>
          {values?.show_mobile_type != 1 ? (
            <>
              {" "}
              <FormInput
                item={{
                  title: _STRINGS.ASSISTANT_NAME,
                  isMandatory: true,
                  containerClass: "w-full",
                }}
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
            </>
          ) : (
            <></>
          )}
        </>
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

export default CreatePropertyAssistance;
