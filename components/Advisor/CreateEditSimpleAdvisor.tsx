import React from "react";
import { FormInput } from "@elements/Form";
import _STRINGS from "@/utils/LocalStrings";
import { CreateAdvisorDto } from "@/api_services/advisor/advisor.interface";

import MainUploader from "../uploader";

const CreateEditSimpleAdvisor = ({
  values,
  setValues,
}: {
  values: CreateAdvisorDto & {
    province?: string | number | null;
    profile_image: any;
    national_card_image: any;
    document_image: any;
  };
  setValues: React.Dispatch<
    React.SetStateAction<
      CreateAdvisorDto & {
        province?: string | number | null;
        profile_image: any;
        national_card_image: any;
        document_image: any;
      }
    >
  >;
}) => {
  const onChange = (value: string | number | null | boolean, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <div className="w-full flex items-center  flex-col gap-3  md:gap-4 md:flex-row">
        <FormInput
          item={{ title: _STRINGS.FULL_NAME, isMandatory: true, containerClass: "w-full" }}
          value={values?.full_name || ""}
          onChangeText={(e) => {
            onChange(e, "full_name");
          }}
        />
      </div>

      <div
        className="w-full flex items-center justify-center
 flex-col"
      >
        <p className="w-full text-start text-sm md:text-base">{_STRINGS.YOUR_IMAGE} </p>

        <MainUploader
          title={_STRINGS.IMAGE}
          withCrop
          // isLogo
          link="/attachments?type=PROFILE"
          key={`uploader`}
          innerClasses={{ sizeClass: "!bg-white  !border !border-dashed   w-24 h-24 !border-neutral-300 " }}
          containerClass={"my-3  !w-full flex items-start justify-start "}
          item={values?.profile_image}
          onSelect={(file) => {
            onChange(file, "profile_image");
          }}
          onDelete={() => {
            onChange(null, "profile_image");
          }}
        />
      </div>
    </div>
  );
};

export default CreateEditSimpleAdvisor;
